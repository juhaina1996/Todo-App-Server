// Import express
const express = require("express");
require("dotenv").config();
// Create an express app
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

// Middleware to parse JSON request bodies
app.use(bodyParser.json());

// MongoDB connection setup
const mongoURI = process.env.MONGO_URI; // Fetch the Mongo URI from the environment variable
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});
// Import bodyParser to parse JSON data in requests

// Import the Todo model
const Todo = require("./models/Todo");

// Connect to your MongoDB database here (if not done already)

// POST: Create a new Todo
app.post("/todos", async (req, res) => {
  const todo = new Todo({
    text: req.body.text,
  });
  try {
    const savedTodo = await todo.save();
    res.status(201).json(savedTodo);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// GET: Get all Todos
app.get("/todos", async (req, res) => {
  try {
    const todos = await Todo.find();
    res.json(todos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT: Update a Todo by ID
app.put("/todos/:id", async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    if (!todo) return res.status(404).json({ message: "Todo not found" });

    todo.completed =
      req.body.completed !== undefined ? req.body.completed : todo.completed;
    todo.text = req.body.text !== undefined ? req.body.text : todo.text;

    const updatedTodo = await todo.save();
    res.json(updatedTodo);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE: Delete a Todo by ID
app.delete("/todos/:id", async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    if (!todo) return res.status(404).json({ message: "Todo not found" });

    await todo.remove();
    res.json({ message: "Todo deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
