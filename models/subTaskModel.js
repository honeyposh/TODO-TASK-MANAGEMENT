const mongoose = require("mongoose");
const subTaskSchema = mongoose.Schema(
  {
    title: String,
    details: String,
    deadLine: Date,
    isCompleted: {
      type: Boolean,
      default: false,
    },
    task: {
      type: mongoose.Types.ObjectId,
      ref: "Task",
      required: true,
    },
  },
  { timestamps: true }
);
const subTaskModel = mongoose.model("subTask", subTaskSchema);
module.exports = subTaskModel;
