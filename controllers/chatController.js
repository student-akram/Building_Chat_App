const Message = require('../models/message');

exports.sendMessage = async (req,res)=>{

try{

const {message}=req.body;
const userId=req.user.id;

const newMessage=await Message.create({
message,
userId
});

const io=req.app.get("io");

io.emit("newMessage",newMessage);

res.status(201).json(newMessage);

}catch(err){

console.log(err);
res.status(500).json({error:err.message});

}

};
exports.getMessages = async (req, res) => {
  try {

    const messages = await Message.findAll({
      attributes: ["id", "message", "userId", "createdAt"],
      order: [["createdAt", "ASC"]]
    });

    res.status(200).json(messages);

  } catch (error) {

    console.log(error);
    res.status(500).json({ error: error.message });

  }
};