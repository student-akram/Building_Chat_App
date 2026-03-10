module.exports = (io, socket) => {

socket.on("join_room",(userId)=>{

const room = `user_${userId}`;

socket.join(room);

console.log(`User ${userId} joined ${room}`);

});

socket.on("new_message",(data)=>{

const {receiverId,message} = data;

const room = `user_${receiverId}`;

io.to(room).emit("personal_message",{
message,
senderId: socket.user.id
});

});

};