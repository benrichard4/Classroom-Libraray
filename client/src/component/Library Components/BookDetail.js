import { useAuth0 } from "@auth0/auth0-react";
import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router";
import styled from "styled-components";
import Snackbar from "@material-ui/core/Snackbar";
import Alert from "@material-ui/lab/Alert";

import CheckoutModal from "../CheckoutModal";
import { CheckoutContext } from "../context/CheckoutContext";
import LoadingSpinner from "../LoadingSpinner";
import ReturnModal from "../ReturnModal";
import { ReturnContext } from "../context/ReturnContext";

//component that displays book detail
const BookDetail = () => {
  const [book, setBook] = useState(null);
  const [library, setLibrary] = useState(null);
  const [classrooms, setClassrooms] = useState(null);
  const [allStudents, setAllStudents] = useState(null);

  const {
    checkoutModalState,
    checkoutStatus,
    actions: { beginCheckout, clearCheckoutSnackbar },
  } = useContext(CheckoutContext);

  const {
    returnModalState,
    returnStatus,
    actions: { beginReturn, clearReturnSnackbar },
  } = useContext(ReturnContext);

  const { _libId, _bookId } = useParams();
  const { user } = useAuth0();

  //get libarary at load
  useEffect(() => {
    getLibraryFunction();
    getClassRoomsByLibId();
  }, [returnStatus, checkoutStatus]);

  //function that fetches library with id from params
  const getLibraryFunction = () => {
    fetch(`/libraries/${_libId}`)
      .then((res) => res.json())
      .then((LibraryData) => {
        setLibrary(LibraryData.data);
      });
  };

  //gets classrooms by libId
  const getClassRoomsByLibId = () => {
    fetch(`/classrooms/bylib/${_libId}`)
      .then((res) => res.json())
      .then((ClassroomsData) => {
        console.log("CLASSROOMDATA", ClassroomsData);
        setClassrooms(ClassroomsData.data);
        filterClassRoomFunction(ClassroomsData.data);
      });
  };

  //if multiple classrooms are assigned to the libId, combine the class lists and set them to classList state
  const filterClassRoomFunction = (classrooms) => {
    let allStudentsArr = [];
    console.log("CLASSROOMS", classrooms);
    classrooms.forEach((classroom) => {
      classroom.classList.forEach((student) => {
        allStudentsArr.push(student);
      });
    });
    setAllStudents(allStudentsArr);
  };

  //once library state changes, find the book based on the book id from params
  useEffect(() => {
    if (library) {
      const currentBook = library.library.find((book) => {
        return book.volumeNum === _bookId;
      });
      setBook(currentBook);
    }
  }, [library]);

  //funciton that handles the checkout button on click:
  const checkoutButtonOnClick = () => {
    beginCheckout();
  };

  const returnButtonOnClick = () => {
    beginReturn();
  };

  return book === null || allStudents === null ? (
    <LoadingSpinner style={{ marginTop: "50px" }} />
  ) : (
    <>
      <Container>
        <ImgDiv>
          <BookImg src={book.thumbnail} alt={`${book.title} pic`}></BookImg>
          <CheckoutContainer>
            <BookInfo>
              <BoldSpan>Available:</BoldSpan> {book.qtyAvailable}/
              {book.isCheckedout.length}
            </BookInfo>
            {user ? (
              allStudents.length !== 0 ? (
                <>
                  <CheckoutButton
                    onClick={() => {
                      checkoutButtonOnClick();
                    }}
                    disabled={book.qtyAvailable === 0}
                  >
                    Checkout
                  </CheckoutButton>
                  <ReturnButton
                    onClick={returnButtonOnClick}
                    disabled={book.qtyAvailable === book.isCheckedout.length}
                  >
                    Return
                  </ReturnButton>
                </>
              ) : (
                <NoClassCheckoutWarning>
                  *Checkout n/a, this library is not assigned to a classroom*
                </NoClassCheckoutWarning>
              )
            ) : (
              <WaitingListButton>
                {"Add to Waiting list (not yet enabled)"}
              </WaitingListButton>
            )}
          </CheckoutContainer>
        </ImgDiv>
        <BookInfo>
          <BoldSpan>Title:</BoldSpan> {book.title}
        </BookInfo>
        <BookInfo>
          <BoldSpan>Author:</BoldSpan>{" "}
          {book.authors
            ? book.authors.map((author, index) => {
                if (index + 1 === book.authors.length) {
                  return `${author}`;
                } else {
                  return `${author}, `;
                }
              })
            : "N/A"}
        </BookInfo>
        <BookInfo>
          <BoldSpan>Description:</BoldSpan> {book.description}
        </BookInfo>
        <BookInfo>
          <BoldSpan>Categories:</BoldSpan>{" "}
          {book.categories.map((category, index) => {
            if (index + 1 === book.categories.length) {
              return `${category}`;
            } else {
              return `${category}, `;
            }
          })}
        </BookInfo>
        <BookInfo>
          <BoldSpan>Language:</BoldSpan> {book.language.toUpperCase()}
        </BookInfo>
        <BookInfo>
          <BoldSpan>ISBN_10:</BoldSpan> {book.isbn10 ? book.isbn10 : "N/A"}
        </BookInfo>
        <BookInfo>
          <BoldSpan>ISBN_13:</BoldSpan> {book.isbn13 ? book.isbn13 : "N/A"}
        </BookInfo>
        <BookInfo>
          <BoldSpan>Publisher:</BoldSpan> {book.publisher}
        </BookInfo>
        <BookInfo>
          <BoldSpan>Published Date:</BoldSpan> {book.publishedDate}
        </BookInfo>
      </Container>

      {checkoutModalState === "open" && (
        <CheckoutModal
          importedClassrooms={classrooms}
          importedBooks={book}
          open={checkoutModalState === "open"}
        />
      )}

      {returnModalState === "open" && (
        <ReturnModal
          importedClassrooms={classrooms}
          importedBooks={book}
          open={returnModalState === "open"}
        />
      )}

      <Snackbar open={checkoutStatus === "checkedout"} severity="success">
        <Alert
          severity="success"
          onClose={clearCheckoutSnackbar}
          elevation={6}
          variant="filled"
        >
          {`${book.title} successfully checked out!`}
        </Alert>
      </Snackbar>

      <Snackbar open={returnStatus === "returned"} severity="success">
        <Alert
          severity="success"
          onClose={clearReturnSnackbar}
          elevation={6}
          variant="filled"
        >
          {`${book.title} successfully returned!`}
        </Alert>
      </Snackbar>
    </>
  );
};

