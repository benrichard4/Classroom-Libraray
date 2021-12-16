import React, { useContext, useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import styled from "styled-components";
import moment from "moment";

import { CurrentUserContext } from "./context/CurrentUserContext";
import LoadingSpinner from "./LoadingSpinner";

//component for displaying the teachermainpage aka the dashboard on the teacher's side
const TeacherMainPage = () => {
  const [allTeacherClassrooms, setAllTeacherClassrooms] = useState(null);
  const [allTeacherLibraries, setAllTeacherLibraries] = useState(null);
  const [open, setOpen] = useState(false);

  const { user, isAuthenticated } = useAuth0();
  const { userState } = useContext(CurrentUserContext);

  //when page is loaded, get most up-to date classrooms and libraries
  useEffect(() => {
    getClassroomsById();
    getLibrariesById();
  }, [user, userState]);

  //function that gets classrooms by id in teacher object
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

  //handle toggle for opening and closing classrooms in summary
  const handleToggle = (e, index) => {
    e.preventDefault();
    if (open !== index) {
      setOpen(index);
    } else {
      setOpen("closed");
    }
  };

  return isAuthenticated &&
    userState.currentUser &&
    allTeacherClassrooms &&
    allTeacherLibraries ? (
    <Container>
      <BookCheckoutSummary>
        <SummaryBorder>
          <SummaryTitle>Summary</SummaryTitle>

          <SummaryContents>
            {allTeacherClassrooms.map((classroomData, index) => {
              return (
                <LibraryListSummary key={classroomData.data._id}>
                  <TitleDiv
                    onClick={(e) => {
                      handleToggle(e, index);
                    }}
                  >
                    <LibraryName>{classroomData.data.name} </LibraryName>
                    <UpDownArrow>{open === index ? "▲" : "▼"}</UpDownArrow>
                  </TitleDiv>
                  {allTeacherLibraries.map((libraryData) => {
                    return (
                      <React.Fragment key={libraryData.data._id}>
                        {libraryData.data._id ===
                          classroomData.data.library_id && (
                          <>
                            <LibraryNameSummary>
                              ({libraryData.data.name})
                            </LibraryNameSummary>
                            {libraryData.data.library.every(
                              (book) => !book.isCheckedout.some((item) => item)
                            ) ? (
                              <BookListContainer
                                className={open === index ? `open` : `closed`}
                              >
                                {"(No books checked out)"}
                              </BookListContainer>
                            ) : (
                              <BookListContainer
                                className={open === index ? `open` : `closed`}
                              >
                                {libraryData.data.library.map((book, index) => {
                                  return (
                                    <React.Fragment
                                      key={Math.floor(
                                        Math.random() * 10000000000
                                      )}
                                    >
                                      {book.isCheckedout.some(
                                        (item) => item
                                      ) && (
                                        <CheckedOutBookList>
                                          <p>
                                            <BookLink
                                              to={`/library/${libraryData.data._id}/book/${book.volumeNum}`}
                                            >{`${book.title}`}</BookLink>
                                            {` (${book.qtyAvailable}/${book.isCheckedout.length})`}
                                          </p>
                                          {book.isCheckedout.map(
                                            (checkedout, index) => {
                                              return (
                                                <React.Fragment
                                                  key={Math.floor(
                                                    Math.random() * 10000000000
                                                  )}
                                                >
                                                  {checkedout && (
                                                    <CheckedoutNamesDates>
                                                      {"- "}
                                                      <Name>
                                                        {
                                                          book.checkedOutBy[
                                                            index
                                                          ].fullName
                                                        }
                                                      </Name>
                                                      {` - Due: ${moment(
                                                        book.returnDate[index]
                                                      ).format("ddd MMM Do")} `}
                                                    </CheckedoutNamesDates>
                                                  )}
                                                </React.Fragment>
                                              );
                                            }
                                          )}
                                        </CheckedOutBookList>
                                      )}
                                    </React.Fragment>
                                  );
                                })}
                              </BookListContainer>
                            )}
                          </>
                        )}
                      </React.Fragment>
                    );
                  })}
                </LibraryListSummary>
              );
            })}
          </SummaryContents>
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
                    <LibraryName>{library.name} </LibraryName>
                    <LinkStyle to={`/library/${library._id}`}>Browse</LinkStyle>
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
                    <LibraryName>{classroom.name} </LibraryName>
                    <LinkStyle to={`/classroom/${classroom._id}/addclasslist`}>
                      Add Students
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
  height: 50vh;
  min-height: calc(100vh - 160px);
  width: 70vw;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  margin: 0px auto;
`;

const BookCheckoutSummary = styled.div`
  flex: 1;
  height: 95%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px;
  min-width: 350px;
`;

const SummaryBorder = styled.div`
  box-shadow: 0 0 10px 5px lightblue;
  width: 100%;
  height: 95%;
  padding: 15px;
  border-radius: 3px;
`;

const TitleDiv = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
`;

const LibraryNameSummary = styled.p`
  font-size: 14px;
  color: silver;
`;

const UpDownArrow = styled.p`
  height: 15px;
  color: silver;
  font-size: 14px;
  margin-right: 3px;
`;

const SummaryTitle = styled.h1`
  font-size: 25px;
`;

const SummaryContents = styled.div`
  height: 95%;
  overflow: auto;
  overflow-x: hidden;
`;

const LibAndClassContainer = styled.div`
  flex: 1;
  height: 90%;
  padding: 10px;
`;

const NavLinkStyle = styled(NavLink)`
  text-decoration: none;
  &:hover {
    font-weight: bold;
  }
`;

const BigButton = styled.div`
  width: 100%;
  min-width: 350px;
  min-height: 200px;
  height: calc(50% - 10px);
  box-shadow: 0 0 10px 5px lightblue;
  margin-bottom: 20px;
  text-align: center;
  vertical-align: middle;
  white-space: pre-line;
  padding: 100px 0;
  border-radius: 3px;
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
  text-decoration: none;
  margin-left: 10px;
  font-weight: bold;
  flex: 1;
`;

const LibraryList = styled.div`
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid silver;

  margin-top: 5px;
  padding: 5px 10px;
  height: auto;
`;

const LibraryListSummary = styled.div`
  display: flex;
  flex-direction: column;
  box-shadow: 0 0 5px 3px lightblue;
  margin: 0 auto;
  margin-top: 10px;
  padding: 2px 10px;
  height: auto;
  width: 97%;
`;

const LibraryName = styled.p`
  flex: 2;
  text-align: left;
  font-weight: bold;
`;

const BookListContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin: 5px 15px;

  &.open {
    display: block;
  }
  &.closed {
    display: none;
  }
`;

const CheckedOutBookList = styled.div`
  display: flex;
  flex-direction: column;
  margin: 5px 0;
`;

const BookLink = styled(Link)`
  text-decoration: none;
  color: indigo;
  font-weight: bold;
`;

const CheckedoutNamesDates = styled.p`
  margin: 5px 30px;
`;

const Name = styled.span`
  color: darkblue;
`;

const NewLibDiv = styled.div`
  position: relative;
`;

const NewLibLink = styled(Link)`
  position: absolute;
  text-decoration: none;
  bottom: 10px;
  right: 10px;
  &:hover {
    font-weight: bold;
  }
`;
