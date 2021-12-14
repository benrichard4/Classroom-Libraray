import React, { useContext, useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import styled from "styled-components";
import moment from "moment";

import { CurrentUserContext } from "./context/CurrentUserContext";
import LoadingSpinner from "./LoadingSpinner";

const TeacherMainPage = () => {
  const [allTeacherClassrooms, setAllTeacherClassrooms] = useState(null);
  const [allTeacherLibraries, setAllTeacherLibraries] = useState(null);

  const { user, isAuthenticated, isLoading } = useAuth0();
  const { userState } = useContext(CurrentUserContext);

  //when page is loaded, get most up-to date classrooms and libraries
  useEffect(() => {
    getClassroomsById();

    getLibrariesById();
  }, [user, userState]);

  const getClassroomsById = async () => {
    if (user && userState.currentUser) {
      Promise.all(
        userState.currentUser.classrooms.map((classroom) =>
          fetch(`/classrooms/${classroom._id}`)
        )
      )
        .then((responses) => Promise.all(responses.map((res) => res.json())))
        .then((results) => {
          setAllTeacherClassrooms(results);
        });
    }
  };

  //get library by id for each id in the teacher object
  const getLibrariesById = () => {
    if (user && userState.currentUser) {
      Promise.all(
        userState.currentUser.libraries.map((library) =>
          fetch(`/libraries/${library._id}`)
        )
      )
        .then((responses) => Promise.all(responses.map((res) => res.json())))
        .then((results) => {
          setAllTeacherLibraries(results);
        });
    }
  };

  return isAuthenticated &&
    userState.currentUser &&
    allTeacherClassrooms &&
    allTeacherLibraries ? (
    <Container>
      <BookCheckoutSummary>
        <SummaryBorder>
          <h1>Summary</h1>
          {allTeacherClassrooms.map((classroomData) => {
            return (
              <LibraryListSummary key={classroomData.data._id}>
                <LibraryName>{classroomData.data.name} </LibraryName>
                {allTeacherLibraries.map((libraryData) => {
                  return (
                    <React.Fragment key={libraryData.data._id}>
                      {libraryData.data._id ===
                        classroomData.data.library_id && (
                        <>
                          {/* <LibraryNameSummary>
                            {libraryData.data.name}
                          </LibraryNameSummary> */}
                          {libraryData.data.library.map((book, index) => {
                            return (
                              <React.Fragment
                                key={Math.floor(Math.random() * 10000000000)}
                              >
                                {book.isCheckedout.some((item) => item) && (
                                  <CheckedOutBookList>
                                    <p>
                                      <Link
                                        to={`/library/${libraryData.data._id}/book/${book.volumeNum}`}
                                      >{`${book.title}`}</Link>
                                      {` --- ${book.qtyAvailable} remaining`}
                                    </p>
                                    {book.isCheckedout.map(
                                      (checkedout, index) => {
                                        return (
                                          <>
                                            {checkedout && (
                                              <p>{`${
                                                book.checkedOutBy[index]
                                                  .fullName
                                              } - Due: ${moment(
                                                book.returnDate[index]
                                              ).format("dddd MMM Do")} `}</p>
                                            )}
                                          </>
                                        );
                                      }
                                    )}
                                  </CheckedOutBookList>
                                )}
                              </React.Fragment>
                            );
                          })}
                        </>
                      )}
                    </React.Fragment>
                  );
                })}
              </LibraryListSummary>
            );
          })}
        </SummaryBorder>
      </BookCheckoutSummary>
      {/* if user doesnt have a library prompt them to create one*/}
      <LibAndClassContainer>
        {userState.currentUser.libraries.length < 1 && (
          <NavLinkStyle to="/library/create">
            <BigButton>{"New here? \n 1. Click to add a Library"}</BigButton>
          </NavLinkStyle>
        )}
        {/* if user does have a library, display it on dashboard */}
        {userState.currentUser.libraries.length >= 1 && (
          <BigDisplay>
            <LibraryTitleAndList>
              <Title>Libraries</Title>
              {userState.currentUser.libraries.map((library, index) => {
                return (
                  <LibraryList key={index}>
                    <LibraryName>{library.name}: </LibraryName>
                    <LinkStyle to={`/library/${library._id}`}>View</LinkStyle>
                    <LinkStyle to={`/library/${library._id}/addbook`}>
                      Modify
                    </LinkStyle>
                  </LibraryList>
                );
              })}
            </LibraryTitleAndList>
            <NewLibDiv>
              <NewLibLink to="/library/create">Create a New Library</NewLibLink>
            </NewLibDiv>
          </BigDisplay>
        )}
        {/* if user doesnt have a classroom prompt them to create one*/}
        {userState.currentUser.classrooms.length < 1 && (
          <NavLinkStyle to="/classroom/create">
            <BigButton>{"New here? \n 2. Click to add a Classroom"}</BigButton>
          </NavLinkStyle>
        )}
        {/* if user does have a classroom, display it on dashboard */}
        {userState.currentUser.classrooms.length >= 1 && (
          <BigDisplay>
            <LibraryTitleAndList>
              <Title>Classrooms</Title>
              {userState.currentUser.classrooms.map((classroom, index) => {
                return (
                  <LibraryList key={index}>
                    <LibraryName>{classroom.name}: </LibraryName>
                    <LinkStyle to={`/classroom/${classroom._id}`}>
                      View
                    </LinkStyle>
                    <LinkStyle to={`/classroom/${classroom._id}/addclasslist`}>
                      Modify
                    </LinkStyle>
                  </LibraryList>
                );
              })}
            </LibraryTitleAndList>
            <NewLibDiv>
              <NewLibLink to="/classroom/create">
                Create a New Classroom
              </NewLibLink>
            </NewLibDiv>
          </BigDisplay>
        )}
      </LibAndClassContainer>
    </Container>
  ) : (
    <LoadingSpinner style={{ marginTop: "50px" }} />
  );
};

export default TeacherMainPage;

const Container = styled.div`
  max-width: 1200px;
  min-width: 400px;
  height: 70vh;
  width: 70vw;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  margin: 20px auto;
  /* border: 1px solid black; */
`;

const BookCheckoutSummary = styled.div`
  flex: 1;
  height: 100%;
  /* border: 1px solid red; */
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px;
  min-width: 350px;
`;

const SummaryBorder = styled.div`
  /* border: 2px solid blue; */
  box-shadow: 0 0 10px 5px lightblue;
  width: 100%;
  height: 100%;
  padding: 10px;
`;

const LibAndClassContainer = styled.div`
  flex: 1;
  height: 100%;
  /* border: 1px solid red; */
  padding: 10px;
`;

const NavLinkStyle = styled(NavLink)``;

const BigButton = styled.div`
  width: 100%;
  /* max-width: 450px; */
  min-width: 350px;
  min-height: 200px;
  height: calc(50% - 10px);
  /* border: 2px solid blue; */
  box-shadow: 0 0 10px 5px lightblue;
  margin-bottom: 20px;
  text-align: center;
  vertical-align: middle;
  /* line-height: 25vh; */
  white-space: pre-line;
  padding: 20px 0;
`;

const BigDisplay = styled(BigButton)`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  line-height: 20px;
  vertical-align: auto;
  padding: 5px;
`;

const LibraryTitleAndList = styled.div`
  display: flex;
  flex-direction: column;
`;

const Title = styled.h2`
  margin: 10px 0;
`;

const LinkStyle = styled(Link)`
  /* border: 1px solid green; */
  text-decoration: none;
  margin-left: 10px;
  font-weight: bold;
`;

const LibraryList = styled.div`
  display: flex;
  /* border: 1px solid red; */
  margin-top: 5px;
  padding: 2px 10px;
  height: auto;
`;

const LibraryListSummary = styled.div`
  display: flex;
  flex-direction: column;
  /* border: 1px solid red; */
  margin-top: 5px;
  padding: 2px 10px;
  height: auto;
`;

const LibraryName = styled.p`
  /* border: 1px solid pink; */
  font-weight: bold;
`;

const CheckedOutBookList = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 15px;
`;

const LibraryNameSummary = styled.p`
  margin-left: 15px;
`;

const NewLibDiv = styled.div`
  position: relative;
  /* border: 1px solid red; */
`;

const NewLibLink = styled(Link)`
  position: absolute;
  text-decoration: none;
  bottom: 10px;
  right: 10px;
  /* border: 1px solid pink; */
  &:hover {
    font-weight: bold;
  }
`;