const Container = styled.div`
  margin: 100px auto;
  width: 60%;
  max-width: 800px;
  border-radius: 3px;
  box-shadow: 0 0 10px 5px lightblue;
  padding: 20px;
`;

const ImgDiv = styled.div`
  /* border: 1px solid green; */
  width: 100%;
  height: 50%;
  display: flex;
  margin-bottom: 10px;
  justify-content: space-between;
`;

const BookImg = styled.img`
  margin: 0 5px;
  height: 100%;
  margin-left: 10px;

  /* max-width: 90px; */
`;

const CheckoutContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: space-around;
  margin-right: 45px;

  /* border: 1px solid pink; */
`;

const BoldSpan = styled.span`
  font-weight: bold;
`;
const BookInfo = styled.div`
  font-size: calc(12px + 0.3vw);
  margin: 3px 0;
`;

const NoClassCheckoutWarning = styled.div`
  width: 210px;
`;

const checkOutReturnButton = styled.button`
  margin: 5px auto;
  width: 100px;
  padding: 15px;
  border: none;
  border-radius: 5px;
  color: white;
  cursor: pointer;
  background-color: ${({ disabled }) => (disabled ? "lightgrey" : "darkblue")};
  cursor: ${({ disabled }) => (disabled ? "default" : "pointer")};
  box-shadow: ${({ disabled }) =>
    disabled ? "default" : "0 0 10px 5px lightblue"};
  &:hover {
    transform: scale(1.05);
    transition: ease 200ms;
  }
  &:active {
    transform: scale(0.95);
    transition: ease 200ms;
  }
`;

const WaitingListButton = styled.button`
  margin: 5px auto;
  width: 100px;
  padding: 15px;
  border: none;
  border-radius: 5px;
  color: white;
  cursor: pointer;
  background-color: ${({ disabled }) => (disabled ? "lightgrey" : "darkblue")};
  cursor: ${({ disabled }) => (disabled ? "default" : "pointer")};
  box-shadow: ${({ disabled }) =>
    disabled ? "default" : "0 0 10px 5px lightblue"};
  &:hover {
    transform: scale(1.05);
    transition: ease 200ms;
  }
  &:active {
    transform: scale(0.95);
    transition: ease 200ms;
  }
`;

const CheckoutButton = styled(checkOutReturnButton)``;

const ReturnButton = styled(checkOutReturnButton)``;
export default BookDetail;
