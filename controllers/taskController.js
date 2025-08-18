const categoryModel = require("../models/categoryModel");
const subTaskModel = require("../models/subTaskModel");
const taskModel = require("../models/taskModel");
exports.createTask = async (req, res, next) => {
  const { title, details, deadLine, name } = req.body;
  const date = new Date(deadLine);
  console.log(date.getTime());
  // console.log(dateDeadLine instanceof Date);
  if (date < Date.now()) {
    const error = new Error("deadline should be present");
    error.status = 400;
    return next(error);
  }
  try {
    const category = await categoryModel.findOne({ user: req.user.id, name });
    if (!category) {
      const error = new Error("Please create a category");
      error.status = 400;
      return next(error);
    }
    const task = await taskModel.create({
      title,
      details,
      deadLine: date,
      category: category.id,
      user: req.user.id,
    });
    return res.status(201).json(task);
  } catch (error) {
    return next(error);
  }
};
exports.getAllTask = async (req, res, next) => {
  const { completed } = req.query;
  const { id } = req.user;
  const queryObject = { user: id };
  if (completed) {
    queryObject.isCompleted = completed === "true";
  }
  const tasks = await taskModel
    .find(queryObject)
    .populate("subTask", "title details");
  if (tasks.length === 0) {
    const error = new Error("task not found");
    error.status = 404;
    return next(error);
  }
  return res.status(200).json(tasks);
};
exports.updateTask = async (req, res, next) => {
  try {
    const { title, details, deadLine, isCompleted } = req.body;
    const { taskId } = req.params;
    const { id } = req.user;
    const task = await taskModel.findOne({ _id: taskId, user: id });
    console.log(task);
    if (!task) {
      const error = new Error("No task");
      error.status = 404;
      return next(error);
    }
    await taskModel.findByIdAndUpdate(
      taskId,
      { title, details, deadLine, isCompleted },
      { new: true, runValidators: true }
    );
    return res.status(200).json({ message: "task updated successfully" });
  } catch (error) {
    next(error);
  }
};
exports.getAllTaskByCategory = async (req, res, next) => {
  try {
    const { categoryId } = req.params;
    const { completed } = req.query;
    const { id } = req.user;
    const filter = { user: id, category: categoryId };
    if (completed) {
      filter.isCompleted = completed === "true";
    }
    const tasks = await taskModel.find(filter).populate("subTask");
    if (tasks.length == 0) {
      const error = new Error("task not found");
      error.status = 404;
      return next(error);
    }
    return res.status(200).json(tasks);
  } catch (error) {
    next(error);
  }
};
exports.deleteTask = async (req, res, next) => {
  try {
    const { taskId } = req.params;
    const { id } = req.user;
    const task = await taskModel.findOne({ _id: taskId, user: id });
    if (!task) {
      const error = new Error("No task");
      error.status = 404;
      return next(error);
    }
    await subTaskModel.deleteMany({ task: taskId });
    await taskModel.findByIdAndDelete(taskId);
    return res.status(200).json({ messgae: "task deleted" });
  } catch (error) {
    return next(error);
  }
};
exports.deleteAllCompletedTaskByCategory = async (req, res, next) => {
  const { categoryId } = req.params;
  const { id } = req.user;
  try {
    const task = await taskModel.find({
      user: id,
      isCompleted: true,
      category: categoryId,
    });
    if (task.length === 0) {
      const error = new Error("No task found");
      error.status = 404;
      return next(error);
    }
    const taskIds = task.map((i) => i._id);
    await subTaskModel.deleteMany({ task: { $in: taskIds } });
    await taskModel.deleteMany({
      user: id,
      isCompleted: true,
      category: categoryId,
    });
    return res
      .status(200)
      .json({ message: "completed task successfully deleted" });
  } catch (error) {
    return next(error);
  }
};
exports.getTask = async (req, res, next) => {
  try {
    const { id } = req.user;
    const { taskId } = req.params;
    const task = await taskModel
      .findOne({ _id: taskId, user: id })
      .populate("subTask", "title details isCompleted");
    if (!task) {
      const error = new Error("No task");
      error.stack = 404;
      return next(error);
    }
    return res.status(200).json(task);
  } catch (error) {
    return next(error);
  }
};
