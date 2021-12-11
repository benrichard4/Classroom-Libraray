import React from "react";
import styled from "styled-components";

const Title = ({ children }) => {
  return <TitleStyle>{children}</TitleStyle>;
};

const TitleStyle = styled.h1`
  margin-left: 10vw;
  margin-top: 10px;
`;

export default Title;
