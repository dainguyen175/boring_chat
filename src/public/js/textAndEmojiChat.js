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
        // Step 1: handle message data before show
        let messageOfMe = $(`<div class="bubble me data-mess-id="${data.message._id}"> </div>`);
        if (dataTextEmojiForSend.isChatGroup){
          messageOfMe.html(`<img src="/images/users/${data.message.sender.avatar}" class="avatar-small" title="${data.message.sender.name}`);

          messageOfMe.text(data.message.text);
          increaseNumberMessageGroup(divId);
        } else{
          messageOfMe.html(`<img src="/images/users/${data.message.sender.avatar}" class="avatar-small" title="${data.message.sender.name}`);

          messageOfMe.text(data.message.text);
        }

        // convert unicode emoji
        let convertEmojiMessage =emojione.toImage(messageOfMe.html());
        messageOfMe.html(convertEmojiMessage);

        // step 2: append message data to screen
        $(`.right .chat[data-chat=${divId}]`).append(messageOfMe);
        nineScrollRight(divId);

        // Step 3: remove all data input
        $(`#write-chat-${divId}`).val("");
        currentEmojioneArea.find(".emojionearea-editor").text("");

        // Step 4: change data, time preview in leftside
        $(`.person[data-chat=${divId}]`).find("span.time").html(moment(data.message.createdAt).locale("vi").startOf("seconds").fromNow());
        $(`.person[data-chat=${divId}]`).find("span.preview").html(emojione.toImage(data.message.text));  // xấu quá không muốn dùng
        // $(`.person[data-chat=${divId}]`).find("span.preview").html(data.message.text)

        //Step 05: move conversation to the top
        $(`.person[data-chat=${divId}]`).on("click.moveConversationToTheTop", function () {
          let dataToMove = $(this).parent();
          $(this).closest("ul").prepend(dataToMove);
          $(this).off("click.moveConversationToTheTop");
        })
        $(`.person[data-chat=${divId}]`).click();

        // Step 6: emit realtime
        
      }).fail( function (response){
        alertify.noshtify(response.responseText, "error", 5);
      })
    }

  });
};
