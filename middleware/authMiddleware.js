const jwt = require("jsonwebtoken");

module.exports = (req,res,next)=>{

const token = req.headers.authorization;

if(!token){
return res.status(401).json({message:"Token missing"});
}

try{

const decoded = jwt.verify(token,"secretkey");

req.user = decoded;

next();

}catch(err){

return res.status(401).json({message:"Invalid token"});

}

};