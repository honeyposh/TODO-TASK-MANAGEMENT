const categoryModel = require("../models/categoryModel");
const subTaskModel = require("../models/subTaskModel");
const taskModel = require("../models/taskModel");
exports.createTask = async (req, res, next) => {
  const { title, details, deadLine, name } = req.body;

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
      deadLine,
      category: category.id,
      user: req.user.id,
    });
    return res.status(201).json(task);
  } catch (error) {
    return next(error);
  }
};
exports.getAllTask = async (req, res, next) => {
  const { completed, sort } = req.query;
  const { id } = req.user;
  const filter = { user: id };
  if (completed) {
    filter.isCompleted = completed === "true";
  }
  let result = taskModel
    .find(filter)
    .populate("subTask", "title details deadLine");
  if (sort) {
    result = result.sort(sort);
  } else {
    result = result.sort("deadLine");
  }
  const limit = Number(req.query.limit) || 5;
  const page = Number(req.query.page) || 1;
  const skip = (page - 1) * limit;
  result = result.skip(skip).limit(limit);
  const tasks = await result;
  const total = await taskModel.countDocuments(filter);
  if (tasks.length === 0) {
    const error = new Error("task not found");
    error.status = 404;
    return next(error);
  }
  return res.status(200).json({ tasks, total });
};
exports.updateTask = async (req, res, next) => {
  const { taskId } = req.params;
  const { id } = req.user;
  try {
    const { title, details, deadLine, isCompleted } = req.body;
    const task = await taskModel.findOne({ _id: taskId, user: id });
    if (!task) {
      const error = new Error("No task");
      error.status = 404;
      return next(error);
    }
    const updateFields = {};
    if (title) {
      updateFields.title = title;
    }
    if (details) {
      updateFields.details = details;
    }
    if (typeof isCompleted !== "undefined") {
      updateFields.isCompleted = isCompleted;
    }
    if (deadLine) {
      updateFields.deadLine = deadLine;
    }

    await taskModel.findByIdAndUpdate(taskId, updateFields, {
      new: true,
      runValidators: true,
    });
    return res.status(200).json({ message: "task updated successfully" });
  } catch (error) {
    next(error);
  }
};
exports.getAllTaskByCategory = async (req, res, next) => {
  try {
    const { categoryId } = req.params;
    const { completed, sort } = req.query;
    const { id } = req.user;
    const filter = { user: id, category: categoryId };
    if (completed) {
      filter.isCompleted = completed === "true";
    }
    let result = taskModel.find(filter).populate("subTask");
    if (sort) {
      result = result.sort(sort);
    } else {
      result = result.sort("deadLine");
    }
    const limit = Number(req.query.limit) || 3;
    const page = Number(req.query.page) || 1;
    const skip = (page - 1) * limit;
    result = result.skip(skip).limit(limit);
    const tasks = await result;
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
      .populate("subTask", "title details deadLine");
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
