/**
 * 
 * @param io from socket.io lib 
 */
let addNewContact = (io) => {
  io.on("connection", (socket) => {
    socket.on("add-new-contact", (data) => { 
      console.log(data);
      console.log(socket.request.user);
    }); 
    // socket.emit("request", /* … */); // emit an event to the socket
    // io.emit("broadcast", /* … */); // emit an event to all connected sockets
    
  });
};

module.exports =addNewContact;