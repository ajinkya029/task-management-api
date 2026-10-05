const express = require("express");
const Board = require("../models/Board");
const List = require("../models/List");
const Task = require("../models/Task");
const protect = require("../middleware/auth");
const { getBoardAccess, isOwner } = require("../utils/access");

const router = express.Router();
router.use(protect);

router.get("/", async (req, res) => {
  const boards = await Board.find({
    $or: [{ owner: req.user._id }, { members: req.user._id }],
    isArchived: false
  }).populate("owner", "name email").populate("members", "name email avatar").sort("-createdAt");

  res.json({ success: true, boards });
});

router.post("/", async (req, res) => {
  const { title, description, background } = req.body;
  const board = await Board.create({ title, description, background, owner: req.user._id, members: [req.user._id] });
  res.status(201).json({ success: true, board });
});

router.get("/:id", async (req, res) => {
  const board = await getBoardAccess(req.params.id, req.user._id);
  if (!board) return res.status(404).json({ success: false, message: "Board not found or access denied" });

  const [lists, tasks] = await Promise.all([
    List.find({ board: board._id }).sort("position"),
    Task.find({ board: board._id }).populate("assignees", "name email avatar").sort("position")
  ]);

  res.json({ success: true, board, lists, tasks });
});

router.patch("/:id", async (req, res) => {
  const board = await Board.findOne({ _id: req.params.id, owner: req.user._id });
  if (!board) return res.status(403).json({ success: false, message: "Only the board owner can update it" });

  const allowed = ["title", "description", "background", "isArchived"];
  allowed.forEach(k => { if (req.body[k] !== undefined) board[k] = req.body[k]; });
  await board.save();
  res.json({ success: true, board });
});

router.post("/:id/members", async (req, res) => {
  const board = await Board.findOne({ _id: req.params.id, owner: req.user._id });
  if (!board) return res.status(403).json({ success: false, message: "Only the board owner can manage members" });

  const { userId } = req.body;
  if (!userId) return res.status(400).json({ success: false, message: "userId is required" });
  if (!board.members.some(id => String(id) === String(userId))) board.members.push(userId);
  await board.save();

  res.json({ success: true, board });
});

router.delete("/:id/members/:userId", async (req, res) => {
  const board = await Board.findOne({ _id: req.params.id, owner: req.user._id });
  if (!board) return res.status(403).json({ success: false, message: "Only the board owner can manage members" });

  board.members = board.members.filter(id => String(id) !== String(req.params.userId));
  await board.save();
  res.json({ success: true, board });
});

router.delete("/:id", async (req, res) => {
  const board = await Board.findOne({ _id: req.params.id, owner: req.user._id });
  if (!board) return res.status(404).json({ success: false, message: "Board not found" });

  await Promise.all([
    Task.deleteMany({ board: board._id }),
    List.deleteMany({ board: board._id }),
    board.deleteOne()
  ]);

  res.json({ success: true, message: "Board deleted" });
});

module.exports = router;