import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import styled from "styled-components";

const LogoutButton = () => {
  const { logout } = useAuth0();

  return (
    <LogoutButtonStyle
      onClick={() => logout({ returnTo: window.location.origin })}
    >
      Log Out
    </LogoutButtonStyle>
  );
};

export default LogoutButton;

const LogoutButtonStyle = styled.button`
  font-size: 20px;
  background-color: darkblue;
  border: none;
  color: white;
  padding: 3px 10px;
  border-radius: 3px;
  width: 100%;
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
