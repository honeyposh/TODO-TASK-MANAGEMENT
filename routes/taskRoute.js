const express = require("express");
const {
  createTask,
  getAllTask,
  updateTask,
  getAllTaskByCategory,
  deleteTask,
  deleteAllCompletedTaskByCategory,
  getTask,
} = require("../controllers/taskController");
const { authentication } = require("../middleware/authMiddleware");
const { validatedeadLine } = require("../middleware/deadLine");
const route = express.Router();
route.post("/task", authentication, validatedeadLine, createTask);
route.get("/tasks", authentication, getAllTask);
route.get("/category/:categoryId/tasks", authentication, getAllTaskByCategory);
route.delete("/task/:taskId", authentication, deleteTask);
route.put("/task/:taskId", authentication, validatedeadLine, updateTask);
route.delete(
  "/category/:categoryId/tasks/completed",
  authentication,
  deleteAllCompletedTaskByCategory
);
route.get("/task/:taskId", authentication, getTask);
module.exports = route;
