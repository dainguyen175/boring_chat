function textAndEmojiChat (divId){
  $(".emojionearea").unbind("keyup").on("keyup", function (element){
    let currentEmojioneArea =$(this);
    if (element.which===13){
      let targetId = $(`#write-chat-${divId}`).data("chat");
      let messageVal = $(`#write-chat-${divId}`).val();

      if(!targetId.length || !messageVal.length){
        return false;
      }

      let dataTextEmojiForSend = {
        uid: targetId,
        messageVal: messageVal 
      } 

      if ($(`#write-chat-${divId}`).hasClass("chat-in-group")){
        dataTextEmojiForSend.isChatGroup= true;
      }
      
      // call send message
      $.post("/message/add-new-text-emoji", dataTextEmojiForSend, function(data){
        let dataToEmit = {
          message : data.message
        };

        // Step 1: handle message data before show
        let messageOfMe = $(`<div class="bubble me" data-mess-id="${data.message._id}"> </div>`);
        messageOfMe.text(data.message.text);
        // convert unicode emoji
        let convertEmojiMessage =emojione.toImage(messageOfMe.html()); // không muốn dùng 
    
        if (dataTextEmojiForSend.isChatGroup){
          increaseNumberMessageGroup(divId);
          dataToEmit.groupId = targetId;
        } else{
          dataToEmit.contactId = targetId;
        };
        let senderAvatar= `<img src="/images/users/${data.message.sender.avatar}" class="avatar-small" title="${data.message.sender.name}" />`;

        messageOfMe.html( `${senderAvatar} ${convertEmojiMessage}`)  //không muốn dùng
        // messageOfMe.html(` ${senderAvatar} ${messageOfMe.html()}`);
        
        // step 2: append message data to screen
        $(`.right .chat[data-chat=${divId}]`).append(messageOfMe);
        nineScrollRight(divId);

        // Step 3: remove all data input
        $(`#write-chat-${divId}`).val("");
        currentEmojioneArea.find(".emojionearea-editor").text("");

        // Step 4: change data, time preview in leftside
        $(`.person[data-chat=${divId}]`).find("span.time").removeClass("message-time-realtime").html(moment(data.message.createdAt).locale("vi").startOf("seconds").fromNow());
        $(`.person[data-chat=${divId}]`).find("span.preview").html(emojione.toImage(data.message.text));  // xấu quá không muốn dùng
        // $(`.person[data-chat=${divId}]`).find("span.preview").html(data.message.text);

        //Step 05: move conversation to the top
        $(`.person[data-chat=${divId}]`).on("chibi.moveConversationToTheTop", function () {
          let dataToMove = $(this).parent();
          $(this).closest("ul").prepend(dataToMove);
          $(this).off("chibi.moveConversationToTheTop");
        })
        $(`.person[data-chat=${divId}]`).trigger("chibi.moveConversationToTheTop");

        // Step 6: emit realtime
        socket.emit("chat-text-emoji", dataToEmit);

        // Step 7: emit remove typing off realtime
        typingOff(divId);

        // Step 8: If this has typing, remove that immediate
        let checkTyping = $(`.chat[data-chat=${divId}]`).find("div.bubble-typing-gif");
        if (checkTyping.length){
          checkTyping.remove();
        }

      }).fail( function (response){
        alertify.notify(response.responseText, "error", 5);
      })
    }

  });
};

$(document).ready( function (){
  socket.on("response-chat-text-emoji", function (response){
    let divId = "";
    
    // Step 1: handle message data before show
    let messageOfYou = $(`<div class="bubble you" data-mess-id="${response.message._id}"> </div>`);
    messageOfYou.text(response.message.text);
    // convert unicode emoji
    let convertEmojiMessage =emojione.toImage(messageOfYou.html()); // không muốn dùng 

    if (response.currentGroupId){
      divId = response.currentGroupId;

      if (response.currentUserId !== $("#dropdown-navbar-user").data("uid")){
        increaseNumberMessageGroup(divId);
      }
    } else{
      divId = response.currentUserId;
    };

    let senderAvatar= `<img src="/images/users/${response.message.sender.avatar}" class="avatar-small" title="${response.message.sender.name}" />`;

    messageOfYou.html( `${senderAvatar} ${convertEmojiMessage}`)  //không muốn dùng
    // messageOfYou.html(` ${senderAvatar} ${messageOfYou.html()}`);
    
    // step 2: append message data to screen
    if (response.currentUserId !== $("#dropdown-navbar-user").data("uid")){
      $(`.right .chat[data-chat=${divId}]`).append(messageOfYou);
      nineScrollRight(divId);
      $(`.person[data-chat=${divId}]`).find("span.time").addClass("message-time-realtime");
    }
    
    // step 3: remove all data input : nothing to code 

    // Step 4: change data, time preview in leftside
    $(`.person[data-chat=${divId}]`).find("span.time").html(moment(response.message.createdAt).locale("vi").startOf("seconds").fromNow());
    $(`.person[data-chat=${divId}]`).find("span.preview").html(emojione.toImage(response.message.text));  // xấu quá không muốn dùng
    // $(`.person[data-chat=${divId}]`).find("span.preview").html(response.message.text);

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
  });
})
