const express = require("express");
const {
  createCategory,
  getAllCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryController");
const { authentication } = require("../middleware/authMiddleware");
const route = express.Router();
route.post("/category", authentication, createCategory);
route.get("/category", authentication, getAllCategory);
route.delete("/category/:categoryId", authentication, deleteCategory);
route.put("/category/:categoryId", authentication, updateCategory);
module.exports = route;
