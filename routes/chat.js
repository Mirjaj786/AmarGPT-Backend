const express = require("express");
const router = express.Router();
const { Thread } = require("../model/Thrade.js");
const getGeminiAPIResponse = require("../utils/openAi.js");
const { User } = require("../model/user.js");

router.get("/threads", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader)
      return res.status(401).json({ message: "Authorization header missing" });

    const token = authHeader.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Token missing" });

    const user = await User.findOne({ token });
    if (!user)
      return res.status(401).json({ message: "Invalid or expired token" });

    const threads = await Thread.find({ userId: user._id }).sort({
      updatedAt: -1,
    });

    return res.status(200).json({
      success: true,
      count: threads.length,
      threads,
    });
  } catch (err) {
    console.error("Error fetching user threads:", err);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
});

// to get a spesific thread
router.get("/thread/:id", async (req, res) => {
  const { id } = req.params;
  console.log(id);

  try {
    const thread = await Thread.findOne({ threadId: id });
    console.log(thread);
    if (!thread) {
      return res
        .status(404)
        .json({ error: "Looking that thraed is not found" });
    }
    res.json(thread.messages);
  } catch (err) {
    console.log("Error find thread with id", err);
    res.status(500).json({ error: "Faild to find some spesific thread" });
  }
});

router.delete("/thread/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const deleteThread = await Thread.findOneAndDelete({ threadId: id });

    if (!deleteThread) {
      console.log("Thread not found!");
      return res.status(404).json({ error: "Thread is not found!" });
    }

    console.log("deleted thraed is ", deleteThread);
    res.status(200).json({ success: "thread delete successfully!" });
  } catch (err) {
    console.log("Faild to delete thread", err);
    res.status(500).json({ error: "Faild to delete thread" });
  }
});

router.post("/chat", async (req, res) => {
  const { threadId, message } = req.body;
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) return res.status(401).json({ error: "Unauthorized" });
  if (!threadId || !message)
    return res.status(400).json({ error: "Missing required fields!" });

  try {
    const user = await User.findOne({ token });
    if (!user) return res.status(401).json({ error: "Invalid token" });

    let thread = await Thread.findOne({ threadId, userId: user._id });

    if (!thread) {
      thread = new Thread({
        threadId,
        title: message,
        messages: [{ role: "user", content: message }],
        userId: user._id,
      });
    } else {
      thread.messages.push({ role: "user", content: message });
    }

    const assistantReply = await getGeminiAPIResponse(message);

    thread.messages.push({ role: "assistant", content: assistantReply });
    thread.updatedAt = new Date();

    await thread.save();
    return res.status(200).json({ success: true, replay: assistantReply });
  } catch (err) {
    console.error("Chat route error:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
