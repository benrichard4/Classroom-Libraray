import React from "react";
import styled, { keyframes } from "styled-components";
import { ImSpinner3 } from "react-icons/im";

//component for loading spinner
const LoadingSpinner = ({ size }) => {
  return (
    <SpinnerDiv size={size}>
      <ImSpinner3Style size={size} />
    </SpinnerDiv>
  );
};

const rotateSpinner = keyframes`
from{
    transform: rotate(0deg);
}
to{
    transform: rotate(360deg);
}
`;

const ImSpinner3Style = styled(ImSpinner3)`
  font-size: ${(props) => (props.size ? props.size : "30px")};
  color: ${(props) => (props.size ? "gray" : "gray")};
  animation: ${rotateSpinner} 1750ms infinite linear;
`;

const SpinnerDiv = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  margin-top: ${(props) => (props.size ? "none" : "50px")};
`;

export default LoadingSpinner;
