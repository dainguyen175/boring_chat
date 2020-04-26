function videoChat(divId) {
  $(`#video-chat-${divId}`).unbind("click").on("click", function (){
    let targetId = $(this).data("chat");
    let callerName = $("#navbar-username").text();

    let dataToEmit = {
      listenerId: targetId,
      callerName: callerName
    }

    // Step 01 of Caller 
    socket.emit("caller-check-listener-online-or-not", dataToEmit);
  });
}

$(document).ready(function(){
  // Step 02 of Caller
  socket.on("server-send-listener-is-off", function(){
    alertify.notify("Người dùng này hiện không hoạt động. ", "error", 5);
  });

  let getPeerId = "";
  const peer = new Peer();
  //console.log(peer);

  peer.on("open", function(peerId){
    getPeerId = peerId;
  }); 

  // Step 03 of Listener
  socket.on("server-request-peer-id-of-listener", function(response){
    let listenerName = $("#navbar-username").text();
    let dataToEmit = {
      callerId: response.callerId,
      listenerId: response.listenerId,
      callerName: response.callerName,
      listenerName: listenerName,
      listenerPeerId : getPeerId,
    };

    // Step 04 of Listener
    socket.emit("listener-emit-peer-id-to-server", dataToEmit);
  });
  
  // Step 5 of Caller
  socket.on("server-send-peer-id-of-listener-to-caller", function(response){
    let dataToEmit = {
      callerId: response.callerId,
      listenerId: response.listenerId,
      callerName: response.callerName,
      listenerName: response.listenerName,
      listenerPeerId : response.listenerPeerId,
    };

    // Step 6 of Caller
    socket.emit("caller-request-call-to-server", dataToEmit);

    let timerInterval;
    Swal.fire({
      title: `Đang gọi cho &nbsp; <span style="color: #2ECC71;">${response.listenerName}</span> &nbsp; <i class="fa fa-volume-control-phone"></i>`,
      html: `
        Thời gian: <strong style="color: #d43f3a;"></strong> giây. 
        <br/><br/>
        <button id="btn-cancel-call" class="btn btn-danger">
          Huỷ cuộc gọi
        </button>
      `,
      backdrop: "rgba(85, 85, 85, 0.4)",
      width: "52rem", 
      allowOutsideClick: false,
      timer: 30000, // 30s
      onBeforeOpen: () => {
        $("#btn-cancel-call").unbind("click").on("click", function(){
          Swal.close();
          clearInterval(timerInterval);

          // Step 07 of Caller:
          socket.emit("caller-cancel-request-call-to-server", dataToEmit);
        });
        Swal.showLoading();
        timerInterval = setInterval(() =>{
          Swal.getContent().querySelector("strong").textContent = Math.ceil(Swal.getTimerLeft() / 1000);
        },  1000);
      },
      onOpen: () =>{
        // Step 12 of Caller:
        socket.on("server-send-reject-call-to-caller", function(response){
          Swal.close();
          clearInterval(timerInterval); 

          Swal.fire({
            type: "info",
            title: `<span style="color: #2ECC71;">${response.listenerName}</span> &nbsp; hiện tại không thể nghe máy`,
            backdrop: "rgba(85, 85, 85, 0.4)",
            width: "52rem", 
            allowOutsideClick: false,
            confirmButtonColor: "#2ECC71",
            confirmButtonText: "Xác nhận!",
          })
        });

        // Step 13 of Caller
        socket.on("server-send-accept-call-to-caller", function(response){
          Swal.close();
          clearInterval(timerInterval); 

          console.log("Caller ok.");

          //
        });
      },
      onClose: () =>{
        clearInterval(timerInterval);
      }
    }).then((result) =>{
      return false;
    })
  });

  // Step 08 of Listener
  socket.on("server-send-request-call-to-listener", function(response){
    let dataToEmit = {
      callerId: response.callerId,
      listenerId: response.listenerId,
      callerName: response.callerName,
      listenerName: response.listenerName,
      listenerPeerId : response.listenerPeerId,
    };

    let timerInterval;
    Swal.fire({
      title: `<span style="color: #2ECC71;">${response.callerName}</span> &nbsp; <i class="fa fa-volume-control-phone"></i> &nbsp; đang gọi bạn `,
      html: `
        Thời gian: <strong style="color: #d43f3a;"></strong> giây. 
        <br/><br/>
        <button id="btn-accept-call" class="btn btn-success">
          Đồng ý
        </button>
        <button id="btn-reject-call" class="btn btn-danger">
          Từ chối
        </button>
      `,
      backdrop: "rgba(85, 85, 85, 0.4)",
      width: "52rem", 
      allowOutsideClick: false,
      timer: 30000, // 30s
      onBeforeOpen: () => {
        $("#btn-reject-call").unbind("click").on("click", function(){
          Swal.close();
          clearInterval(timerInterval);

          // Step 10 of Listener
          socket.emit("listener-reject-request-call-to-server", dataToEmit);
        });
        $("#btn-accept-call").unbind("click").on("click", function(){
          Swal.close();
          clearInterval(timerInterval);

          // Step 11 of Listener
          socket.emit("listener-accept-request-call-to-server", dataToEmit);
        });

        Swal.showLoading();
        timerInterval = setInterval(() =>{
          Swal.getContent().querySelector("strong").textContent = Math.ceil(Swal.getTimerLeft() / 1000);
        },  1000);
      },
      onOpen: () => {
        // Step 9 of Listener
        socket.on("server-send-cancel-request-call-to-listener", function(response){
          Swal.close();
          clearInterval(timerInterval); 
        });

        // Step 14 of Listener
        socket.on("server-send-accept-call-to-listener", function(response){
          Swal.close();
          clearInterval(timerInterval); 

          console.log("Listener ok.");

          //
        });
      },
      onClose: () =>{
        clearInterval(timerInterval);
      }
    }).then((result) =>{
      return false;
    });
  });

});

