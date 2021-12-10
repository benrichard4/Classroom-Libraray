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
`;
