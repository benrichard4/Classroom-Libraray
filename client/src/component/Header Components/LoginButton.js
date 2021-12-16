import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import styled from "styled-components";

const LoginButton = () => {
  const { loginWithRedirect } = useAuth0();

  return (
    <LoginButtonStyle onClick={() => loginWithRedirect()}>
      Teacher Log In
    </LoginButtonStyle>
  );
};

export default LoginButton;

const LoginButtonStyle = styled.button`
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
