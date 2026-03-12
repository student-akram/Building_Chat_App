const express = require("express");
const router = express.Router();
const multer = require("multer");
const AWS = require("aws-sdk");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });



AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
  region: process.env.AWS_REGION
});

const s3 = new AWS.S3({
  signatureVersion: "v4"
});


router.post("/upload", upload.single("file"), async (req,res)=>{
    console.log("AWS_REGION:", process.env.AWS_REGION);
console.log("BUCKET:", process.env.S3_BUCKET);

try{

const file = req.file;

console.log("File received:", file.originalname);

const params = {
  Bucket: process.env.S3_BUCKET,
  Key: Date.now() + "_" + file.originalname,
  Body: file.buffer,
  ContentType: file.mimetype
 
};

const result = await s3.upload(params).promise();

res.json({ url: result.Location });

}catch(err){

console.log(err);

res.status(500).json({error:"Upload failed"});

}

});

module.exports = router;