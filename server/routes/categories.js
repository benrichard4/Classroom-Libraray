/**
  Endpoints related to categories
**/

const { MongoClient } = require("mongodb");

require("dotenv").config();
const { MONGO_URI } = process.env;
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const router = require("express").Router();

//get category by id
router.get("/categories/:_id", async (req, res) => {
  const { _id } = req.params;
  const client = new MongoClient(MONGO_URI, options);
  await client.connect();
  try {
    const db = client.db("ClassLibrary");
    const foundCategory = await db.collection("Categories").findOne({ _id });
    if (foundCategory) {
      res
        .status(200)
        .json({ status: 200, data: foundCategory, message: "Category found" });
    } else {
      res
        .status(400)
        .json({ status: 400, ErrorMsg: "no Categories found in db" });
    }
    client.close();
  } catch (e) {
    console.log(e);
    client.close();
  }
}); // gets categories by id

module.exports = router;
