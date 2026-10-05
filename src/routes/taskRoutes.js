const express = require("express");
const Task = require("../models/Task");
const List = require("../models/List");
const protect = require("../middleware/auth");
const { getBoardAccess } = require("../utils/access");

const router = express.Router();
router.use(protect);

async function validateList(boardId, listId) {
  return List.findOne({ _id: listId, board: boardId });
}

router.get("/", async (req, res) => {
  const { boardId, listId, status, priority, assignee } = req.query;
  if (!boardId) return res.status(400).json({ success: false, message: "boardId is required" });

  const board = await getBoardAccess(boardId, req.user._id);
  if (!board) return res.status(403).json({ success: false, message: "Board access denied" });

  const filter = { board: boardId };
  if (listId) filter.list = listId;
  if (status) filter.status = status;
  if (priority) filter.priority = priority;
  if (assignee) filter.assignees = assignee;

  const tasks = await Task.find(filter)
    .populate("assignees", "name email avatar")
    .populate("createdBy", "name email")
    .sort("position");

  res.json({ success: true, tasks });
});

router.post("/", async (req, res) => {
  const { title, description, boardId, listId, position, priority, status, dueDate, labels, assignees } = req.body;
  const board = await getBoardAccess(boardId, req.user._id);
  if (!board) return res.status(403).json({ success: false, message: "Board access denied" });

  const list = await validateList(boardId, listId);
  if (!list) return res.status(400).json({ success: false, message: "List does not belong to this board" });

  const invalidAssignee = (assignees || []).some(id => !board.members.some(member => String(member) === String(id)));
  if (invalidAssignee) return res.status(400).json({ success: false, message: "Every assignee must be a board member" });

  const task = await Task.create({
    title, description, board: boardId, list: listId, position: position ?? 0,
    priority, status, dueDate, labels, assignees, createdBy: req.user._id
  });

  res.status(201).json({ success: true, task });
});

router.get("/:id", async (req, res) => {
  const task = await Task.findById(req.params.id)
    .populate("assignees", "name email avatar")
    .populate("createdBy", "name email");

  if (!task) return res.status(404).json({ success: false, message: "Task not found" });
  const board = await getBoardAccess(task.board, req.user._id);
  if (!board) return res.status(403).json({ success: false, message: "Board access denied" });

  res.json({ success: true, task });
});

router.patch("/:id", async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) return res.status(404).json({ success: false, message: "Task not found" });

  const board = await getBoardAccess(task.board, req.user._id);
  if (!board) return res.status(403).json({ success: false, message: "Board access denied" });

  const fields = ["title", "description", "priority", "status", "dueDate", "labels", "position", "list", "assignees"];
  fields.forEach(k => { if (req.body[k] !== undefined) task[k] = req.body[k]; });

  const list = await validateList(task.board, task.list);
  if (!list) return res.status(400).json({ success: false, message: "Target list does not belong to this board" });

  if (req.body.assignees) {
    const invalid = req.body.assignees.some(id => !board.members.some(member => String(member) === String(id)));
    if (invalid) return res.status(400).json({ success: false, message: "Every assignee must be a board member" });
  }

  await task.save();
  await task.populate("assignees", "name email avatar");
  res.json({ success: true, task });
});

router.delete("/:id", async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) return res.status(404).json({ success: false, message: "Task not found" });

  const board = await getBoardAccess(task.board, req.user._id);
  if (!board) return res.status(403).json({ success: false, message: "Board access denied" });

  await task.deleteOne();
  res.json({ success: true, message: "Task deleted" });
});

module.exports = router;