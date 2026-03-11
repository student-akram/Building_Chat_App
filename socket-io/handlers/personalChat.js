module.exports = (io, socket)=>{

socket.on("join_room",(roomId)=>{

socket.join(roomId);

console.log(`User joined room ${roomId}`);

});

socket.on("new_message",(data)=>{

const {roomId,message} = data;

io.to(roomId).emit("new_message",{
message,
senderId: socket.user.id
});

});

};