const express = require("express");
const router = express.Router();

const chatController = require("../controllers/chatController");
const authenticate = require("../middleware/authMiddleware");

router.post("/send", authenticate, chatController.sendMessage);

module.exports = router;