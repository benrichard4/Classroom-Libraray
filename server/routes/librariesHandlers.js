const { MongoClient } = require("mongodb");

require("dotenv").config();
const { MONGO_URI } = process.env;
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const { v4: uuidv4 } = require("uuid");

//.................................................................................//
//LIBRARIES ROUTES                                                                 //
//.................................................................................//

//GET ALL LIBRARIES (FOR BUILDING PURPOSES ONLY)
const getAllLibraries = async (req, res) => {
  const client = new MongoClient(MONGO_URI, options);
  await client.connect();
  try {
    const db = client.db("ClassLibrary");
    const allLibraries = await db.collection("Libraries").find().toArray();
    if (allLibraries) {
      res
        .status(200)
        .json({ status: 200, data: allLibraries, message: "Libraries found" });
    } else {
      res
        .status(400)
        .json({ status: 400, ErrorMsg: "no Libraries found in db" });
    }
    client.close();
  } catch (e) {
    console.log(e);
    client.close();
  }
};

//GET LIBRARY BY ID
const getLibraryById = async (req, res) => {
  const { _id } = req.params;
  const client = new MongoClient(MONGO_URI, options);
  await client.connect();
  try {
    const db = client.db("ClassLibrary");
    const foundLibrary = await db.collection("Libraries").findOne({ _id });
    if (foundLibrary) {
      res
        .status(200)
        .json({ status: 200, data: foundLibrary, message: "Libraries found" });
    } else {
      res
        .status(400)
        .json({ status: 400, ErrorMsg: "no Libraries found in db" });
    }
    client.close();
  } catch (e) {
    console.log(e);
    client.close();
  }
};

//POST NEW LIBRARY TO COLLECTION
//BODY:{
//teacherEmail,
//name,
//library (empty array to start)
//}
const addLibrary = async (req, res) => {
  //create id and new teach object
  const id = uuidv4();
  const newLibraryObject = { _id: id, ...req.body };
  const email = req.body.teacherEmail;
  let teacherExists = false;
  let uniqueName = false;
  const client = new MongoClient(MONGO_URI, options);
  await client.connect();
  try {
    const db = client.db("ClassLibrary");
    //validate if teacher exists
    const teacherResults = await db.collection("Teachers").findOne({ email });

    //check if teach exists
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

    //check if library name is unique in teacher's collection (to be checked on fe as well)
    const allLibraries = await db
      .collection("Libraries")
      .find({ teacherEmail: email })
      .toArray();

    //cycle through teacher's library collection:
    const foundLibraryWithSameName = allLibraries.some((library) => {
      return library.name === req.body.name;
    });
    if (foundLibraryWithSameName) {
      return res.status(400).json({
        status: 400,
        errorMsg: "Library name exists",
      });
    } else {
      uniqueName = true;
    }

    if (teacherExists && uniqueName) {
      //add library to Libraries collection
      await db.collection("Libraries").insertOne(newLibraryObject);
      //add library to teacher's Library list
      const newLibraryIdentifierObject = { _id: id, name: req.body.name };
      await db
        .collection("Teachers")
        .updateOne(
          { email: email },
          { $push: { libraries: newLibraryIdentifierObject } }
        );
      res.status(201).json({
        status: 201,
        data: newLibraryObject,
        message: "Library successfully added",
      });
    }

    //close database
    client.close();
  } catch (e) {
    console.log(e);
    client.close();
  }
};

//ADD LIBRARY WITH PUT (ADD BOOKS USING GOOGLE API )
//BODY:{
//bookIsbn,
//categories,
//waitingList,
//qtyAvailable
//}
const addBookToLibrary = async (req, res) => {
  const { _id } = req.params;
  const { bookIsbn, qtyAvailable } = req.body;
  const client = new MongoClient(MONGO_URI, options);
  //create checked out arrays depending on how many qtyAvailable there are
  let isCheckedout = [];
  let checkedOutBy = [];
  let checkedOutDate = [];
  let returnDate = [];

  for (let i = 0; i <= qtyAvailable - 1; i++) {
    isCheckedout.push(false);
    checkedOutBy.push(undefined);
    checkedOutDate.push(undefined);
    returnDate.push(undefined);
  }
  //define new book object to be added to library
  newBookObject = {
    ...req.body,
    isCheckedout,
    checkedOutBy,
    checkedOutDate,
    returnDate,
  };
  await client.connect();
  try {
    const db = client.db("ClassLibrary");
    //does library exist?
    const foundLibrary = await db.collection("Libraries").findOne({ _id });
    console.log(foundLibrary);
    if (foundLibrary === null) {
      res.status(404).json({ status: 404, errorMsg: "Library Not Found" });
    } else {
      //does book exist in library? If it doesn't add it, if it does, send error Message
      const foundBook = await db
        .collection("Librairies")
        .findOne({ _id, "library.bookIsbn": bookIsbn }, { "bookIsbn.$": 1 });
      if (foundBook) {
        return res.status(400).json({
          status: 400,
          ErrorMsg: "Book already exists, try modifyinig it with patch",
        });
      } else {
        //add it to the library
        await db
          .collection("Libraries")
          .updateOne({ _id }, { $push: { library: newBookObject } });
        res.status(201).json({
          status: 201,
          data: newBookObject,
          message: "book added to library",
        });
      }
    }
    client.close();
  } catch (e) {
    console.log(e);
    client.close();
  }
};

