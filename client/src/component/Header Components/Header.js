import React, { useContext } from "react";
import styled from "styled-components";
import { useAuth0 } from "@auth0/auth0-react";
import { useHistory } from "react-router";
import { NavLink } from "react-router-dom";

import { CgProfile } from "react-icons/cg";
import LoginButton from "./LoginButton";
import LogoutButton from "./LogoutButton";
import StudentLoginButton from "./StudentLoginButton";
import { CurrentUserContext } from "../context/CurrentUserContext";
import Logo from "../../assets/logo-booknook.png";

//component for displaying the header
const Header = () => {
  const { isAuthenticated, user } = useAuth0();
  const history = useHistory();
  const {
    userState,
    setCurrentStudent,
    currentStudent,
    actions: { setLoggedOutState },
  } = useContext(CurrentUserContext);

  return (
    <HeaderStyle>
      <HeaderTitle>
        <CompanyName>
          <FirstLetter>B</FirstLetter>ook<FirstLetter>N</FirstLetter>ook{" "}
        </CompanyName>
        <LogoImg
          src={Logo}
          alt="logodashboard
                  "
        ></LogoImg>
      </HeaderTitle>
      <QuickLinksDiv>
        {userState.userType ? (
          <>
            {userState.userType === "teacher" ? (
              <>
                <QuickLink
                  exact
                  to={`/`}
                  activeStyle={{
                    color: "indigo",
                    borderBottom: "2px solid indigo",
                  }}
                >
                  <LinkTitle>Homepage</LinkTitle>
                </QuickLink>

                <QuickLink
                  to="/teacher"
                  activeStyle={{
                    color: "indigo",
                    borderBottom: "2px solid indigo",
                  }}
                >
                  <LinkTitle>Dashboard</LinkTitle>
                </QuickLink>
                <QuickLink
                  to={`/about`}
                  activeStyle={{
                    color: "indigo",
                    borderBottom: "2px solid indigo",
                  }}
                >
                  <LinkTitle>About</LinkTitle>
                </QuickLink>
              </>
            ) : (
              <>
                <QuickLink
                  exact
                  to={`/`}
                  activeStyle={{
                    color: "indigo",
                    borderBottom: "2px solid indigo",
                  }}
                >
                  <LinkTitle>Homepage</LinkTitle>
                </QuickLink>
                <QuickLink
                  to={`/student/${userState.currentUser._id}`}
                  activeStyle={{
                    color: "indigo",
                    borderBottom: "2px solid indigo",
                  }}
                >
                  <LinkTitle>Overview</LinkTitle>
                </QuickLink>
                <QuickLink
                  to={`/library/${userState.studentLibrary}`}
                  activeStyle={{
                    color: "indigo",
                    borderBottom: "2px solid indigo",
                  }}
                >
                  <LinkTitle>Library</LinkTitle>
                </QuickLink>
                <QuickLink
                  to={`/about`}
                  activeStyle={{
                    color: "indigo",
                    borderBottom: "2px solid indigo",
                  }}
                >
                  <LinkTitle>About</LinkTitle>
                </QuickLink>
              </>
            )}
          </>
        ) : (
          <>
            <QuickLink
              exact
              to={`/`}
              activeStyle={{
                color: "indigo",
                borderBottom: "2px solid indigo",
              }}
            >
              <LinkTitle>Homepage</LinkTitle>
            </QuickLink>
            <QuickLink
              to={`/about`}
              activeStyle={{
                color: "indigo",
                borderBottom: "2px solid indigo",
              }}
            >
              <LinkTitle>About</LinkTitle>
            </QuickLink>
          </>
        )}
      </QuickLinksDiv>
      <LoginContainer>
        {isAuthenticated ? (
          <div style={{ display: "flex", alignItems: "center" }}>
            <CgProfileStyle />
            <div style={{ width: "200px" }}>
              <LogoutButton />
              <div style={{ fontSize: "15px", marginTop: "5px" }}>
                {" "}
                Signed in as: {user.name ? user.name : user.email}
              </div>
            </div>
          </div>
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
                Logout
              </StudentLogoutButton>
              <div> Hi, {userState.currentUser.givenName}!</div>
            </>
          )
        )}
      </LoginContainer>
      {isAuthenticated ? (
        <TypeTitle>Teacher's Nook</TypeTitle>
      ) : (
        userState.userType !== null &&
        currentStudent && <TypeTitle>Student's Nook</TypeTitle>
      )}
    </HeaderStyle>
  );
};

const HeaderStyle = styled.header`
  height: 100px;
  background-color: lightblue;
  position: relative;
  padding-top: 20px;
  padding-left: 30px;
  padding-right: 30px;
`;

const TypeTitle = styled.h1`
  position: absolute;
  top: 20px;
  left: 30px;
  font-size: 25px;
`;

const HeaderTitle = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0 10px;
`;

const LogoImg = styled.img`
  width: 50px;
`;

const CompanyName = styled.h1`
  text-align: center;
  font-size: 40px;
`;

const FirstLetter = styled.span`
  color: darkblue;
`;

const QuickLinksDiv = styled.div`
  position: absolute;
  bottom: 0;
  left: 5vw;
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
  font-size: 40px;
  margin-right: 20px;
`;

const StudentLogoutButton = styled.button`
  font-size: 20px;
  background-color: darkblue;
  border: none;
  color: white;
  padding: 3px 10px;
  border-radius: 3px;
  cursor: pointer;
  &:hover {
    transform: scale(1.05);
    transition: ease 100ms;
  }
  &:active {
    transform: scale(0.95);
    transition: ease 100ms;
  }
`;

export default Header;
