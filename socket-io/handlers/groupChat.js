module.exports = (io, socket) => {

socket.on("create_group",(groupName)=>{

const room = `group_${groupName}`;

socket.join(room);

console.log(`User ${socket.user.id} created and joined ${room}`);

});

socket.on("join_group",(groupName)=>{

const room = `group_${groupName}`;

socket.join(room);

console.log(`User ${socket.user.id} joined ${room}`);

});

socket.on("group_message",(data)=>{

const {groupName,message} = data;

const room = `group_${groupName}`;

io.to(room).emit("group_message",{
message,
senderId: socket.user.id
});

});

};