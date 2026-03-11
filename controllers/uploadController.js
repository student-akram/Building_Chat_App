const s3 = require("../config/aws");

exports.uploadMedia = async (req,res)=>{

try{

const file = req.file;

const params = {
Bucket: process.env.S3_BUCKET,
Key: Date.now()+"_"+file.originalname,
Body: file.buffer,
ContentType: file.mimetype
};
console.log("Bucket name:", process.env.S3_BUCKET);

const data = await s3.upload(params).promise();

res.json({
message:"Upload success",
url:data.Location
});

}catch(err){
res.status(500).json({error:err.message});
}

};