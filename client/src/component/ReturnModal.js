import React, { useContext, useEffect, useReducer, useState } from "react";
import styled from "styled-components";
import { ReturnContext } from "./context/ReturnContext";
import LoadingSpinner from "./LoadingSpinner";
import Modal from "./Modal";

//if there isn't an imported teacher it came from book Detail, if there is an importedTeacher, it came from elsewhere.
const ReturnModal = ({
  importedBooks,
  importedTeacher,
  importedClassrooms,
  open,
}) => {
  const [classroomsSelection, setClassroomsSelection] = useState(null);
  const [fullLibrary, setFullLibrary] = useState(null);
  const [fromBookDetail, setFromBookDetail] = useState(null);
  const [studentList, setStudentList] = useState([]);
  const [count, setCount] = useState(0);

  const {
    returnStatus,
    modal,
    error,
    chosenClassroom,
    chosenStudent,
    chosenBook,
    actions: {
      cancelReturn,
      setStudent,
      setBook,
      setClassroom,
      requestReturn,
      returnSuccessful,
      returnFailed,
    },
  } = useContext(ReturnContext);
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

  //from a book, maps through the students' ids and creates an array of their name and id.
  // useEffect(() => {
  //   if (chosenBook) {
  //     // let studentInfoArr = [];

  //     chosenBook.checkedOutBy.map((studentId, index) => {
  //       if (studentId) {
  //         fetch(`/students/${studentId}`)
  //           .then((res) => res.json())
  //           .then((StudentData) => {
  //             let studentObject = [
  //               {
  //                 student_id: StudentData.data._id,
  //                 studentName: `${StudentData.data.surname}, ${StudentData.data.givenName}`,
  //               },
  //             ];
  //             console.log(StudentObject)
  //             setStudentList([...studentList, ...studentObject]);
  //             // studentInfoArr.push(studentObject);
  //           });
  //       }
  //     });
  //     // console.log("STUDENTINFOARR", studentInfoArr);
  //     // setStudentList(studentInfoArr);
  //   }
  // }, [chosenBook]);

  useEffect(() => {
    console.log(chosenStudent);
  }, [chosenStudent]);

  const handleSubmit = (e) => {
    e.preventDefault();
    requestReturn();
    console.log("RIGHTBEOFREPATCH", chosenBook.volumeNum, chosenStudent);
    if (chosenBook.volumeNum && chosenStudent) {
      fetch(`/libraries/${chosenClassroom.library_id}/checkin`, {
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
            // setStudentList([]);
            setFromBookDetail(null);
            returnSuccessful();
            // window.location.reload();
            return;
          } else {
            returnFailed(json.errorMsg);
            return;
          }
        })
        .catch((err) => {
          console.log("error with patch:", err);
          returnFailed("Something went wrong with checkout book PATCH");
          return;
        });
    } else {
      console.log("SOMETHING IS WRONG");
    }
  };

  console.log("chosenStudent", chosenStudent);
  const handleButtonClick = () => {};
  return (
    <Modal
      isOpen={open}
      onClose={cancelReturn}
      aria-label="RETURN BOOK"
      style={{ padding: "2rem 2rem 0" }}
    >
      {fromBookDetail === null ||
      chosenBook === null ||
      returnStatus === "loading" ? (
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
                  <option value="">Select a student</option>

                  {chosenBook.checkedOutBy.map((student, index) => {
                    return (
                      student && (
                        <React.Fragment key={student._id}>
                          <option
                            value={student._id}
                            defaultValue={index === 0}
                          >
                            {student.fullName}
                          </option>
                        </React.Fragment>
                      )
                    );
                  })}
                </SelectStyle>
              </div>
              {console.log("!!!!!!", studentList.length)}
              <button type="submit">Return</button>
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
export default ReturnModal;
