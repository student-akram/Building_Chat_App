const express = require("express");

const router = express.Router();

const multer = require("multer");

const { uploadMedia } = require("../controllers/uploadController");

const storage = multer.memoryStorage();

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10 MB
    }
});

router.post(
    "/upload",
    upload.single("file"),
    uploadMedia
);

module.exports = router;