const express = require("express");
const List = require("../models/List");
const Task = require("../models/Task");
const protect = require("../middleware/auth");
const { getBoardAccess } = require("../utils/access");

const router = express.Router();
router.use(protect);

router.post("/", async (req, res) => {
  const { title, boardId, position } = req.body;
  const board = await getBoardAccess(boardId, req.user._id);
  if (!board) return res.status(403).json({ success: false, message: "Board access denied" });

  const list = await List.create({ title, board: boardId, position: position ?? 0 });
  res.status(201).json({ success: true, list });
});

router.patch("/:id", async (req, res) => {
  const list = await List.findById(req.params.id);
  if (!list) return res.status(404).json({ success: false, message: "List not found" });

  const board = await getBoardAccess(list.board, req.user._id);
  if (!board) return res.status(403).json({ success: false, message: "Board access denied" });

  if (req.body.title !== undefined) list.title = req.body.title;
  if (req.body.position !== undefined) list.position = req.body.position;
  await list.save();

  res.json({ success: true, list });
});

router.delete("/:id", async (req, res) => {
  const list = await List.findById(req.params.id);
  if (!list) return res.status(404).json({ success: false, message: "List not found" });

  const board = await getBoardAccess(list.board, req.user._id);
  if (!board) return res.status(403).json({ success: false, message: "Board access denied" });

  await Promise.all([Task.deleteMany({ list: list._id }), list.deleteOne()]);
  res.json({ success: true, message: "List and its tasks deleted" });
});

module.exports = router;