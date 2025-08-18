const express = require("express");
const {
  signup,
  login,
  logout,
  updateprofile,
  getprofile,
} = require("../controllers/userController");
const { authentication } = require("../middleware/authMiddleware");
const route = express.Router();
route.post("/signup", signup);
route.post("/login", login);
route.post("/logout", logout);
route.put("/profile", authentication, updateprofile);
route.get("/profile", authentication, getprofile);
module.exports = route;
