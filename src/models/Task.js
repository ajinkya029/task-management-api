const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxlength: 200 },
  description: { type: String, default: "", maxlength: 5000 },
  board: { type: mongoose.Schema.Types.ObjectId, ref: "Board", required: true },
  list: { type: mongoose.Schema.Types.ObjectId, ref: "List", required: true },
  position: { type: Number, default: 0 },
  priority: { type: String, enum: ["low", "medium", "high", "urgent"], default: "medium" },
  status: { type: String, enum: ["todo", "in_progress", "done"], default: "todo" },
  dueDate: { type: Date, default: null },
  labels: [{ type: String, trim: true, maxlength: 30 }],
  assignees: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
}, { timestamps: true });

taskSchema.index({ board: 1, list: 1, position: 1 });
taskSchema.index({ assignees: 1, dueDate: 1 });

module.exports = mongoose.model("Task", taskSchema);