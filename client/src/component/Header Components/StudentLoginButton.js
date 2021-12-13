import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

const StudentLoginButton = () => {
  return (
    <Link to="/student/login">
      <LoginButtonStyle>Student Log In</LoginButtonStyle>
    </Link>
  );
};

export default StudentLoginButton;

const LoginButtonStyle = styled.button`
  height: 30px;
  font-size: 20px;
`;
