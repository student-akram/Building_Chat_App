const { Server } = require("socket.io");
const socketMiddleware = require("./middleware");
const chatHandler = require("./handlers/chat");

function initSocket(server){

const io = new Server(server,{
cors:{origin:"*"}
});

io.use(socketMiddleware);

io.on("connection",(socket)=>{

console.log("User connected:", socket.user.id);

chatHandler(io, socket);

socket.on("disconnect",()=>{
console.log("User disconnected:", socket.user.id);
});

});

return io;

}

module.exports = initSocket;