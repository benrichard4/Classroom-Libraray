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
