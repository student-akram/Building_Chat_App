const express = require("express");
const cors = require("cors");

const sequelize = require("./config/database");
const authRoutes = require("./routes/authRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth",authRoutes);


// connect database

sequelize.sync()
.then(()=>{
console.log("Database connected");

app.listen(5000,()=>{
console.log("Server running on port 5000");
});

})
.catch(err=>console.log(err));