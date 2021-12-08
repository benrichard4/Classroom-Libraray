import React from "react";
import styled from "styled-components";
import LoginButton from "./LoginButton";
import LogoutButton from "./LogoutButton";
import { useAuth0 } from "@auth0/auth0-react";
import StudentLoginButton from "./StudentLoginButton";

const Header = () => {
  const { isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return <div>Loading ...</div>;
  }

  return (
    <HeaderStyle>
      <LoginContainer>
        {isAuthenticated ? (
          <LogoutButton />
        ) : (
          <>
            <LoginButton />

            <StudentLoginButton />
          </>
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
