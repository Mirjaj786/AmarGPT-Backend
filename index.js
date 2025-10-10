require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const Port = process.env.PORT;
const mongoose = require("mongoose");
const MONGO_URI = process.env.MONGO_URI;

const ChatRoute = require("./routes/chat.js");
const userRoute = require("./routes/userRoute.js");

app.use(express.json());
app.use(cors());

app.use("/api", ChatRoute);
app.use("/api/auth", userRoute);

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Database Connection successfull!");
  } catch (err) {
    console.log(`Error connecting with database: ${err}`);
  }
};

app.listen(Port, () => {
  connectDB();
  console.log(`the server was run on port: ${Port}`);
  console.log(`http://localhost:${Port}`);
});
