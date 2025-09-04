const express = require("express");
const {
  addSubTask,
  removeSubTask,
  getSubTask,
  updateSubTask,
  getAllSubTasksByTask,
} = require("../controllers/subTaskController");
const { authentication } = require("../middleware/authMiddleware");
const { validatedeadLine } = require("../middleware/deadLine");
const route = express.Router();
route.post("/subtask", authentication, validatedeadLine, addSubTask);
route.delete("/subtask/:subTaskId", authentication, removeSubTask);
route.get("/subtask/:subTaskId", authentication, getSubTask);
route.put(
  "/subtask/:subTaskId",
  authentication,
  validatedeadLine,
  updateSubTask
);
route.get("/task/:taskId/subtask", authentication, getAllSubTasksByTask);
module.exports = route;
