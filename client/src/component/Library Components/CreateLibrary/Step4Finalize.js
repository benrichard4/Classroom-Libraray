import React from "react";
import styled from "styled-components";

//showing final message to push button
const Step4Finalize = ({ state }) => {
  return (
    state.step !== 1 && (
      <Suggestion>{"*click 'ADD BOOK TO LIBRARY' Button -->*"}</Suggestion>
    )
  );
};

const Suggestion = styled.div`
  margin-top: 56vh;
  margin-left: 50px;
`;
export default Step4Finalize;
