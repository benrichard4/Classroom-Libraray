import React, { useContext, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { CurrentUserContext } from "./context/CurrentUserContext";
import LoadingSpinner from "./LoadingSpinner";
import styled from "styled-components";
import { NavLink } from "react-router-dom";

const TeacherMainPage = () => {
  const { user, isAuthenticated, isLoading } = useAuth0();
  const { userState } = useContext(CurrentUserContext);

  // if (isLoading) {
  //   return <div>Loading ...</div>;
  // }

  console.log(userState.currentUser);
  return isAuthenticated && userState.currentUser ? (
    <Container>
      {/* if user doesnt have a classroom prompt them to create one*/}
      {userState.currentUser.classrooms.length < 1 && (
        <NavLinkStyle to="/CreateClassroom">
          <BigButton>New here? {"\n"}Click to add a Classroom</BigButton>
        </NavLinkStyle>
      )}
      {/* if user doesnt have a library prompt them to create one*/}
      {userState.currentUser.libraries.length < 1 && (
        <NavLinkStyle to="/CreateLibrary">
          <BigButton>New here? {"\n"}Click to add a Library</BigButton>
        </NavLinkStyle>
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
  height: 25vh;
  border: 2px solid blue;
  margin: 10px;
  text-align: center;
  vertical-align: middle;
  line-height: 25vh;
`;
