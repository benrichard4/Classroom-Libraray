import React, { useContext, useState } from "react";
import styled from "styled-components";
import { CurrentUserContext } from "../context/CurrentUserContext";
import { useHistory } from "react-router";
import ErrorMessage from "./ErrorMessage";

const StudentLoginPage = () => {
  const [username, setUsername] = useState(null);
  const [password, setPassword] = useState(null);
  const history = useHistory();

  const {
    userState,
    getLibraryFromClassroom,
    setCurrentStudent,
    actions: {
      receiveStudentDataFromServer,
      setLoadingState,
      receiveErrorFromServer,
    },
  } = useContext(CurrentUserContext);

  const handleNameChange = (data) => {
    setUsername(data);
  };

  const handlePasswordChange = (data) => {
    setPassword(data);
  };

  const handleClick = () => {
    setLoadingState();
    fetch("/students/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ username, password }),
    })
      .then((res) => res.json())
      .then((studentData) => {
        if (studentData.status === 200) {
          receiveStudentDataFromServer(studentData.data);
          setCurrentStudent(studentData.data._id);
          getLibraryFromClassroom(studentData.data.classroomId);
          history.push(`/student/${studentData.data._id}`);
        } else {
          console.log("in fetch error", studentData.errorMsg);
          receiveErrorFromServer(studentData.errorMsg);
          return;
        }
      })
      .catch((e) => {
        console.log("ERROR", e);
        return;
      });
  };

  //   If the enter key is pressed in the input box, then the handleClick function is called
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleClick();
      return;
    }
  };

  return (
    <Content>
      <SignInContainer>
        <NameInput
          type="text"
          placeholder="Username"
          onChange={(e) => handleNameChange(e.target.value)}
          value={username}
          autoFocus
        ></NameInput>
        <PasswordInput
          type="password"
          placeholder="Password"
          onChange={(e) => handlePasswordChange(e.target.value)}
          value={password}
          onKeyDown={handleKeyDown}
          autoFocus
        ></PasswordInput>
        <Button onClick={(e) => handleClick(e)}>Submit</Button>
        {userState.error && <ErrorMessage>{userState.error}</ErrorMessage>}
      </SignInContainer>
    </Content>
  );
};

const Content = styled.div`
  /* background-image: url("../images/PaintingOffice.jpg"); */
  /* border: 1px solid black; */
  height: calc(100vh - 120px);
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  position: relative;
  /* margin-top: 50vh; */
`;

const SignInContainer = styled.div`
  position: absolute;
  top: 30%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: lightblue; //rgb(255, 255, 255, 70%);
  padding: 30px;
  display: flex;
  flex-direction: column;
  width: 305px;
  box-shadow: 0 0 10px 5px silver;
`;

const NameInput = styled.input`
  border-radius: none;
  border: none;
  padding: 5px;
  margin: 2px;
  font-size: 17px;
  width: 230px;
  outline: none;

  &:focus {
    outline: 1px solid var(--accent-bg-color);
  }
`;

const PasswordInput = styled.input`
  border-radius: none;
  border: none;
  padding: 5px;
  margin: 2px;
  font-size: 17px;
  width: 230px;
  outline: none;

  &:focus {
    outline: 1px solid var(--accent-bg-color);
  }
`;

const Button = styled.button`
  background-color: darkblue;
  border: none;
  padding: 5px;
  font-size: 17px;
  font-weight: bold;
  font-family: "Cambria", sans-serif;
  color: white;
  margin: 2px;
  width: 230px;

  &:hover {
    cursor: pointer;
    color: white;
  }
  &:active {
    transform: scale(0.9);
  }
`;
export default StudentLoginPage;
