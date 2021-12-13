import React from "react";
import styled from "styled-components";

const ErrorMessage = ({ children }) => <Wrapper>{children}</Wrapper>;

const Wrapper = styled.div`
  display: flex;
  margin: 5px auto;
  border: 1px solid red;
  height: 50px;
  width: 97%;
  padding: 5px;
  justify-content: center;
  align-items: center;
  color: red;
  font-size: 14px;
  font-weight: bold;
`;

export default ErrorMessage;
