//this file to to create categories collection that will be used among all new teachers added.

// Import requirements for the file-system and MongoDB
const fs = require("file-system");
const { v4: uuidv4 } = require("uuid");
const { MongoClient } = require("mongodb");

// Read the the file and JSON parse it
const categories = JSON.parse(fs.readFileSync("./data/categories.json"));

// Import requirements for the dotenv
require("dotenv").config();
const { MONGO_URI } = process.env;
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

// Create the batchImport function

const batchImportCategories = async () => {
  const id = uuidv4();
  const client = new MongoClient(MONGO_URI, options);

  await client.connect();

  const db = client.db("ClassLibrary");

  await db.collection("Categories").insertOne({ _id: id, ...categories });

  client.close();
};

batchImportCategories();
