const express = require("express");
const cors = require("cors");
const path = require("path");
const http = require("http");

const sequelize = require("./config/database");
const authRoutes = require("./routes/authRoutes");
const chatRoutes = require("./routes/chatRoutes");
const userRoutes = require("./routes/userRoutes");


const User = require("./models/user");
const Message = require("./models/message");

const initSocket = require("./socket-io");

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());

User.hasMany(Message);
Message.belongsTo(User);

app.use(express.static(path.join(__dirname,"public")));

app.use("/api/auth",authRoutes);
app.use("/api/chat",chatRoutes);
app.use("/api/users", userRoutes);

app.get("/",(req,res)=>{
res.sendFile(path.join(__dirname,"public/signup.html"));
});

sequelize.sync().then(()=>{

console.log("Database connected");

const io = initSocket(server);

app.set("io", io);

server.listen(5000,()=>{
console.log("Server running on port 5000");
});

});