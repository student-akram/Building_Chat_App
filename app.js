const express = require("express");
const cors = require("cors");
const path = require("path");

const sequelize = require("./config/database");
const authRoutes = require("./routes/authRoutes");

const app = express();

app.use(cors());
app.use(express.json());

/* Serve frontend */
app.use(express.static(path.join(__dirname, "public")));

app.use("/api/auth", authRoutes);

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