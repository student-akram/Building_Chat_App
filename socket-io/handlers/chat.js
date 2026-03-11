module.exports = (io, socket)=>{

socket.on("sendMessage",(data)=>{

const { roomId, message } = data;

const msg = {
message,
senderId: socket.user.id,
createdAt: new Date()
};

io.to(roomId).emit("new_message", msg);

});

};