import React from "react";
import styled from "styled-components";

const Title = ({ children }) => {
  return <TitleStyle>{children}</TitleStyle>;
};

const TitleStyle = styled.h1`
  margin-left: 10vw;
  margin-top: 20px;
  font-size: 35px;
  color: darkblue;
`;

export default Title;
