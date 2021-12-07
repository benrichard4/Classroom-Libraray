/**
  Endpoints related to libraries (libraries and books collections)
**/

const router = require("express").Router();
const {
  getAllLibraries,
  getLibraryById,
  addLibrary,
  addBookToLibrary,
  checkoutBook,
  checkinBook,
  addToWaitingList,
  changeQty,
  deleteLibrary,
} = require("./librariesHandlers");

//.......................................//
//LIBRARY ROUTES                         //
//.......................................//
router.get("/libraries", getAllLibraries); //get all libraries
router.get("/libraries/:_id", getLibraryById); //get libraries by id
router.post("/libraries", addLibrary); //post a new libaray to collection (BODY: _id (uuid4), teacher_id, name, library (empty array to start).
router.put("/libraries/:_id", addBookToLibrary); //modify existing library by adding book (typically for updating the library key) BODY( book_isbn, categories_id, isCheckedOut (false to start), checkedOutBy (empty array to start), checkedOutDate(empty array to start), returnData(empty array to start), waitingLiost, qtyAvailably )
router.patch("/libraries/:_id/checkout", checkoutBook); //for checking out books
router.patch("/libraries/:_id/checkin", checkinBook); //for checking in books
router.patch("/libraries/:_id/waitingList", addToWaitingList); //for adding student to waiting list
router.patch("/libraries/:_id/increaseQty", changeQty); //for increasing AvailableQty of book existing
router.delete("/libraries/:id", deleteLibrary); // delete a library from a collection by id

//GOOGLE API:
//FIND BOOK: search.item["indexSelected"].volumeInfo. =>
//.title,
//.authors[map through, could be multiple]
//.publisher,
//.publishedDate,
//.description,
//.industryIdentifiers[0].identifier <===(ISBN)   =>[{type:ISBN_10,identifier:"...ISBN"}, {type:"ISBN_13", identifier:"...ISBN"}]
//.imageLinks.thumbnail,
//.language,

//..........................................................................................//
//BOOKS ROUTES            MAY NOT USE!!! MAY JUST TAP INTO GOOGLE API FOR ALL INFORMATION   //
//..........................................................................................//
//router.get("/books", getAllBooks); //get all books from books collection
//router.get("/books/:isbn", getBookByIsbn); //get a book by isbn
//router.post("/books", addBook); //add a book (only book information) from book collection (from GOOGLE API. items.) BODY(_id(uuid4), ISBN, title, author, description, )
//router.delete("/books", deleteBook); //delete a book from

module.exports = router;
