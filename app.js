require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const http = require("http");

const sequelize = require("./config/database");
const authRoutes = require("./routes/authRoutes");
const chatRoutes = require("./routes/chatRoutes");
const userRoutes = require("./routes/userRoutes");
const mediaRoutes = require("./routes/mediaRoutes");
const aiRoutes = require("./routes/aiRoutes");







const User = require("./models/user");
const Message = require("./models/message");
const ArchivedMessage = require("./models/archivedMessage");


/* start archive cron job */
require("./jobs/archieveMessages");

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

app.use("/api/media", mediaRoutes);
app.use("/api/ai", aiRoutes);

app.get("/",(req,res)=>{
res.sendFile(path.join(__dirname,"public/signup.html"));
});

sequelize.sync().then(()=>{

console.log("Database connected");

const io = initSocket(server);

app.set("io", io);

const PORT = process.env.PORT || 5000;

server.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
});

});