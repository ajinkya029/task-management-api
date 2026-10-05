const express = require("express");
const User = require("../models/User");
const protect = require("../middleware/auth");

const router = express.Router();

router.use(protect);

router.get("/search", async (req, res) => {
  const q = (req.query.q || "").trim();
  if (q.length < 2) return res.json({ success: true, users: [] });

  const users = await User.find({
    _id: { $ne: req.user._id },
    $or: [{ name: new RegExp(q, "i") }, { email: new RegExp(q, "i") }]
  }).select("name email avatar").limit(10);

  res.json({ success: true, users });
});

module.exports = router;