const express = require("express");
const cors = require("cors");
const path = require("path");

const sequelize = require("./config/database");
const authRoutes = require("./routes/authRoutes");
const chatRoutes = require('./routes/chatRoutes');
const User = require("./models/user");
const Message = require("./models/message");



const app = express();

app.use(cors());
app.use(express.json());
User.hasMany(Message);
Message.belongsTo(User);

/* Serve frontend */
app.use(express.static(path.join(__dirname, "public")));

app.use("/api/auth", authRoutes);

app.use("/api/chat", chatRoutes);

/* Default route -> open signup page */

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public/signup.html"));
});

sequelize.sync()
.then(()=>{
  console.log("Database connected");

  app.listen(5000, ()=>{
    console.log("Server running on port 5000");
  });

})
.catch(err => console.log(err));