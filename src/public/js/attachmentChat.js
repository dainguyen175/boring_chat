function attachmentChat(divId) {
  $(`#attachment-chat-${divId}`).unbind("change").on("change", function (){
    let fileData= $(this).prop("files")[0];
    let limit = 1048576; // byte= 1MB

    if (fileData.size > limit ){
      alertify.notify("Tệp đính kèm cho phép upload tối đa 1MB.", "error", 5);
      $(this).var(null);
      return false;
    };

    let targetId =$(this).data("chat");
    let isChatGroup = false;

    let messageFormData = new FormData();
    messageFormData.append("my-attachment-chat", fileData);
    messageFormData.append("uid", targetId);

    if ($(this).hasClass("chat-in-group")){
      messageFormData.append("isChatGroup", true);
      isChatGroup = true;
    }

    $.ajax({
      url: "/message/add-new-attachment",
      type: "post",
      cache: false,
      contentType: false,
      processData: false,
      data: messageFormData,
      success: function(data){
        let dataToEmit = {
          message : data.message
        };

        // Step 1: handle message data before show
        let messageOfMe = $(`<div class="bubble me bubble-attachment-file" data-mess-id="${data.message._id}"> </div>`);
        let attachmentChat = `
          <a href="data:${data.message.file.contentType}; base64, ${bufferToBase64(data.message.file.data.data)}" 
            download="${data.message.file.fileName}">
            ${data.message.file.fileName}
          </a>`;
    
        if (isChatGroup){
          increaseNumberMessageGroup(divId);
          dataToEmit.groupId = targetId;
        } else{
          dataToEmit.contactId = targetId;
        };
        let senderAvatar= `<img src="/images/users/${data.message.sender.avatar}" class="avatar-small" title="${data.message.sender.name}" />`;

        messageOfMe.html( `${senderAvatar} ${attachmentChat}`) 

        // step 2: append message data to screen
        $(`.right .chat[data-chat=${divId}]`).append(messageOfMe);
        nineScrollRight(divId);

        // Step 3: remove all data input : nothing to code 

        // Step 4: change data, time preview in leftside
        $(`.person[data-chat=${divId}]`).find("span.time").removeClass("message-time-realtime").html(moment(data.message.createdAt).locale("vi").startOf("seconds").fromNow());
        $(`.person[data-chat=${divId}]`).find("span.preview").html("Tệp đính kèm...");  

        //Step 05: move conversation to the top
        $(`.person[data-chat=${divId}]`).on("chibi.moveConversationToTheTop", function () {
          let dataToMove = $(this).parent();
          $(this).closest("ul").prepend(dataToMove);
          $(this).off("chibi.moveConversationToTheTop");
        })
        $(`.person[data-chat=${divId}]`).trigger("chibi.moveConversationToTheTop");

        // Step 6: emit realtime
        socket.emit("chat-attachment", dataToEmit);

        // Step 7: emit remove typing off realtime: nothing to code

        // Step 8: If this has typing, remove that immediate : nothing to code

        // step 9: Add to attachment modal
        let attachmentChatToAddModal = `
          <li>
            <a href="data:${data.message.file.contentType}; base64,${bufferToBase64(data.message.file.data.data)}" 
                  download="${data.message.file.fileName}">
              ${data.message.file.fileName}
            </a>
          </li>`
        $(`#attachmentsModal_${divId}`).find("ul.list-attachments").append(attachmentChatToAddModal); 
      },
      error: function(error){
        alertify.notify(error.responseText, "error", 5);
      },
    });
  })
}

$(document).ready (function (){
  socket.on("response-chat-attachment", function (response){
    let divId ="";

    // Step 1: handle message data before show
    let messageOfYou = $(`<div class="bubble you bubble-attachment-file" data-mess-id="${response.message._id}"> </div>`);
    let attachmentChat = `
          <a href="data:${response.message.file.contentType}; base64, ${bufferToBase64(response.message.file.data.data)}" 
            download="${response.message.file.fileName}">
            ${response.message.file.fileName}
          </a>`;

    if (response.currentGroupId){
      divId = response.currentGroupId;
      if (response.currentUserId !== $("#dropdown-navbar-user").data("uid")){
        increaseNumberMessageGroup(divId);
      }
    } else{
      divId = response.currentUserId;
    };

    let senderAvatar= `<img src="/images/users/${response.message.sender.avatar}" class="avatar-small" title="${response.message.sender.name}" />`;

    messageOfYou.html( `${senderAvatar} ${attachmentChat}`)  
    
    // step 2: append message data to screen
    if (response.currentUserId !== $("#dropdown-navbar-user").data("uid")){
      $(`.right .chat[data-chat=${divId}]`).append(messageOfYou);
      nineScrollRight(divId);
      $(`.person[data-chat=${divId}]`).find("span.time").addClass("message-time-realtime");
    }

    // step 3: remove all data input : nothing to code 

    // Step 4: change data, time preview in leftside
    $(`.person[data-chat=${divId}]`).find("span.time").html(moment(response.message.createdAt).locale("vi").startOf("seconds").fromNow());
    $(`.person[data-chat=${divId}]`).find("span.preview").html("Tệp đính kèm...");

    //Step 05: move conversation to the top
    $(`.person[data-chat=${divId}]`).on("chibi.moveConversationToTheTop", function () {
      let dataToMove = $(this).parent();
      $(this).closest("ul").prepend(dataToMove);
      $(this).off("chibi.moveConversationToTheTop");
    })
    $(`.person[data-chat=${divId}]`).trigger("chibi.moveConversationToTheTop");

    // Step 6: emit realtime: nothing to code

    // Step 7: emit remove typing off realtime : nothing to code

    // Step 8: If this has typing, remove that immediate : nothing to code

    // Step 9: Add to images modal
    if (response.currentUserId !== $("#dropdown-navbar-user").data("uid")){
      let attachmentChatToAddModal = `
          <li>
            <a href="data:${response.message.file.contentType}; base64,${bufferToBase64(response.message.file.data.data)}" 
                  download="${response.message.file.fileName}">
              ${response.message.file.fileName}
            </a>
          </li>`
      $(`#attachmentsModal_${divId}`).find("ul.list-attachments").append(attachmentChatToAddModal); 
    }
  })
})
