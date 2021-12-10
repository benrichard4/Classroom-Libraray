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
`;
