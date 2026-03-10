const express = require("express");
const cors = require("cors");
const path = require("path");
const http = require("http");

const sequelize = require("./config/database");
const authRoutes = require("./routes/authRoutes");
const chatRoutes = require("./routes/chatRoutes");

const User = require("./models/user");
const Message = require("./models/message");

const app = express();

/* create HTTP server */
const server = http.createServer(app);

/* socket.io setup */
const { Server } = require("socket.io");
const io = new Server(server,{
  cors:{origin:"*"}
});

/* make socket available everywhere */
app.set("io", io);

app.use(cors());
app.use(express.json());

User.hasMany(Message);
Message.belongsTo(User);

/* serve frontend */
app.use(express.static(path.join(__dirname,"public")));

app.use("/api/auth",authRoutes);
app.use("/api/chat",chatRoutes);

/* default route */
app.get("/",(req,res)=>{
  res.sendFile(path.join(__dirname,"public/signup.html"));
});

/* socket connection */
io.on("connection",(socket)=>{
  console.log("User connected:",socket.id);

  socket.on("disconnect",()=>{
    console.log("User disconnected");
  });
});

sequelize.sync()
.then(()=>{
  console.log("Database connected");

  server.listen(5000,()=>{
    console.log("Server running on port 5000");
  });

})
.catch(err=>console.log(err));