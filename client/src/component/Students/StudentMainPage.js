import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import moment from "moment";

import { CurrentUserContext } from "../context/CurrentUserContext";
import LoadingSpinner from "../LoadingSpinner";

//student main page
const StudentMainPage = () => {
  const [classroom, setClassroom] = useState(null);
  const [library, setLibrary] = useState(null);
  const [loading, setLoading] = useState(true);

  //get information from context
  const { userState } = useContext(CurrentUserContext);

  useEffect(() => {
    if (userState.currentUser && userState.studentLibrary) {
      getClassroom();
      getLibrary();
    }
  }, [userState]);

  //get classroom by id
  const getClassroom = () => {
    setLoading(true);
    fetch(`/classrooms/${userState.currentUser.classroomId}`)
      .then((res) => res.json())
      .then((classroomData) => {
        if ((classroomData.status = 200)) {
          setClassroom(classroomData.data);
          setLoading(false);
        }
      });
  };

  const getLibrary = () => {
    setLoading(true);
    fetch(`/libraries/${userState.studentLibrary}`)
      .then((res) => res.json())
      .then((libraryData) => {
        if ((libraryData.status = 200)) {
          setLibrary(libraryData.data);
          setLoading(false);
        }
      });
  };

  return loading ||
    userState.studentTeacher === null ||
    library === null ||
    classroom === null ? (
    <LoadingSpinner style={{ marginTop: "50px" }} />
  ) : (
    <Container>
      <DisplayBox>
        <Title>
          {userState.currentUser.givenName} {userState.currentUser.surname}'s
          Overview
        </Title>
        <InfoDiv>
          <Info>Teacher: M. {userState.studentTeacher.surname}</Info>
          <Info>Classroom: {classroom.name}</Info>
          <Info>Library: {library.name}</Info>
          <Info>Checked Out Book(s):</Info>
          <CheckedOutBooksDiv>
            <BookInfoDiv>
              <BookInfoTitleHeader>Title</BookInfoTitleHeader>
              <BookInfoHeader>Due</BookInfoHeader>
            </BookInfoDiv>

            {userState.currentUser.booksCheckedOut.map((book, index1) => {
              return (
                book && (
                  <BookInfoDiv key={index1}>
                    <BookInfoTitle>{book.title}</BookInfoTitle>
                    {console.log("LIBRARY", library)}
                    {library.library.map((libBook, index) => {
                      return (
                        libBook.volumeNum === book.volumeNum &&
                        libBook.checkedOutBy.map(
                          (checkedStudentId, indexNeeded) => {
                            return (
                              checkedStudentId &&
                              userState.currentUser._id ===
                                checkedStudentId._id && (
                                <React.Fragment key={indexNeeded}>
                                  <BookInfo>
                                    {moment(
                                      libBook.returnDate[indexNeeded]
                                    ).format("ddd MMM Do")}
                                  </BookInfo>
                                </React.Fragment>
                              )
                            );
                          }
                        )
                      );
                    })}
                  </BookInfoDiv>
                )
              );
            })}
          </CheckedOutBooksDiv>
        </InfoDiv>
      </DisplayBox>
    </Container>
  );
};

const Container = styled.div`
  min-height: calc(100vh - 260px);
  max-width: 1200px;
  width: 80vw;
  margin: 0 auto;
`;

const DisplayBox = styled.div`
  margin: 100px auto;
  width: 60%;
  max-width: 800px;
  border-radius: 3px;
  box-shadow: 0 0 10px 5px lightblue;
  padding: 20px;
`;

const Title = styled.h1`
  margin-left: 10px;
  margin-bottom: 10px;
  font-size: 35px;
  color: darkblue;
`;

const InfoDiv = styled.div``;

const Info = styled.p`
  margin: 5px 15px;
`;

const CheckedOutBooksDiv = styled.div`
  display: flex;
  flex-direction: column;
`;

const BookInfoDiv = styled.div`
  display: flex;
  justify-content: space-between;
`;

const BookInfoTitleHeader = styled.p`
  margin: 3px 0px;
  /* color: darkred; */
  width: 60%;
  text-align: center;
`;

const BookInfoHeader = styled.p`
  margin: 3px 70px;
  /* color: darkred; */
  /* text-align: center; */
`;

const BookInfoTitle = styled.p`
  margin: 3px 30px;
  color: darkred;
  width: 60%;
`;

const BookInfo = styled.p`
  margin: 3px 30px;
  color: darkred;
`;

export default StudentMainPage;
