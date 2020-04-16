function bufferToBase64 (buffer) {
  return btoa( new Uint8Array(buffer).reduce((data, byte) => data + String.fromCharCode(byte), "")
  );
}

function imageChat(divId) {
  $(`#image-chat-${divId}`).unbind("change").on("change", function() {
    let fileData= $(this).prop("files")[0];
    let math= ["image/png","image/jpg","image/jpeg"];
    let limit = 1048576; // byte= 1MB

    if ($.inArray(fileData.type, math) === -1 ){
      alertify.notify("Kiểu file không hợp lệ, chỉ chấp nhận jpg & png.", "error", 7);
      $(this).var(null);
      return false;
    };

    if (fileData.size > limit ){
      alertify.notify("Ảnh upload cho phép là 1MB.", "error", 7);
      $(this).var(null);
      return false;
    };

    let targetId =$(this).data("chat");
    let isChatGroup = false;

    let messageFormData = new FormData();
    messageFormData.append("my-image-chat", fileData);
    messageFormData.append("uid", targetId);

    if ($(this).hasClass("chat-in-group")){
      messageFormData.append("isChatGroup", true);
      isChatGroup = true;
    }

    $.ajax({
      url: "/message/add-new-image",
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
        let messageOfMe = $(`<div class="bubble me bubble-image-file" data-mess-id="${data.message._id}"> </div>`);
        
        let imageChat = `<img src="data:${data.message.file.contentType}; base64,${bufferToBase64(data.message.file.data.data)}" class="show-image-chat">`
    
        if (isChatGroup){
          increaseNumberMessageGroup(divId);
          dataToEmit.groupId = targetId;
        } else{
          dataToEmit.contactId = targetId;
        };
        let senderAvatar= `<img src="/images/users/${data.message.sender.avatar}" class="avatar-small" title="${data.message.sender.name}" />`;

        messageOfMe.html( `${senderAvatar} ${imageChat}`) 
        

        // step 2: append message data to screen
        $(`.right .chat[data-chat=${divId}]`).append(messageOfMe);
        nineScrollRight(divId);

        // Step 3: remove all data input : nothing to code 

        // Step 4: change data, time preview in leftside
        $(`.person[data-chat=${divId}]`).find("span.time").removeClass("message-time-realtime").html(moment(data.message.createdAt).locale("vi").startOf("seconds").fromNow());
        $(`.person[data-chat=${divId}]`).find("span.preview").html("Hình ảnh...");  

        //Step 05: move conversation to the top
        $(`.person[data-chat=${divId}]`).on("chibi.moveConversationToTheTop", function () {
          let dataToMove = $(this).parent();
          $(this).closest("ul").prepend(dataToMove);
          $(this).off("chibi.moveConversationToTheTop");
        })
        $(`.person[data-chat=${divId}]`).trigger("chibi.moveConversationToTheTop");

        // Step 6: emit realtime
        socket.emit("chat-image", dataToEmit);

        // Step 7: emit remove typing off realtime: nothing to code

        // Step 8: If this has typing, remove that immediate : nothing to code

        // step 9: Add to images modal
        let imageChatToAddModal = `<img src="data:${data.message.file.contentType}; base64,${bufferToBase64(data.message.file.data.data)} ">`;

        $(`#imagesModal_${divId}`).find("div.all-images").append(imageChatToAddModal);
      },
      error: function(error){
        alertify.notify(error.responseText, "error", 5);
      },
    });
  })
}

$(document).ready( function(){
  socket.on("response-chat-image", function( response ){
    let divId ="";

    // Step 1: handle message data before show
    let messageOfYou = $(`<div class="bubble you bubble-image-file" data-mess-id="${response.message._id}"> </div>`);
    let imageChat = `<img src="data:${response.message.file.contentType}; base64,${bufferToBase64(response.message.file.data.data)}" class="show-image-chat">`;

    if (response.currentGroupId){
      divId = response.currentGroupId;
      if (response.currentUserId !== $("#dropdown-navbar-user").data("uid")){
        increaseNumberMessageGroup(divId);
      }
    } else{
      divId = response.currentUserId;
    };

    let senderAvatar= `<img src="/images/users/${response.message.sender.avatar}" class="avatar-small" title="${response.message.sender.name}" />`;

    messageOfYou.html( `${senderAvatar} ${imageChat}`)  
    
    // step 2: append message data to screen
    if (response.currentUserId !== $("#dropdown-navbar-user").data("uid")){
      $(`.right .chat[data-chat=${divId}]`).append(messageOfYou);
      nineScrollRight(divId);
      $(`.person[data-chat=${divId}]`).find("span.time").addClass("message-time-realtime");
    }

    // step 3: remove all data input : nothing to code 

    // Step 4: change data, time preview in leftside
    $(`.person[data-chat=${divId}]`).find("span.time").html(moment(response.message.createdAt).locale("vi").startOf("seconds").fromNow());
    $(`.person[data-chat=${divId}]`).find("span.preview").html("Hình ảnh...");

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
      let imageChatToAddModal = `<img src="data:${response.message.file.contentType}; base64,${bufferToBase64(response.message.file.data.data)} ">`;
      $(`#imagesModal_${divId}`).find("div.all-images").append(imageChatToAddModal);
    }
  })
})