//PATCH CHECKOUT BOOK (TYPICALLY FOR MODIFYING BOOKS: CHECKIN/OUT)
//(in body: bookObject:{
//bookIsbn,
//categories,
//waitingList,
//qtyAvailable,
//isCheckedOut,
//checkedOutBy,
//checkedOutDate,
//returnDate,
//}, student_id)
const checkoutBook = async (req, res) => {
  const { _id } = req.params;
  const { bookObject, student_id } = req.body;
  const client = new MongoClient(MONGO_URI, options);
  let newQtyAvailable = bookObject.qtyAvailable - 1;
  let newisCheckedOut = await client.connect();
  try {
    const db = client.db("ClassLibrary");
    const foundLibrary = await db.collection("Libraries").findOne({ _id });
    if (foundLibrary) {
      //does book exist in library? If it does make the change, if not push error
      const foundBook = await db
        .collection("Libraries")
        .findOne({ _id, "library.bookIsbn": bookIsbn }, { "bookIsbn.$": 1 });
      console.log(foundBook);
      if (foundBook) {
        //check if there are any copies of books left to checkout (if index !== -1, then there is still an available copy)
        const indexOfFalse = foundBook.library[0].isCheckedout.indexOf(false);

        if (indexOfFalse !== -1) {
          //get value of new checkedout array and set it in the book
          let newIsCheckedoutArray = foundBook.library[0].isCheckedout;
          newIsCheckedoutArray[indexOfFalse] = true;
          console.log("newIsCheckedoutArray", newIsCheckedoutArray);
          todaysDate = new Date();
          oneWeekFromNow = new Date();

          oneWeekFromNow.setDate(oneWeekFromNow.getDate() + 7);
          console.log("today", todaysDate, "one week from now", oneWeekFromNow);
          //change value in the libraries collection
          await db
            .collection("Libraries")
            .updateOne(
              { _id, "library.bookIsbn": bookIsbn },
              { $set: { "library.$.isCheckedOut": newIsCheckedoutArray } }
            );
          await db
            .collection("Libraries")
            .updateOne(
              { _id, "library.bookIsbn": bookIsbn },
              { $set: { "library.$.checkedOutBy": student_id } }
            );
          await db
            .collection("Libraries")
            .updateOne(
              { _id, "library.bookIsbn": bookIsbn },
              { $set: { "library.$.checkedOutDate": todaysDate } }
            );
          await db
            .collection("Libraries")
            .updateOne(
              { _id, "library.bookIsbn": bookIsbn },
              { $set: { "library.$.returnDate": oneWeekFromNow } }
            );
          //TODO: ADD CHECKEDOUT BOOK TO AND DATES TO STUDENT
          res.status(200).json({ status: 200, data });
        } else {
          return res.status(404).json({
            status: 404,
            errorMsg:
              "No more books under this title remaining to be checked out. Add name to waiting list",
          });
        }
      } else {
        return res.status(404).json({
          status: 404,
          errorMsg: "The book you were looking for was not found",
        });
      }
    } else {
      return res
        .status(400)
        .json({ status: 400, errorMsg: "no Libraries found in db" });
    }
    client.close();
  } catch (e) {
    console.log(e);
    client.close();
  }
};

//PATCH CHECKIN BOOK (TYPICALLY FOR MODIFYING BOOKS: CHECKIN/OUT)
const checkinBook = async (req, res) => {
  const { _id } = req.params;
  const client = new MongoClient(MONGO_URI, options);
  await client.connect();
  try {
    const db = client.db("ClassLibrary");
    const foundLibrary = await db.collection("Libraries").findOne({ _id });
    if (foundLibrary) {
      res
        .status(200)
        .json({ status: 200, data: foundLibrary, message: "Libraries found" });
    } else {
      res
        .status(400)
        .json({ status: 400, ErrorMsg: "no Libraries found in db" });
    }
    client.close();
  } catch (e) {
    console.log(e);
    client.close();
  }
};

// PATCH CHANGE AVAILABLE QUANTITY
const changeQty = async (req, res) => {
  const { _id } = req.params;
  const client = new MongoClient(MONGO_URI, options);
  await client.connect();
  try {
    const db = client.db("ClassLibrary");
    const foundLibrary = await db.collection("Libraries").findOne({ _id });
    if (foundLibrary) {
      res
        .status(200)
        .json({ status: 200, data: foundLibrary, message: "Libraries found" });
    } else {
      res
        .status(400)
        .json({ status: 400, ErrorMsg: "no Libraries found in db" });
    }
    client.close();
  } catch (e) {
    console.log(e);
    client.close();
  }
};

//PATCH ADD STUDENT TO WAITING LIST
const addToWaitingList = async (req, res) => {};

const deleteLibrary = async (req, res) => {};

module.exports = {
  getAllLibraries,
  getLibraryById,
  addLibrary,
  addBookToLibrary,
  checkoutBook,
  checkinBook,
  addToWaitingList,
  changeQty,
  deleteLibrary,
};
