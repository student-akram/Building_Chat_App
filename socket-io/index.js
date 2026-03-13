const { Server } = require("socket.io");
const socketMiddleware = require("./middleware");
const Message = require("../models/message");

function initSocket(server){

const io = new Server(server,{
cors:{origin:"*"}
});

io.use(socketMiddleware);

io.on("connection",(socket)=>{

console.log("User connected:",socket.user.id);

/* JOIN PERSONAL ROOM */

socket.on("join_room", async(roomId)=>{

try{

socket.join(roomId);

console.log(`User ${socket.user.id} joined room ${roomId}`);

/* LOAD PREVIOUS MESSAGES */

const messages = await Message.findAll({
where:{roomId},
order:[["createdAt","ASC"]]
});

socket.emit("previous_messages",messages);

}catch(err){
console.log(err);
}

});


/* PERSONAL MESSAGE */

socket.on("new_message", async(data)=>{

try{

const {roomId,message} = data;

const saved = await Message.create({
message,
roomId,
senderId: socket.user.id
});

io.to(roomId).emit("new_message",{
message:saved.message,
senderId:socket.user.id,
createdAt:saved.createdAt
});

}catch(err){
console.log(err);
}

});


/* GROUP CREATE */

socket.on("create_group",(groupName)=>{

const room = `group_${groupName}`;

socket.join(room);

console.log(`Group created ${room}`);

});


/* GROUP JOIN */

socket.on("join_group",(groupName)=>{

const room = `group_${groupName}`;

socket.join(room);

console.log(`User joined group ${room}`);

});


/* GROUP MESSAGE */

socket.on("group_message",(data)=>{

const {groupName,message} = data;

const room = `group_${groupName}`;

io.to(room).emit("group_message",{
message,
senderId:socket.user.id
});

});


/* MEDIA MESSAGE */

socket.on("media_message", async(data)=>{

try{

const {roomId,url} = data;

/* SAVE IMAGE LIKE NORMAL MESSAGE */

const saved = await Message.create({
message: url,
roomId,
senderId: socket.user.id
});

/* SEND TO ROOM */

io.to(roomId).emit("media_message",{
url: saved.message,
senderId: socket.user.id,
createdAt: saved.createdAt
});

}catch(err){
console.log(err);
}

});


socket.on("disconnect",()=>{
console.log("User disconnected:",socket.user.id);
});

});

return io;

}

module.exports = initSocket;