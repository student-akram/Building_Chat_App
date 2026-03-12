const express = require("express");
const router = express.Router();
const User = require("../models/user");

router.get("/check-user/:email", async (req, res) => {
  try {

    const email = req.params.email.trim().toLowerCase();

    console.log("Searching for email:", email);

    const user = await User.findOne({
      where: { email: email }
    });

    if (!user) {
      return res.json({ exists: false });
    }

    console.log("Found user:", user.email, "ID:", user.id);

    res.json({
      exists: true,
      userId: user.id
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;