const gemini = require("../services/geminiService");

exports.suggest = async (req,res)=>{

try{

const {text} = req.body;

const suggestions = await gemini.getSuggestions(text);

res.json({suggestions});

}catch(err){
console.log(err);
res.status(500).json({error:"AI suggestion failed"});
}

};

exports.smartReply = async (req,res)=>{

try{

const {message} = req.body;

const replies = await gemini.getSmartReplies(message);

res.json({replies});

}catch(err){
console.log(err);
res.status(500).json({error:"AI reply failed"});
}

};