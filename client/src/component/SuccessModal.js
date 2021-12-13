import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import Modal from "./Modal";

const SuccessModal = ({ type, importedState, importedId }) => {
  const [state, setState] = useState(null);
  useEffect(() => {
    if (type === "library") {
      const libState = {
        label: "Successful Library Creation",
        title: "Successful Creation",
        description: `You have successfully created the library "${importedState}"!`,
        backButton: "Return to Dashboard",
        continueButton: "Add Books to Library",
        link: `/library/${importedId}/addbook`,
      };
      setState(libState);
    } else if (type === "classroom") {
      const classState = {
        label: "Successful Classroom Creation",
        title: "Successful Creation",
        description: `You have successfully created the classroom "${importedState}"!`,
        backButton: "Return to Dashboard",
        continueButton: "Add a classlist to classroom",
        link: `/classroom/${importedId}/addclasslist`,
      };
      setState(classState);
    }
  }, [importedId]);

  const handleButtonClick = () => {
    setState(null);
  };
  return (
    state && (
      <Modal
        isOpen={!!state}
        // onClose={handleButtonClick}
        aria-label={state.label}
        style={{ padding: "2rem 2rem 0" }}
      >
        <Title>{state.title}</Title>
        <p>{state.description}</p>
        <ButtonPlacement>
          <Button to="/teacher" onClick={handleButtonClick}>
            {state.backButton}
          </Button>
          <Button to={state.link} onClick={handleButtonClick}>
            {state.continueButton}
          </Button>
        </ButtonPlacement>
      </Modal>
    )
  );
};

const Title = styled.h1`
  margin-bottom: 16px;
`;

const ButtonPlacement = styled.div`
  display: flex;
  /* flex-direction: column; */
  justify-content: center;
  align-items: center;
`;

const Button = styled(Link)`
  border: none;
  background-color: darkblue;
  color: white;
  width: 150px;
  height: 50px;
  margin: 30px 10px;
  text-decoration: none;
  text-align: center;
  border-radius: 10px;
  padding: 6px 20px;
`;

export default SuccessModal;
