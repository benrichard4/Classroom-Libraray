const { MongoClient } = require("mongodb");

require("dotenv").config();
const { MONGO_URI } = process.env;
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const { v4: uuidv4 } = require("uuid");

//.................................................................................//
//STUDENT ROUTES                                                                   //
//.................................................................................//

//GET ALL STUDENTS
const getAllStudents = async (req, res) => {
  const client = new MongoClient(MONGO_URI, options);
  await client.connect();
  try {
    const db = client.db("ClassLibrary");
    const allStudents = await db.collection("Students").find().toArray();
    if (allStudents) {
      res.status(200).json({
        status: 200,
        data: allStudents,
        message: "Students found",
      });
    } else {
      res
        .status(400)
        .json({ status: 400, errorMsg: "no Students found in db" });
    }
    client.close();
  } catch (e) {
    console.log(e);
    client.close();
  }
};

//GET STUDENTS BY ID
const getStudentById = async (req, res) => {
  const { _id } = req.params;

  const client = new MongoClient(MONGO_URI, options);
  await client.connect();
  try {
    const db = client.db("ClassLibrary");
    const foundStudent = await db.collection("Students").findOne({ _id });
    if (foundStudent) {
      res.status(200).json({
        status: 200,
        data: foundStudent,
        message: "Student found",
      });
    } else {
      res.status(400).json({
        status: 400,
        errorMsg: "no Student found in db with given id",
      });
    }
    client.close();
  } catch (e) {
    console.log(e);
    client.close();
  }
};

//STUDENTS BY LOGIN
const studentLogin = async (req, res) => {
  const { username, password } = req.body;

  const client = new MongoClient(MONGO_URI, options);
  await client.connect();
  try {
    const db = client.db("ClassLibrary");
    const foundStudent = await db
      .collection("Students")
      .findOne({ username, password });
    if (foundStudent) {
      res.status(200).json({
        status: 200,
        data: foundStudent,
        message: "Student found",
      });
    } else {
      res.status(400).json({
        status: 400,
        errorMsg: "Incorrect username or password. Please try again.",
      });
    }
    client.close();
  } catch (e) {
    console.log(e);
    client.close();
  }
};

//GET STUDENTS BY CLASSROOM
const getStudentsByClassroom = async (req, res) => {
  const { classroom_id } = req.params;

  const client = new MongoClient(MONGO_URI, options);
  await client.connect();
  try {
    const db = client.db("ClassLibrary");
    const foundStudents = await db
      .collection("Students")
      .find({ classroomId: classroom_id })
      .collation({ locale: "en" })
      .sort({ surname: 1 })
      .toArray();
    if (foundStudents) {
      res.status(200).json({
        status: 200,
        data: foundStudents,
        message: "Students found",
      });
    } else {
      res.status(400).json({
        status: 400,
        ErrorMsg: "no Students found in db with given classroom id",
      });
    }
    client.close();
  } catch (e) {
    console.log(e);
    client.close();
  }
};

//ADD STUDENTS (POST)
//BODY:[{...},{...},{...},{
//givenName,
//surName,
//}]
const addNewStudent = async (req, res) => {
  const { classroom_id } = req.params;
  //cycle through req.body to and complete the student object by adding a username, password, books checkedout list and waitinglist
  const id = uuidv4();
  UpdatedStudentArray = req.body.map((studentObject) => {
    const id = uuidv4();
    const username = studentObject.givenName
      .substr(0, 2)
      .toLowerCase()
      .concat("_", studentObject.surname.substr(0, 2))
      .toLowerCase();
    studentObject.username = username;
    studentObject.password = Array(6)
      .fill("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz")
      .map(function (x) {
        return x[Math.floor(Math.random() * x.length)];
      })
      .join("");
    studentObject.classroomId = classroom_id;
    studentObject.booksCheckedOut = [];
    studentObject.waitingList = [];
    const studentObject2 = { _id: id, ...studentObject };
    return studentObject2;
  });

  //get an array of student ids
  const studentInfoArray = UpdatedStudentArray.map((updatedStudentObject) => {
    const studentIdentifier = {
      _id: updatedStudentObject._id,
      fullName: updatedStudentObject.surname.concat(
        ", ",
        updatedStudentObject.givenName
      ),
    };
    return studentIdentifier;
  });
  const client = new MongoClient(MONGO_URI, options);
  await client.connect();
  try {
    const db = client.db("ClassLibrary");
    //check if any of the students already exists in db
    const FullStudentList = await db
      .collection("Classrooms")
      .find({ _id: classroom_id })
      .toArray();
    //if classroom does not exist send an error message
    if (FullStudentList.length < 1) {
      return res.status(404).json({
        status: 404,
        errorMsg: `The classroom id you provided does not exist`,
      });
    }
    let StudentAlreadyExists = null;
    if (FullStudentList.length > 0) {
      StudentAlreadyExists = FullStudentList[0].classList.map((student) => {
        let exists = null;
        studentInfoArray.forEach((incomingStudent) => {
          if (incomingStudent.fullName === student.fullName) {
            exists = incomingStudent.fullName;
          }
        });
        return exists;
      });
    }
    const existsBoolean = StudentAlreadyExists.some((element) => {
      return element !== null;
    });
    if (existsBoolean) {
      return res.status(400).json({
        status: 400,
        errorMsg: `${StudentAlreadyExists} is/are already in the database for this class`,
      });
    } else {
      //add the students to the student collection
      const StudentResults = await db
        .collection("Students")
        .insertMany(UpdatedStudentArray);
      //add student ids to the class list
      const updatedClassList = await db.collection("Classrooms").updateOne(
        { _id: classroom_id },
        {
          $push: {
            classList: { $each: studentInfoArray, $sort: { fullName: 1 } },
          },
        }
      );
      res.status(201).json({
        status: 201,
        data: UpdatedStudentArray,
        message: "Student(s) added to class list",
      });
    }
    client.close();
  } catch (e) {
    console.log(e);
    client.close();
  }
};

//DELETE STUDENT (DELETE)
const deleteStudentById = async (req, res) => {
  const client = new MongoClient(MONGO_URI, options);
  await client.connect();
  try {
    const db = client.db("ClassLibrary");
    client.close();
  } catch (e) {
    console.log(e);
    client.close();
  }
};

module.exports = {
  getAllStudents,
  getStudentById,
  getStudentsByClassroom,
  studentLogin,
  addNewStudent,
  deleteStudentById,
};
