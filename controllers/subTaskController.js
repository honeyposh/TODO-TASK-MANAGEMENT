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
    console.log(task.user.toString());
    console.log(req.user.id);
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
    console.log(subtask);
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
    await subTaskModel.findByIdAndUpdate(
      subTaskId,
      { title, details, deadLine, isCompleted },
      { new: true, runValidators: true }
    );
    res.status(200).json({ message: "subtask updated succesfully" });
  } catch (error) {
    return next(error);
  }
};
