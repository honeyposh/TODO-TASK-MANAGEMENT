const express = require("express");
const {
  addSubTask,
  removeSubTask,
  getSubTask,
  updateSubTask,
} = require("../controllers/subTaskController");
const { authentication } = require("../middleware/authMiddleware");
const route = express.Router();
route.post("/subtask", authentication, addSubTask);
route.delete("/subtask/:subTaskId", authentication, removeSubTask);
route.get("/subtask/:subTaskId", authentication, getSubTask);
route.put("/subtask/:subTaskId", authentication, updateSubTask);
module.exports = route;
