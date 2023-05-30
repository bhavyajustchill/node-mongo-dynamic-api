const mongoose = require("mongoose");

// Object to store the dynamically created models
const dynamicModels = {};
const dynamicSchema = new mongoose.Schema({}, { strict: false });

function createDynamicModel(collectionName) {
  if (!dynamicModels[collectionName]) {
    dynamicModels[collectionName] = mongoose.model("DynamicModel", dynamicSchema, collectionName);
  }
  return dynamicModels[collectionName];
}

module.exports = createDynamicModel;
