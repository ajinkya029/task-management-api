const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const signToken = require("../utils/token");
const protect = require("../middleware/auth");

const router = express.Router();

router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ success: false, message: "Name, email and password are required" });

  const exists = await User.findOne({ email });
  if (exists) return res.status(409).json({ success: false, message: "Email is already registered" });

  const user = await User.create({ name, email, password });
  const token = signToken(user._id);
  res.status(201).json({ success: true, token, user: { id: user._id, name: user.name, email: user.email, avatar: user.avatar } });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.comparePassword(password))) return res.status(401).json({ success: false, message: "Invalid email or password" });

  const token = signToken(user._id);
  res.json({ success: true, token, user: { id: user._id, name: user.name, email: user.email, avatar: user.avatar } });
});

router.get("/me", protect, async (req, res) => {
  res.json({ success: true, user: req.user });
});

module.exports = router;