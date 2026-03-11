const express = require("express");
const router = express.Router();
const User = require("../models/user");

router.get("/check-user/:email", async (req,res)=>{

try{

const email = req.params.email;

const user = await User.findOne({ where:{ email } });

if(user){
return res.json({exists:true});
}

res.json({exists:false});

}catch(err){
res.status(500).json({error:err.message});
}

});

module.exports = router;