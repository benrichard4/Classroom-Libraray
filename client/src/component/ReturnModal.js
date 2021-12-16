import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { ReturnContext } from "./context/ReturnContext";
import LoadingSpinner from "./LoadingSpinner";
import Modal from "./Modal";

//component that renders the return modal
const ReturnModal = ({
  importedBooks,
  importedTeacher,
  importedClassrooms,
  open,
}) => {
  const [fromBookDetail, setFromBookDetail] = useState(null);

  const {
    returnStatus,
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

  useEffect(() => {
    if (!importedTeacher) {
      //set classrooms and books state
      setFromBookDetail(true);
      setClassroom(importedClassrooms[0]);
      setBook(importedBooks);
    }
  }, []);

  //function that runs the patch that returns a book
  const handleSubmit = (e) => {
    e.preventDefault();
    requestReturn();
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
            setFromBookDetail(null);
            returnSuccessful();
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
    }
  };

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
        <>
          {fromBookDetail === true && (
            <form onSubmit={handleSubmit}>
              <Title>Book Return</Title>
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
                </DropDownDiv>
              </ContentDiv>
              <ButtonDiv>
                <CheckoutButton type="submit">Return</CheckoutButton>
              </ButtonDiv>
            </form>
          )}
          {error && <ErrorDiv>Error: {error}</ErrorDiv>}
        </>
      )}
    </Modal>
  );
};

const Title = styled.h1`
  margin-bottom: 16px;
  text-align: center;
  font-size: 35px;
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
export default ReturnModal;
