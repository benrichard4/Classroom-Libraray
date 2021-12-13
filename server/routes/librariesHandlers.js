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

//ADD book to library
//BODY:{
//   volumeNum: null,
//   title: null,
//   authors: null,
//   description: null,
//   thumbnail: null,
//   language: null,
//   publishedDate: null,
//   publisher: null,
//   isbn13: null,
//   isbn10: null,
//categories,
//waitingList,
//qtyAvailable
//}
const addBookToLibrary = async (req, res) => {
  const { _id } = req.params;
  const { volumeNum, qtyAvailable } = req.body;
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
    if (foundLibrary === null) {
      res.status(404).json({ status: 404, errorMsg: "Library Not Found" });
    } else {
      const foundBook = foundLibrary.library.find((book) => {
        return book.volumeNum === volumeNum;
      });
      //does book exist in library? If it doesn't add it, if it does, send error Message
      if (foundBook) {
        return res.status(400).json({
          status: 400,
          errorMsg:
            "Book already exists, try modifying it another way, or add another book",
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

//REMOVE BOOK FROM LIBRARY:
//body: {volumeNum}
const removeBookFromLibrary = async (req, res) => {
  const { volumeNum } = req.body;
  const { _id } = req.params;
  const client = new MongoClient(MONGO_URI, options);
  await client.connect();
  try {
    const db = client.db("ClassLibrary");
    //findlibrary and get object for book. check if it is checked out. If checked out, throw error, can only delete book if all copies are checked in.
    const foundLibrary = await db.collection("Libraries").findOne({ _id });

    //get book Object from library
    const foundBookArray = foundLibrary.library.filter((book) => {
      return book.volumeNum === volumeNum;
    });
    const foundBookObject = foundBookArray[0];
    anyCheckedOut = foundBookObject.isCheckedout.some((element) => {
      return element;
    });
    if (anyCheckedOut) {
      res.status(400).json({
        status: 400,
        errorMsg: "Must check in all books before deleting",
      });
    } else {
      await db
        .collection("Libraries")
        .updateOne({ _id }, { $pull: { library: { volumeNum: volumeNum } } });

      res
        .status(200)
        .json({ status: 200, message: `Book deleted: volumeNum${volumeNum}` });
    }

    client.close();
  } catch (e) {
    console.log(e);
    client.close();
  }
};

//PATCH CHECKOUT BOOK (FOR MODIFYING BOOKS: CHECKIN/OUT)
//(in body: {
//volumeNum,
//student_id,
//}
const checkoutBook = async (req, res) => {
  const { _id } = req.params;
  const { student_id } = req.body;
  const { volumeNum } = req.body;
  const client = new MongoClient(MONGO_URI, options);
  await client.connect();
  try {
    const db = client.db("ClassLibrary");
    //check if student exists:
    const foundStudent = await db
      .collection("Students")
      .findOne({ _id: student_id });
    if (foundStudent) {
      const foundLibrary = await db.collection("Libraries").findOne({ _id });
      if (foundLibrary) {
        //does book exist in library? If it does make the change, if not push error
        const foundBook = await db
          .collection("Libraries")
          .findOne({ _id, "library.volumeNum": volumeNum }); //, { "library.$": 1 });

        //get book Object from library
        const foundBookArray = foundLibrary.library.filter((book) => {
          return book.volumeNum === volumeNum;
        });
        const foundBookObject = foundBookArray[0];

        if (foundBook) {
          // check if there are any copies of books left to checkout
          if (foundBookObject.qtyAvailable >= 1) {
            //get value of new checkedout array and set it in the book
            let newQtyAvailable = foundBookObject.qtyAvailable - 1;
            let newIsCheckedoutArray = foundBookObject.isCheckedout;
            let newCheckedOutByArray = foundBookObject.checkedOutBy;
            let newCheckedOutDateArray = foundBookObject.checkedOutDate;
            let newReturnDateArray = foundBookObject.returnDate;
            //get index of first false
            const indexOfFalse = foundBookObject.isCheckedout.indexOf(false);
            //replace the first instance of false with true in all new arrays
            newIsCheckedoutArray[indexOfFalse] = true;
            let fullName = `${foundStudent.surname}, ${foundStudent.givenName}`;
            newCheckedOutByArray[indexOfFalse] = {
              _id: student_id,
              fullName: fullName,
            };
            //set dates for checkin and return
            todaysDate = new Date();
            oneWeekFromNow = new Date();
            oneWeekFromNow.setDate(oneWeekFromNow.getDate() + 7);
            //update date specific arrays
            newCheckedOutDateArray[indexOfFalse] = todaysDate.toISOString();
            newReturnDateArray[indexOfFalse] = oneWeekFromNow.toISOString();
            //change value in the libraries collection
            const updatedBookObject = {
              ...foundBookObject,
              qtyAvailable: newQtyAvailable,
              isCheckedout: newIsCheckedoutArray,
              checkedOutBy: newCheckedOutByArray,
              checkedOutDate: newCheckedOutDateArray,
              returnDate: newReturnDateArray,
            };
            //update book in library
            await db
              .collection("Libraries")
              .updateOne(
                { _id, "library.volumeNum": foundBookObject.volumeNum },
                { $set: { "library.$": updatedBookObject } }
              );
            //add book to books checked out list in student collection
            //1st make an array with volumeNum and return date
            const studentCheckedOutObject = {
              volumeNum: foundBookObject.volumeNum,
              title: foundBookObject.title,
              returnDate: newReturnDateArray[indexOfFalse],
            };
            await db
              .collection("Students")
              .updateOne(
                { _id: student_id },
                { $push: { booksCheckedOut: studentCheckedOutObject } }
              );
            return res.status(200).json({
              status: 200,
              data: updatedBookObject,
              message: "Book successfully checked out",
            });
          } else {
            return res
              .status(400)
              .json({ status: 400, errorMsg: "No more books to checkout" });
          }
        } else {
          return res
            .status(400)
            .json({ status: 400, errorMsg: "Book volume number not found!" });
        }
      } else {
        res
          .status(400)
          .json({ status: 400, errorMsg: "no Libraries found in db" });
      }
    } else {
      return res
        .status(400)
        .json({ status: 400, errorMsg: "StudentId not found" });
    }
    client.close();
  } catch (e) {
    console.log(e);
    client.close();
  }
};

//PATCH CHECKIN BOOK
//body:{
//volumeNum,
//student_id
//}
const checkinBook = async (req, res) => {
  const { _id } = req.params;
  const { student_id } = req.body;
  const { volumeNum } = req.body;
  const client = new MongoClient(MONGO_URI, options);
  await client.connect();
  try {
    const db = client.db("ClassLibrary");
    const foundLibrary = await db.collection("Libraries").findOne({ _id });

    if (foundLibrary) {
      //get book Object from library
      const foundBookArray = foundLibrary.library.filter((book) => {
        return book.volumeNum === volumeNum;
      });
      const foundBookObject = foundBookArray[0];
      //find index of student id in checkedOutBy field
      const indexOfStudentId = foundBookObject.checkedOutBy.findIndex((x) => {
        if (x) {
          return x._id === student_id;
        }
      });
      //update the key value pairs for new book object
      let newQtyAvailable = foundBookObject.qtyAvailable + 1;
      let newIsCheckedoutArray = foundBookObject.isCheckedout;
      let newCheckedOutByArray = foundBookObject.checkedOutBy;
      let newCheckedOutDateArray = foundBookObject.checkedOutDate;
      let newReturnDateArray = foundBookObject.returnDate;

      //replace the relavent instance of true with false
      newIsCheckedoutArray[indexOfStudentId] = false;
      //set relavent instances of checkedoutby and dates to null
      newCheckedOutByArray[indexOfStudentId] = null;
      newCheckedOutDateArray[indexOfStudentId] = null;
      newReturnDateArray[indexOfStudentId] = null;

      //change value in the libraries collection
      const updatedBookObject = {
        ...foundBookObject,
        qtyAvailable: newQtyAvailable,
        isCheckedout: newIsCheckedoutArray,
        checkedOutBy: newCheckedOutByArray,
        checkedOutDate: newCheckedOutDateArray,
        returnDate: newReturnDateArray,
      };

      //update book in library
      await db
        .collection("Libraries")
        .updateOne(
          { _id, "library.volumeNum": foundBookObject.volumeNum },
          { $set: { "library.$": updatedBookObject } }
        );
      //remove book from books checked out list in student collection
      //1st make an array with volumeNum and return date

      await db
        .collection("Students")
        .updateOne(
          { _id: student_id },
          { $pull: { booksCheckedOut: { volumeNum: volumeNum } } }
        );

      return res.status(200).json({
        status: 200,
        data: updatedBookObject,
        message: "Book successfully checked in",
      });
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
  removeBookFromLibrary,
  checkoutBook,
  checkinBook,
  addToWaitingList,
  changeQty,
  deleteLibrary,
};
