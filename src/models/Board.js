const mongoose = require("mongoose");

const boardSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxlength: 120 },
  description: { type: String, default: "", maxlength: 500 },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  background: { type: String, default: "#2563eb" },
  isArchived: { type: Boolean, default: false }
}, { timestamps: true });

boardSchema.index({ owner: 1, createdAt: -1 });
module.exports = mongoose.model("Board", boardSchema);