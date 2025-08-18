const categoryModel = require("../models/categoryModel");
const subTaskModel = require("../models/subTaskModel");
const taskModel = require("../models/taskModel");
exports.createCategory = async (req, res, next) => {
  const { name } = req.body;
  if (!name) {
    const error = new Error("please provide a name");
    error.status = 400;
    return next(error);
  }
  try {
    const categoryExist = await categoryModel.findOne({
      name,
      user: req.user.id,
    });
    if (categoryExist) {
      const error = new Error("category Exist");
      error.status = 400;
      return next(error);
    }
    const category = await categoryModel.create({
      name,
      user: req.user.id,
    });
    return res.status(200).json(category);
  } catch (error) {
    return next(error);
  }
};
exports.getAllCategory = async (req, res, next) => {
  const { id } = req.user;
  try {
    const category = await categoryModel.find({ user: id });
    if (category.length === 0) {
      const error = new Error("category not found");
      error.status = 404;
      return next(error);
    }
    return res.status(200).json(category);
  } catch (error) {
    return next(error);
  }
};
exports.updateCategory = async (req, res, next) => {
  const { name } = req.body;
  const { categoryId } = req.params;
  const { id } = req.user;
  try {
    const category = await categoryModel.findById(categoryId);
    if (!category) {
      const error = new Error("task not found");
      error.status = 404;
      return next(error);
    }
    if (category.user.toString() !== id) {
      const error = new Error("not authorized to update this category");
      error.status = 403;
      return next(error);
    }
    await categoryModel.findByIdAndUpdate(
      categoryId,
      { name },
      { new: true, runValidators: true }
    );
    res.status(200).json({ message: "category updated successfully" });
  } catch (error) {
    return next(error);
  }
};
exports.deleteCategory = async (req, res, next) => {
  const { categoryId } = req.params;
  const { id } = req.user;
  try {
    const category = await categoryModel.findById(categoryId);
    if (!category) {
      const error = new Error("Category not found");
      error.status = 404;
      return next(error);
    }
    if (category.user.toString() !== id) {
      const error = new Error("not authorized to delete this category");
      error.status = 403;
      return next(error);
    }
    const task = await taskModel.find({ category: categoryId, user: id });
    const taskIds = task.map((i) => i._id);
    if (taskIds.length > 0) {
      await subTaskModel.deleteMany({ task: { $in: taskIds } });
      await taskModel.deleteMany({ _id: { $in: taskIds } });
    }
    await categoryModel.findByIdAndDelete(categoryId);
    res.status(200).json({ message: "category deleted successfully" });
  } catch (error) {
    next(error);
  }
};
