import React from "react";
import styled from "styled-components";

const StudentLoginButton = () => {
  return <LoginButtonStyle>Student Log In</LoginButtonStyle>;
};

export default StudentLoginButton;

const LoginButtonStyle = styled.button`
  height: 30px;
  font-size: 20px;
`;
