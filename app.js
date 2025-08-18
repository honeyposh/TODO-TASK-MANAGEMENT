require("dotenv").config({ quiet: true });
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const port = process.env.PORT || 8000;
const taskRoute = require("./routes/taskRoute");
const categoryRoute = require("./routes/categoryRoute");
const userRoute = require("./routes/userRoute");
const subTaskRoute = require("./routes/subTaskRoute");
const cookieParser = require("cookie-parser");
// const subTaskModel = require("./models/subTaskModel");
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to db");
    app.listen(port, () => {
      console.log(`Server listening on port {PORT}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });
app.use(express.json());
app.use(cookieParser());
app.use("/api", taskRoute);
app.use("/api", categoryRoute);
app.use("/api", userRoute);
app.use("/api", subTaskRoute);
app.use((error, req, res, next) => {
  return res
    .status(error.status || 500)
    .json({ message: error.message || "server error" });
});
