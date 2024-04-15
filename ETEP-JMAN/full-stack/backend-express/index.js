const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const router = require("./router");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

// Middleware setup
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB Connected"))
  .catch((error) => console.log(error));

// Use router
app.use("/", router);

app.listen(3001, () => {
  console.log("Server running on port 3001");
});
