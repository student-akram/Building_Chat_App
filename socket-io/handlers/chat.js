module.exports = (io, socket)=>{

socket.on("sendMessage",(data)=>{

const message = {
message:data.message,
userId:socket.user.id,
createdAt:new Date()
};

io.emit("newMessage", message);

});

};