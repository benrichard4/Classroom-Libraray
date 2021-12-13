import React, { useContext, useEffect, useReducer, useState } from "react";
import { useParams } from "react-router";
import styled from "styled-components";
import LoadingSpinner from "../LoadingSpinner";
import Title from "../Title";
import ClassListSummary from "./ClassListSummary";

const initialState = {
  status: "idle",
  classList: null,
  error: null,
};

const reducer = (classState, action) => {
  switch (action.type) {
    case "ADD-NAMES-REQUEST":
      return {
        ...classState,
        status: "loading",
        error: null,
      };
    case "ADD-NAMES-SUCCESSFUL":
      return {
        ...classState,
        classList: action.classListData,
        status: "idle",
      };
    case "REQUEST-FAILURE":
      return {
        ...classState,
        error: action.message,
        status: "idle",
      };
  }
};

//component that is for adding a class list to a classroom
const ClassroomAddClassList = () => {
  const [classState, dispatch] = useReducer(reducer, initialState);
  const [currentClassroom, setCurrentClassroom] = useState(null);
  const [tempClassList, setTempClassList] = useState(null);
  const [classSize, setClassSize] = useState(15);
  const { _id } = useParams();

  useEffect(() => {
    getCurrentClassroom();
    getClassList();
  }, []);

  //when class size changes, run the setTempClassListFunction
  useEffect(() => {
    setTempClassListFunction();
  }, [classSize]);

  //creates a class list array with object with empty values, ready to be set
  const setTempClassListFunction = () => {
    let arraySet = [];
    for (let i = 1; i <= classSize; i++) {
      arraySet.push({ givenName: "", surname: "" });
    }
    setTempClassList(arraySet);
  };

  //fetch current classroom
  const getCurrentClassroom = async () => {
    await fetch(`/classrooms/${_id}`)
      .then((res) => res.json())
      .then((ClassroomData) => {
        setCurrentClassroom(ClassroomData.data);
      });
  };

  //adds a first or last name to TempClassList state when a name is typed in the input filed
  const handleOnChange = (index, nameType, e) => {
    let tempArray = [...tempClassList];
    tempArray[index][nameType] = e.target.value;
    setTempClassList(tempArray);
  };

  //when names are submitted to be added to the classlist, the reducer function add student request is called as well as setTempClassListFunction to put the values back to ""
  const handleSubmit = (e) => {
    e.preventDefault();
    addStudentRequest();
    setTempClassListFunction();
  };

  //function that posts the students to the student list
  const addStudentRequest = () => {
    let removedBlanksClassList = tempClassList.filter((student) => {
      return student.givenName !== "";
    });

    dispatch({ type: "ADD-NAMES-REQUEST" });
    fetch(`/students/${_id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify([...removedBlanksClassList]),
    })
      .then((res) => res.json())
      .then((json) => {
        if (json.status === 201) {
          getClassList();
        } else {
          addNamesFailure(json.errorMsg);
          return;
        }
      })
      .catch((err) => {
        addNamesFailure("Something went wrong");
        return;
      });
  };

  //if the post is successful, get a fresh class list to display
  const getClassList = () => {
    fetch(`/students/classroom/${_id}`)
      .then((res) => res.json())
      .then((classListData) => {
        addNamesSuccess(classListData.data);
      });
  };

  //reducer function for adding names success
  const addNamesSuccess = (classListData) => {
    dispatch({ type: "ADD-NAMES-SUCCESSFUL", classListData: classListData });
  };

  //reducer function for adding names failure
  const addNamesFailure = (message) => {
    dispatch({ type: "REQUEST-FAILURE", message: message });
  };

  return currentClassroom === null ? (
    <LoadingSpinner style={{ marginTop: "50px" }} />
  ) : (
    <>
      <Title>{currentClassroom.name}: Add a Classlist</Title>
      <Container>
        <Form onSubmit={handleSubmit}>
          <LeftSideContainer>
            {tempClassList.map((student, index) => {
              return (
                <AddNameContainer key={index}>
                  <StudentNum>Student #{index + 1}:</StudentNum>
                  <Input
                    type="text"
                    placeholder="First Name"
                    onChange={(e) => {
                      handleOnChange(index, "givenName", e);
                    }}
                    value={student.givenName}
                  ></Input>
                  <Input
                    type="text"
                    placeholder="Last Name"
                    onChange={(e) => {
                      handleOnChange(index, "surname", e);
                    }}
                    value={student.surname}
                  ></Input>
                </AddNameContainer>
              );
            })}
            <AddNameContainer>
              <AddRemoveStudentButton
                onClick={() => {
                  setClassSize(classSize - 1);
                }}
              >
                -
              </AddRemoveStudentButton>
              Add Students
              <AddRemoveStudentButton
                onClick={() => {
                  setClassSize(classSize + 1);
                }}
              >
                {" "}
                +
              </AddRemoveStudentButton>
            </AddNameContainer>
          </LeftSideContainer>
          <CenterContainer>
            <PostStudentsButton type="submit">{">>"}</PostStudentsButton>
          </CenterContainer>
        </Form>
        <RightSideContainer>
          <SummaryTitle>Summary</SummaryTitle>
          <ClassListSummary classState={classState} />
        </RightSideContainer>
      </Container>
    </>
  );
};

const Container = styled.div`
  border: 1px solid silver;
  display: flex;
  width: 80vw;
  margin: 10px auto;
  min-height: 70vh;
`;

const Form = styled.form`
  display: flex;
  flex: 1;
`;

const LeftSideContainer = styled.div`
  flex: 1;
`;
const AddNameContainer = styled.div`
  display: flex;
  align-items: center;

  border-bottom: 1px solid silver;
  border-right: 1px solid silver;
  flex: 8;
  &:last-child {
    border-bottom: none;
  }
`;

const StudentNum = styled.p`
  width: 100px;
  text-align: center;
  font-weight: bold;
`;

const Input = styled.input`
  margin-left: 10px;
  padding: 2px;
  &:last-child {
    margin: 10px 10px;
  }
`;

const AddRemoveStudentButton = styled.button`
  margin: 5px auto;
  padding: 5px 10px;
`;

const CenterContainer = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 5px;
`;

const PostStudentsButton = styled.button`
  padding: 10px;
`;

const RightSideContainer = styled.div`
  flex: 2;
  border-left: 1px solid silver;
  display: flex;
  flex-direction: column;
`;

const SummaryTitle = styled.h2`
  margin: 10px;
`;

export default ClassroomAddClassList;
