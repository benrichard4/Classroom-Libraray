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
          window.location.reload();
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
            <form onSubmit={handleSubmit}>
              <p>
                <span>Book:</span>
                {chosenBook.title}
              </p>
              <div>
                {" "}
                <span> Student: </span>
                <SelectStyle
                  value={chosenStudent}
                  onChange={(e) => setStudent(e.target.value)}
                >
                  <option value="" disabled defaultValue>
                    Select a student
                  </option>
                  {chosenClassroom.classList.map((student, index) => {
                    return (
                      <React.Fragment key={student._id}>
                        <option value={student._id}>{student.fullName}</option>
                      </React.Fragment>
                    );
                  })}
                </SelectStyle>
              </div>
              <button type="submit">Checkout</button>
            </form>
          ) : (
            <form></form>
          ),
          error && <ErrorDiv>Error: {error}</ErrorDiv>,
        ]
      )}
    </Modal>
  );
};

const SelectStyle = styled.select`
  padding: 5px 2px;
  border-left: none;
  border-right: none;
`;

const ErrorDiv = styled.div`
  border: 1px solid red;
  color: red;
  width: 20vw;
  padding: 20px;
`;
export default CheckoutModal;
