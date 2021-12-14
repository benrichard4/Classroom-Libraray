import React, { useContext } from "react";
import styled from "styled-components";
import { useAuth0 } from "@auth0/auth0-react";
import { useHistory } from "react-router";
import { NavLink } from "react-router-dom";

import { CgProfile, CgWindows } from "react-icons/cg";
import LoginButton from "./LoginButton";
import LogoutButton from "./LogoutButton";
import StudentLoginButton from "./StudentLoginButton";
import { CurrentUserContext } from "../context/CurrentUserContext";

const Header = () => {
  const { isAuthenticated, isLoading, user } = useAuth0();
  const history = useHistory();
  const {
    userState,
    setCurrentStudent,
    currentStudent,
    actions: { setLoggedOutState },
  } = useContext(CurrentUserContext);

  console.log(
    "userState.userType",
    userState.userType,
    "currentSudent",
    currentStudent
  );
  return (
    <HeaderStyle>
      <CompanyName>BookNook</CompanyName>
      <QuickLinksDiv>
        {userState.userType && (
          <>
            {userState.userType === "teacher" ? (
              <>
                <QuickLink
                  to="/teacher"
                  activeStyle={{
                    color: "rgb(168,82,132)",
                    textDecoration: "underline",
                  }}
                >
                  <LinkTitle>Dashboard</LinkTitle>
                </QuickLink>
              </>
            ) : (
              <>
                <QuickLink
                  to={`/student/${userState.currentUser._id}`}
                  activeStyle={{
                    color: "rgb(168,82,132)",
                    textDecoration: "underline",
                  }}
                >
                  <LinkTitle>Dashboard</LinkTitle>
                </QuickLink>
                <QuickLink
                  to={`/library/${userState.studentLibrary}`}
                  activeStyle={{
                    color: "rgb(168,82,132)",
                    textDecoration: "underline",
                  }}
                >
                  <LinkTitle>Library</LinkTitle>
                </QuickLink>
              </>
            )}
          </>
        )}
      </QuickLinksDiv>
      <LoginContainer>
        {isAuthenticated ? (
          <>
            <CgProfileStyle />
            <LogoutButton />
            <div> Signed in as: {user.name ? user.name : user.email}</div>
          </>
        ) : (userState.userType === null) & !currentStudent ? (
          <>
            <LoginButton />

            <StudentLoginButton />
          </>
        ) : (
          userState.userType !== null && (
            <>
              <StudentLogoutButton
                onClick={() => {
                  window.sessionStorage.removeItem("Student");
                  setCurrentStudent(null);
                  setLoggedOutState();
                  history.push(`/`);
                }}
              >
                LOGOUT
              </StudentLogoutButton>
              <div> Hi, {userState.currentUser.givenName}!</div>
            </>
          )
        )}
      </LoginContainer>
    </HeaderStyle>
  );
};

export default Header;

const HeaderStyle = styled.header`
  height: 120px;
  background-color: lightblue;
  position: relative;
  padding-top: 20px;
  padding-left: 30px;
`;

const CompanyName = styled.h1`
  margin: 0 auto;
`;

const QuickLinksDiv = styled.div`
  position: absolute;
  bottom: 0;
  left: 5vw;
  /* border: 1px solid red; */
  width: 400px;
  height: 25%;
  display: flex;
  justify-content: space-around;
`;

const QuickLink = styled(NavLink)`
  text-decoration: none;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  margin-right: auto;
  color: black;
  /* border: 1px solid green; */
`;

const LinkTitle = styled.div`
  padding-bottom: 3px;
`;

const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  position: absolute;
  height: 80%;
  top: 50%;
  transform: translateY(-50%);
  right: 30px;
  margin: auto 0;
`;

const CgProfileStyle = styled(CgProfile)`
  font-size: 30px;
`;

const StudentLogoutButton = styled.button`
  font-size: 20px;
`;
