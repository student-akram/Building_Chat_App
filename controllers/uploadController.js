const s3 = require("../config/aws");

exports.uploadMedia = async (req, res) => {

    try {

        if (!req.file) {
            return res.status(400).json({
                error: "No file received"
            });
        }

        const file = req.file;

        console.log("File received:", file.originalname);

        const safeFileName = file.originalname.replace(
            /[^a-zA-Z0-9._-]/g,
            "_"
        );

        const key = `${Date.now()}_${safeFileName}`;

        const params = {
            Bucket: process.env.S3_BUCKET,
            Key: key,
            Body: file.buffer,
            ContentType: file.mimetype
        };

        console.log("Uploading to S3...");
        console.log("Bucket:", process.env.S3_BUCKET);
        console.log("Region:", process.env.AWS_REGION);
        console.log("Key:", key);

        const result = await s3.upload(params).promise();

        console.log("S3 Upload Success:", result.Location);

        return res.status(200).json({
            message: "Upload success",
            url: result.Location
        });

    } catch (err) {

        console.error("S3 Upload Error");
        console.error("Code:", err.code);
        console.error("Message:", err.message);

        return res.status(500).json({
            error: "File upload failed",
            details: err.message
        });
    }
};