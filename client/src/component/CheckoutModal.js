import React, { useContext, useEffect, useReducer, useState } from "react";
import { CgWindows } from "react-icons/cg";
import styled from "styled-components";
import { CheckoutContext } from "./context/CheckoutContext";
import LoadingSpinner from "./LoadingSpinner";
import Modal from "./Modal";

//if there isn't an imported teacher it came from book Detail, if there is an importedTeacher, it came from elsewhere.
const CheckoutModal = ({
  importedClassrooms,
  importedBooks,
  importedTeacher,
  open,
}) => {
  const [classroomsSelection, setClassroomsSelection] = useState(null);
  const [fullLibrary, setFullLibrary] = useState(null);
  const [fromBookDetail, setFromBookDetail] = useState(null);
  const [studentList, setStudentList] = useState(null);

  const {
    status,
    modal,
    error,
    chosenClassroom,
    chosenStudent,
    chosenBook,
    actions: {
      cancelCheckout,
      setClassroom,
      setStudent,
      setBook,
      requestCheckout,
      checkoutSuccessful,
      checkoutFailed,
      clearSnackbar,
    },
  } = useContext(CheckoutContext);
  //onLoad we want to either set the classroom, students List with input from bookDetail, or make classrooms a drop down list that creates lists for books and students.

  useEffect(() => {
    if (!importedTeacher) {
      //set classrooms and books state
      setFromBookDetail(true);
      setClassroom(importedClassrooms[0]);
      setBook(importedBooks);
    } else {
      //fetch info by teacher
      setFromBookDetail(false);
      setClassroomsSelection(importedTeacher.classrooms);
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    requestCheckout();
    fetch(`/libraries/${chosenClassroom.library_id}/checkout`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        volumeNum: chosenBook.volumeNum,
        student_id: chosenStudent,
      }),
    })
      .then((res) => res.json())
      .then((json) => {
        if (json.status === 200) {
          checkoutSuccessful();
          //   window.location.reload();
          return;
        } else {
          checkoutFailed(json.errorMsg);
          return;
        }
      })
      .catch((err) => {
        console.log("error with patch:", err);
        checkoutFailed("Something went wrong with checkout book PATCH");
        return;
      });
  };

  console.log(
    "CHOSEN CLASSROOM",
    chosenClassroom,
    "FROM BOOK DETAIL",
    fromBookDetail,
    "STATUS",
    status
  );
  const handleButtonClick = () => {};
  return (
    <Modal
      isOpen={open}
      onClose={cancelCheckout}
      aria-label="CHECKOUT BOOK"
      style={{ padding: "2rem 2rem 0" }}
    >
      {fromBookDetail === null ||
      chosenClassroom === null ||
      status === "loading" ? (
        <LoadingSpinner style={{ marginTop: "50px" }} />
      ) : (
        [
          fromBookDetail === true ? (
            <FormStyle onSubmit={handleSubmit}>
              <Title>Book Checkout</Title>
              <ContentDiv>
                <BookTitle>
                  <Bold>{"Book: "}</Bold>
                  {chosenBook.title}
                </BookTitle>
                <DropDownDiv>
                  {" "}
                  <Bold> Student: </Bold>
                  <SelectStyle
                    value={chosenStudent}
                    onChange={(e) => setStudent(e.target.value)}
                  >
                    <option value="">Select a student</option>
                    {chosenClassroom.classList.map((student, index) => {
                      return (
                        <React.Fragment key={student._id}>
                          <option value={student._id}>
                            {student.fullName}
                          </option>
                        </React.Fragment>
                      );
                    })}
                  </SelectStyle>
                </DropDownDiv>
              </ContentDiv>
              <ButtonDiv>
                <CheckoutButton type="submit">Checkout</CheckoutButton>
              </ButtonDiv>
            </FormStyle>
          ) : (
            <form></form>
          ),
          error && <ErrorDiv>Error: {error}</ErrorDiv>,
        ]
      )}
    </Modal>
  );
};

const FormStyle = styled.form``;

const Title = styled.h1`
  margin-bottom: 16px;
  text-align: center;
`;

const ContentDiv = styled.div`
  width: 600px;
  position: relative;
`;

const BookTitle = styled.p`
  margin: 5px;
  color: darkblue;
`;

const Bold = styled.span`
  font-weight: bold;
`;

const DropDownDiv = styled.div`
  color: darkblue;
  margin: 15px;
  margin-left: 5px;
`;

const SelectStyle = styled.select`
  padding: 5px 2px;
`;

const ButtonDiv = styled.div`
  display: flex;
  justify-content: center;
`;

const CheckoutButton = styled.button`
  border: none;
  background-color: darkblue;
  color: white;
  width: 150px;
  height: 50px;
  margin: 30px auto;
  text-decoration: none;
  text-align: center;
  border-radius: 10px;
  padding: 6px 20px;
  cursor: pointer;
  font-size: 17px;
`;

const ErrorDiv = styled.div`
  border: 1px solid red;
  color: red;
  width: 20vw;
  padding: 20px;
`;
export default CheckoutModal;
