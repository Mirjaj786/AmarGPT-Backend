const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const crypto = require("crypto");

const { User } = require("../model/user.js");

router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    if (!name && !email && !password) {
      return res.status(400).json({ message: "Please fill all feilds!" });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({ message: "User already exist!" });
    }

    const hashedPass = await bcrypt.hash(password, 10);

    const newUser = new User({
      name: name,
      email: email,
      password: hashedPass,
    });

    const save = await newUser.save();

    return res.status(201).json({ message: "User register successfully!" });
  } catch (err) {
    return res
      .status(500)
      .json({ message: `something went wrong register user ${err}` });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email && !password) {
    return res.status(400).json({ message: "Please enter email & password!" });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: "User Not found!" });
  }

  const validPass = bcrypt.compare(password, user.password);

  if (validPass) {
    const token = crypto.randomBytes(32).toLocaleString("base64");
    user.token = token;
    await user.save();
    return res.status(200).json({ token: token });
  } else {
    return res.status(401).json({ message: "Invalid Email and password!" });
  }
});

router.get("/me", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1]; // Expect Bearer <token>
    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No token provided" });
    }

    const user = await User.findOne({ token });
    if (!user) {
      return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }

    // Return user info (excluding password)
    return res.status(200).json({
      name: user.name,
      email: user.email,
      id: user._id,
    });
  } catch (err) {
    return res.status(500).json({ message: `Something went wrong: ${err}` });
  }
});

// Logout user
router.post("/logout", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1]; // Expect Bearer <token>
    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No token provided" });
    }

    const user = await User.findOne({ token });
    if (!user) {
      return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }

    user.token = null; // Remove token to logout
    await user.save();

    return res.status(200).json({ message: "Logged out successfully!" });
  } catch (err) {
    return res.status(500).json({ message: `Something went wrong: ${err}` });
  }
});

module.exports = router;
