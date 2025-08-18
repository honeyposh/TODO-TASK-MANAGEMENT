const mongoose = require("mongoose");
const taskScheme = mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "title is required"],
      trim: true,
    },
    details: String,
    deadLine: Date,
    isCompleted: {
      type: Boolean,
      default: false,
    },
    subTask: [{ type: mongoose.Types.ObjectId, ref: "subTask" }],
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    category: {
      type: mongoose.Types.ObjectId,
      ref: "Category",
      required: true,
    },
  },
  { timestamps: true }
);
const taskModel = mongoose.model("Task", taskScheme);
module.exports = taskModel;
