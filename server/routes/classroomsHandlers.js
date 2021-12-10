const { MongoClient } = require("mongodb");

require("dotenv").config();
const { MONGO_URI } = process.env;
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const { v4: uuidv4 } = require("uuid");

//.................................................................................//
//CLASSROOM ROUTES                                                                 //
//.................................................................................//

//GET ALL CLASSROOMS (FOR BUILDING PURPOSES ONLY)
const getAllClassrooms = async (req, res) => {
  const client = new MongoClient(MONGO_URI, options);
  await client.connect();
  try {
    const db = client.db("ClassLibrary");
    const allClassrooms = await db.collection("Classrooms").find().toArray();
    if (allClassrooms) {
      res.status(200).json({
        status: 200,
        data: allClassrooms,
        message: "Classrooms found",
      });
    } else {
      res
        .status(400)
        .json({ status: 400, ErrorMsg: "no Classrooms found in db" });
    }
    client.close();
  } catch (e) {
    console.log(e);
    client.close();
  }
};

const getClassroomsById = async (req, res) => {
  const { _id } = req.params;

  const client = new MongoClient(MONGO_URI, options);
  await client.connect();
  try {
    const db = client.db("ClassLibrary");
    const foundClassroom = await db.collection("Classrooms").findOne({ _id });
    if (foundClassroom) {
      res.status(200).json({
        status: 200,
        data: foundClassroom,
        message: "Classroom found",
      });
    } else {
      res.status(400).json({
        status: 400,
        ErrorMsg: "no classroom found in db with given id",
      });
    }
    client.close();
  } catch (e) {
    console.log(e);
    client.close();
  }
};

//POST NEW CALSSROOM TO COLLECTION
//(BODY: {
//teacherEmail,
//name,
//library_id,
//classList (empty array to start)}
const addNewClassroom = async (req, res) => {
  const id = uuidv4();
  const newClassroomObject = { _id: id, ...req.body };
  const email = req.body.teacherEmail;
  let teacherExists = false;
  let uniqueName = false;
  const client = new MongoClient(MONGO_URI, options);
  await client.connect();
  try {
    const db = client.db("ClassLibrary");
    //validate if teacher exists
    const teacherResults = await db.collection("Teachers").findOne({ email });

    //check if teacher exists
    if (teacherResults) {
      teacherExists = true;
    }
    //if the teacher doesn't exist, send error message
    else {
      return res.status(404).json({
        status: 404,
        errorMsg: "teacher doesn't exist",
      });
    }

    //check if classroom name is unique in teacher's collection (to be checked on fe as well)
    const allClassrooms = await db
      .collection("Classrooms")
      .find({ teacherEmail: email })
      .toArray();

    //cycle through teacher's library collection:
    const foundClassroomWithSameName = allClassrooms.some((classroom) => {
      return classroom.name === req.body.name;
    });

    if (foundClassroomWithSameName) {
      return res.status(400).json({
        status: 400,
        errorMsg: "Classname already exists. Pick a different name",
      });
    } else {
      uniqueName = true;
    }

    if (teacherExists && uniqueName) {
      //add classroom to Libraries collection
      await db.collection("Classrooms").insertOne(newClassroomObject);
      //add classroom to teacher's classroom list
      const newClassroomIdentifierObject = { _id: id, name: req.body.name };
      await db
        .collection("Teachers")
        .updateOne(
          { email: email },
          { $push: { classrooms: newClassroomIdentifierObject } }
        );
      res.status(201).json({
        status: 201,
        data: newClassroomObject,
        message: "Classroom successfully added",
      });
    }

    client.close();
  } catch (e) {
    console.log(e);
    client.close();
  }
};

//ADDING STUDENTS TO CLASSLIST
//classlist:{
//givenName,
//surname,
//username(generated first 2 letters of first name, first 2 letters of last name)
//password(randomly generated)
//classroom
//
//}
const modifyClassroom = async (req, res) => {};
//adding students
module.exports = {
  getAllClassrooms,
  getClassroomsById,
  addNewClassroom,
  modifyClassroom,
};
