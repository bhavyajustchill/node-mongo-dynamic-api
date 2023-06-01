import express from "express";
import mongoose from "mongoose";
const createDynamicModel = require("./modules/dynamicModel");

const app = express();
const PORT = process.env.PORT || 8081;

// Middleware
app.use(express.json());

async function attemptConnection() {
  await mongoose.connect("mongodb://127.0.0.1:27017/employees");
}

attemptConnection()
  .then(() => console.log("MongoDB Connected!"))
  .catch((err) => console.log("MongoDB Connection Error: " + err));

app.get("/", async (req, res) => {
  res.json("API is Live!");
});

app.post("/api/:collectionName", async (req, res) => {
  try {
    const DynamicModel = createDynamicModel(req.params.collectionName);
    const collection = new DynamicModel(req.body);
    await collection.save();
    res.json(collection);
  } catch (error) {
    res.status(500).json(error.message);
  }
});

// Get all items
app.get("/api/:collectionName", async (req, res) => {
  try {
    const Model = createDynamicModel(req.params.collectionName);
    const items = await Model.find({});
    res.json(items);
  } catch (error) {
    res.status(500).json(error.message);
  }
});

// Retrieve a specific item
app.get("/api/:collectionName/:itemId", async (req, res) => {
  try {
    const Model = createDynamicModel(req.params.collectionName);
    const items = await Model.find({ _id: req.params.itemId });
    res.json(items);
  } catch (error) {
    res.status(500).json(error.message);
  }
});

// Update an item
app.put("/api/:collectionName/:itemId", async (req, res) => {
  try {
    const collectionName = req.params.collectionName;
    const itemId = req.params.itemId;
    const updatedData = req.body;
    const Model = createDynamicModel(collectionName);
    const item = await Model.findByIdAndUpdate(itemId, updatedData, {
      new: true,
    });
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: "An error occurred" });
  }
});

// Delete an item
app.delete("/api/:collectionName/:itemId", async (req, res) => {
  try {
    const collectionName = req.params.collectionName;
    const itemId = req.params.itemId;
    const Model = createDynamicModel(collectionName);
    const item = await Model.findByIdAndDelete(itemId);
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: "An error occurred" });
  }
});

app.listen(PORT, () => {
  console.log("Listening on Port: " + PORT);
});
