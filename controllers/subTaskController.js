const subTaskModel = require("../models/subTaskModel");
const taskModel = require("../models/taskModel");
exports.addSubTask = async (req, res, next) => {
  try {
    const { title, taskId, details, deadLine } = req.body;
    const task = await taskModel.findById(taskId);
    if (!task) {
      const error = new Error("task not found");
      error.status = 404;
      return next(error);
    }
    //console.log(task.user.toString());
    //console.log(req.user.id);
    if (task.user.toString() !== req.user.id) {
      const error = new Error("you cant add subtask to this task");
      error.status = 403;
      return next(error);
    }
    const subtask = await subTaskModel.create({
      title,
      deadLine,
      details,
      task: taskId,
    });
    await taskModel.findByIdAndUpdate(taskId, {
      $push: { subTask: subtask.id },
    });
    return res.status(201).json(subtask);
  } catch (error) {
    next(error);
  }
};
exports.removeSubTask = async (req, res, next) => {
  const { id } = req.user;
  const { subTaskId } = req.params;
  try {
    const subtask = await subTaskModel.findById(subTaskId).populate("task");
    // console.log(subtask);
    if (!subtask) {
      const error = new Error("Subtask not found");
      error.status = 404;
      return next(error);
    }
    if (subtask.task.user.toString() !== id) {
      const error = new Error("not authorized to delete this subtask");
      error.status = 403;
      return next(error);
    }
    await taskModel.findByIdAndUpdate(subtask.task._id, {
      $pull: { subTask: subTaskId },
    });

    await subTaskModel.findByIdAndDelete(subTaskId);
    res.status(200).json({ message: "subtask deleted" });
  } catch (error) {
    return next(error);
  }
};
exports.getSubTask = async (req, res, next) => {
  const { subTaskId } = req.params;
  const { id } = req.user;
  try {
    const subtask = await subTaskModel
      .findById(subTaskId)
      .populate("task", "user");
    if (!subtask) {
      const error = new Error("Subtask not found");
      error.status = 404;
      return next(error);
    }
    if (subtask.task.user.toString() !== id) {
      const error = new Error("not authorized to get this subtask");
      error.status = 403;
      return next(error);
    }
    return res.status(200).json(subtask);
  } catch (error) {
    return next(error);
  }
};
exports.updateSubTask = async (req, res, next) => {
  try {
    const { title, details, deadLine, isCompleted } = req.body;
    const { subTaskId } = req.params;
    const { id } = req.user;
    const subtask = await subTaskModel.findById(subTaskId).populate("task");
    if (!subtask) {
      const error = new Error("Subtask not found");
      error.status = 404;
      return next(error);
    }
    if (subtask.task.user.toString() !== id) {
      const error = new Error("not authorized to update this subtask");
      error.status = 403;
      return next(error);
    }
    const updateFields = {};
    if (title !== "undefined") {
      updateFields.title = title;
    }
    if (details !== "undefined") {
      updateFields.details = details;
    }
    if (typeof isCompleted !== "undefined") {
      updateFields.isCompleted = isCompleted;
    }
    if (deadLine !== "undefined") {
      updateFields.deadLine = deadLine;
      console.log(deadLine.toLocaleString());
    }

    await subTaskModel.findByIdAndUpdate(subTaskId, updateFields, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({ message: "subtask updated succesfully" });
  } catch (error) {
    return next(error);
  }
};
exports.getAllSubTasksByTask = async (req, res, next) => {
  const { sort, isCompleted } = req.query;
  try {
    const { taskId } = req.params;
    const { id } = req.user;
    const filter = { task: taskId };
    const task = await taskModel.findById(taskId);
    if (!task) {
      const error = new Error("Task not found");
      error.status = 404;
      return next(error);
    }
    if (task.user.toString() !== id) {
      const error = new Error("Not authorized");
      error.status = 403;
      return next(error);
    }
    if (typeof isCompleted !== "undefined") {
      filter.isCompleted = isCompleted === "true";
    }
    let result = subTaskModel.find(filter);
    if (sort) {
      result = result.sort(sort);
    } else {
      result = result.sort("deadLine");
    }
    const limit = Number(req.query.limit) || 3;
    const page = Number(req.query.page) || 1;
    const skip = (page - 1) * limit;
    result = result.skip(skip).limit(limit);
    const subtasks = await result;
    const total = await subTaskModel.countDocuments(filter);
    if (subtasks.length == 0) {
      const error = new Error("no subtask found for this task");
      error.status = 404;
      return next(error);
    }
    res.status(200).json({ subtasks, total });
  } catch (error) {
    next(error);
  }
};
