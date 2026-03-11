const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const {uploadMedia} = require("../controllers/uploadController");

router.post("/media", upload.single("file"), uploadMedia);

module.exports = router;