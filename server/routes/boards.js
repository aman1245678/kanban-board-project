import express from "express";
import Board from "../models/Board.js";

const router = express.Router();
router.get("/", async (req, res) => {
  try {
    const boards = await Board.find().sort({ createdAt: -1 });
    res.json(boards);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching boards", error: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const board = await Board.findById(req.params.id);
    if (!board) {
      return res.status(404).json({ message: "Board not found" });
    }
    res.json(board);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching board", error: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const board = new Board(req.body);
    const savedBoard = await board.save();
    res.status(201).json(savedBoard);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error creating board", error: error.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const board = await Board.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!board) {
      return res.status(404).json({ message: "Board not found" });
    }
    res.json(board);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error updating board", error: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const board = await Board.findByIdAndDelete(req.params.id);
    if (!board) {
      return res.status(404).json({ message: "Board not found" });
    }
    res.json({ message: "Board deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting board", error: error.message });
  }
});

export default router;
