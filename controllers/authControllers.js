const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


// SIGNUP

exports.signup = async (req,res)=>{

try{

const {name,email,phone,password} = req.body;

// check existing user

const existingUser = await User.findOne({where:{email}});

if(existingUser){
return res.json({message:"User already exists"});
}

// encrypt password

const hashedPassword = await bcrypt.hash(password,10);

// create user

await User.create({
name,
email,
phone,
password:hashedPassword
});

res.json({message:"Signup successful"});

}catch(error){

res.status(500).json({error:error.message});

}

};



// LOGIN

exports.login = async (req,res)=>{

try{

const {loginInput,password} = req.body;

// find user by email OR phone

const user = await User.findOne({
where:{
[require("sequelize").Op.or]:[
{email:loginInput},
{phone:loginInput}
]
}
});

if(!user){
return res.json({message:"User not found"});
}

// compare password

const isMatch = await bcrypt.compare(password,user.password);

if(!isMatch){
return res.json({message:"Invalid password"});
}

// create JWT token

// LOGIN SUCCESS

const token = jwt.sign(
{ id:user.id },
"secretkey",
{ expiresIn:"1d" }
);

res.json({
token: token,
userId: user.id,
email: user.email
});
}catch(error){

res.status(500).json({error:error.message});

}

};