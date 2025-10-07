import express from "express";
import Task from "../models/Task.js";

const router = express.Router();

router.get("/board/:boardId", async (req, res) => {
  try {
    const tasks = await Task.find({ boardId: req.params.boardId }).sort({
      order: 1,
      createdAt: -1,
    });
    res.json(tasks);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching tasks", error: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.json(task);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching task", error: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const task = new Task(req.body);
    const savedTask = await task.save();
    const io = req.app.get("io");
    io.to(savedTask.boardId.toString()).emit("task-created", {
      task: savedTask,
    });
    res.status(201).json(savedTask);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error creating task", error: error.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    const io = req.app.get("io");
    io.to(task.boardId.toString()).emit("task-updated", { task });
    res.json(task);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error updating task", error: error.message });
  }
});

router.patch("/:id/status", async (req, res) => {
  try {
    const { status } = req.body;
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    const io = req.app.get("io");
    io.to(task.boardId.toString()).emit("task-updated", { task });
    res.json(task);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error updating task status", error: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    await Task.findByIdAndDelete(req.params.id);
    const io = req.app.get("io");
    io.to(task.boardId.toString()).emit("task-deleted", {
      taskId: req.params.id,
    });
    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting task", error: error.message });
  }
});
export default router;
