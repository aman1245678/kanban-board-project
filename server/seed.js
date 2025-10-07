import mongoose from "mongoose";
import Board from "./models/Board.js";
import Task from "./models/Task.js";
import dotenv from "dotenv";

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB for seeding");
    await Board.deleteMany({});
    await Task.deleteMany({});
    const board = await Board.create({
      name: "Project Tasks",
      description: "Main project development board",
      columns: [
        { id: "todo", title: "To Do", color: "bg-blue-500", order: 0 },
        {
          id: "in-progress",
          title: "In Progress",
          color: "bg-yellow-500",
          order: 1,
        },
        { id: "review", title: "Review", color: "bg-purple-500", order: 2 },
        { id: "done", title: "Done", color: "bg-green-500", order: 3 },
      ],
    });

    console.log("Created board:", board.name);

    const sampleTasks = [
      {
        title: "Design Homepage Layout",
        description: "Create wireframes and mockups for the homepage",
        status: "todo",
        priority: "high",
        assignee: "John",
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        boardId: board._id,
      },
      {
        title: "Implement Drag & Drop",
        description: "Add react-beautiful-dnd for task management",
        status: "in-progress",
        priority: "high",
        assignee: "Jane",
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        boardId: board._id,
      },
      {
        title: "Setup MongoDB Connection",
        description: "Configure MongoDB Atlas connection and schemas",
        status: "done",
        priority: "medium",
        assignee: "Mike",
        dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        boardId: board._id,
      },
      {
        title: "Write API Documentation",
        description: "Document all API endpoints and usage",
        status: "review",
        priority: "low",
        assignee: "Sarah",
        dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        boardId: board._id,
      },
    ];

    await Task.insertMany(sampleTasks);
    console.log("Created sample tasks");

    console.log("Database seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Seeding error:", error);
    process.exit(1);
  }
};
seedData();
