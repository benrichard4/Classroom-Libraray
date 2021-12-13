import React, { useContext, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { CurrentUserContext } from "./context/CurrentUserContext";
import LoadingSpinner from "./LoadingSpinner";
import styled from "styled-components";
import { Link, NavLink } from "react-router-dom";

const TeacherMainPage = () => {
  const { user, isAuthenticated, isLoading } = useAuth0();
  const { userState } = useContext(CurrentUserContext);

  // if (isLoading) {
  //   return <div>Loading ...</div>;
  // }
  return isAuthenticated && userState.currentUser ? (
    <Container>
      {/* if user doesnt have a library prompt them to create one*/}
      {userState.currentUser.libraries.length < 1 && (
        <NavLinkStyle to="/library/create">
          <BigButton>{"New here? \n 1. Click to add a Library"}</BigButton>
        </NavLinkStyle>
      )}
      {/* if user does have a library, display it on dashboard */}
      {userState.currentUser.libraries.length >= 1 && (
        <BigDisplay>
          <LibraryTitleAndList>
            <Title>Libraries:</Title>
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
            <Title>Classrooms:</Title>
            {userState.currentUser.classrooms.map((classroom, index) => {
              return (
                <LibraryList key={index}>
                  <LibraryName>{classroom.name}: </LibraryName>
                  <LinkStyle to={`/classroom/${classroom._id}`}>View</LinkStyle>
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
      <NavLinkStyle to="/checkout">
        <BigButton>Checkout book</BigButton>
      </NavLinkStyle>
      <NavLinkStyle to="/return">
        <BigButton>Return book</BigButton>
      </NavLinkStyle>
    </Container>
  ) : (
    <LoadingSpinner style={{ marginTop: "50px" }} />
  );
};

export default TeacherMainPage;

const Container = styled.div`
  max-width: 1000px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  margin: 20px auto;
`;

const NavLinkStyle = styled(NavLink)``;

const BigButton = styled.div`
  width: 35vw;
  max-width: 450px;
  min-width: 25vh;
  min-height: 200px;
  height: 25vh;
  border: 2px solid blue;
  margin: 10px;
  text-align: center;
  vertical-align: middle;
  /* line-height: 25vh; */
  white-space: pre-line;
  padding: 10vh 0;
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
  margin-top: 10px;
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

const LibraryName = styled.p`
  /* border: 1px solid pink; */
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
