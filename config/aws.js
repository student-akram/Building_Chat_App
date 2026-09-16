const AWS = require("aws-sdk");

if (!process.env.AWS_ACCESS_KEY) {
    throw new Error("AWS_ACCESS_KEY is missing in .env");
}

if (!process.env.AWS_SECRET_KEY) {
    throw new Error("AWS_SECRET_KEY is missing in .env");
}

if (!process.env.AWS_REGION) {
    throw new Error("AWS_REGION is missing in .env");
}

if (!process.env.S3_BUCKET) {
    throw new Error("S3_BUCKET is missing in .env");
}

AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
    region: process.env.AWS_REGION
});

console.log("AWS configuration loaded");
console.log("AWS Region:", process.env.AWS_REGION);
console.log("S3 Bucket:", process.env.S3_BUCKET);
console.log(
    "AWS Access Key:",
    process.env.AWS_ACCESS_KEY.substring(0, 4) + "********"
);

const s3 = new AWS.S3({
    signatureVersion: "v4"
});

module.exports = s3;