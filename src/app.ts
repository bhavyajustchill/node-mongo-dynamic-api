import express from "express";
import { cp } from "fs";
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

// // Define the item schema
// const itemSchema = new mongoose.Schema({
//   name: String,
//   description: String,
// });

// // Create the item model
// const Item = mongoose.model("Item", itemSchema);
// Create a generic model without a predefined schema

const Item = mongoose.model("Item", new mongoose.Schema({}, { strict: false }), "items");

// Retrieve all items
// app.get("/api/items", async (req, res) => {
//   try {
//     const items = await Item.find();
//     res.json(items);
//   } catch (error) {
//     res.status(500).json({ error: "An error occurred" });
//   }
// });

app.get("/", async (req, res) => {
  res.json("API is Live!");
});

// Save an item
// app.post("/api/items", async (req, res) => {
//   try {
//     const newItem = new Item(req.body);
//     await newItem.save();
//     res.json(newItem);
//   } catch (error) {
//     res.status(500).json({ error: "An error occurred" });
//   }
// });

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
    const items = await Item.find();
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: "An error occurred" });
  }
});

// Retrieve a specific item
app.get("/api/items/:id", async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) {
      res.status(404).json({ error: "Item not found" });
    } else {
      res.json(item);
    }
  } catch (error) {
    res.status(500).json({ error: "An error occurred" });
  }
});

// Update an item
app.put("/api/items/:id", async (req, res) => {
  try {
    const item = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!item) {
      res.status(404).json({ error: "Item not found" });
    } else {
      res.json(item);
    }
  } catch (error) {
    res.status(500).json({ error: "An error occurred" });
  }
});

// Delete an item
app.delete("/api/items/:id", async (req, res) => {
  try {
    const item = await Item.findByIdAndDelete(req.params.id);
    if (!item) {
      res.status(404).json({ error: "Item not found" });
    } else {
      res.json({ message: "Item deleted successfully" });
    }
  } catch (error) {
    res.status(500).json({ error: "An error occurred" });
  }
});

app.listen(PORT, () => {
  console.log("Listening on Port: " + PORT);
});
