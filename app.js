const express = require("express");
const cors = require("cors");
const path = require("path");
const http = require("http");
const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");

const sequelize = require("./config/database");
const authRoutes = require("./routes/authRoutes");
const chatRoutes = require("./routes/chatRoutes");
const User = require("./models/user");
const Message = require("./models/message");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "*" }
});

// make io available in controllers
app.set("io", io);

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

User.hasMany(Message);
Message.belongsTo(User);

app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public/signup.html"));
});

/* -------- Socket Auth (JWT) -------- */
io.use((socket,next)=>{

try{

console.log("Socket auth request received");

const token = socket.handshake.auth.token;

console.log("Token:", token);

if(!token){
return next(new Error("No token provided"));
}

const decoded = jwt.verify(token,"secretkey"); // MUST match login

socket.user = decoded;

console.log("Authenticated user:", decoded);

next();

}catch(err){

console.log("JWT verification failed");

next(new Error("Authentication failed"));

}

});
/* -------- Socket connection -------- */
io.on("connection", (socket) => {
  console.log("Socket connected. userId:", socket.user?.id, "socketId:", socket.id);

  socket.on("disconnect", () => {
    console.log("Socket disconnected:", socket.id);
  });
});

sequelize.sync().then(() => {
  console.log("Database connected");
  server.listen(5000, () => {
    console.log("Server running on port 5000");
  });
});