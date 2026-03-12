const Message = require("../models/message");

exports.sendMessage = async (req,res)=>{

try{

const {message,roomId} = req.body;
const senderId = req.user.id;

if(!roomId){
return res.status(400).json({error:"RoomId missing"});
}

const newMessage = await Message.create({
message,
roomId,
senderId
});

const io = req.app.get("io");

io.to(roomId).emit("new_message",{
message,
senderId,
roomId
});

res.status(201).json(newMessage);

}catch(err){

console.log(err);
res.status(500).json({error:err.message});

}

};

exports.getMessages = async (req,res)=>{

try{

const {roomId} = req.query;

const messages = await Message.findAll({
where:{roomId},
order:[["createdAt","ASC"]]
});

res.json(messages);

}catch(err){

console.log(err);
res.status(500).json({error:err.message});

}

};