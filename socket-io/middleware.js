const jwt = require("jsonwebtoken");

module.exports = (socket,next)=>{

try{

const token = socket.handshake.auth.token;

if(!token){
return next(new Error("Authentication error"));
}

const decoded = jwt.verify(token,"secretkey");

socket.user = decoded;

next();

}catch(err){

console.log("JWT verification failed");

next(new Error("Authentication failed"));

}

};