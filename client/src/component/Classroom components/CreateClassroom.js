import React, { useContext, useEffect, useReducer, useState } from "react";
import styled from "styled-components";
import { useAuth0 } from "@auth0/auth0-react";
import { useHistory } from "react-router";

import { CurrentUserContext } from "../context/CurrentUserContext";
import { Link } from "react-router-dom";
import SuccessModal from "../SuccessModal";
import Title from "../Title";

const initialState = {
  status: "idle",
  error: null,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "CLASSROOM-NAME-REQUEST":
      return {
        ...state,
        status: "loading",
        error: null,
      };
    case "CLASSROOM-NAME-SUCCESSFUL":
      return {
        ...state,
        status: "modal",
      };
    case "REQUEST-FAILURE":
      return {
        ...state,
        error: action.message,
        status: "idle",
      };
  }
};

const CreateClassroom = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [className, setClassName] = useState("");
  const [classId, setClassId] = useState("");
  const [libId, setLibId] = useState(null);
  const { user } = useAuth0();
  const history = useHistory();
  const { userState, getTeacherByEmail } = useContext(CurrentUserContext);

  const handleOnChange = (data) => {
    setClassName(data);
  };

  const handleLibraryIdSelect = (e) => {
    setLibId(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    classroomNameRequest();
  };

  const classroomNameRequest = () => {
    dispatch({ type: "CLASSROOM-NAME-REQUEST" });
    if (libId === null || className === null) {
      classroomNameFailure("Missing Information");
    } else {
      fetch("/classrooms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          teacherEmail: user.email,
          name: className,
          library_id: libId,
          classList: [],
        }),
      })
        .then((res) => res.json())
        .then((json) => {
          console.log("JSON", json);
          if (json.status === 201) {
            getTeacherByEmail();
            setClassId(json.data._id);
            classroomNameSuccess();
            return;
            // history.push(`/classroom/${json.data._id}/addclasslist`);
          } else {
            classroomNameFailure(json.errorMsg);
            return;
          }
        })
        .catch((err) => {
          console.log("error:", err);
          classroomNameFailure();
          return;
        });
    }
  };

  const classroomNameSuccess = () => {
    dispatch({ type: "CLASSROOM-NAME-SUCCESSFUL" });
  };

  const classroomNameFailure = (message) => {
    dispatch({ type: "REQUEST-FAILURE", message: message });
  };

  console.log("CLASSNAME", className, "LIBARARY", libId);
  return (
    <>
      <Title>Create-a-Classroom</Title>
      <Container>
        <>
          <p>
            Simply type a name, link a library, and click "Create Classroom" to
            create a classroom.
          </p>
          <p>
            If you haven't created a Library yet, or haven't created one for
            this classroom, <Link to="/library/create">click here</Link> to
            Create-a-Library
          </p>
          <FormStyle onSubmit={handleSubmit}>
            <InputStyle
              type="text"
              onChange={(e) => handleOnChange(e.target.value)}
              value={className}
              autoFocus
              placeholder="Name your classroom"
            ></InputStyle>
            <div>
              <SelectStyle value={libId} onChange={handleLibraryIdSelect}>
                <option value="" disabled selected>
                  Select a Library to link
                </option>
                {userState.currentUser.libraries.map((library, index) => {
                  return (
                    <option key={index} value={library._id}>
                      {library.name}
                    </option>
                  );
                })}
              </SelectStyle>
            </div>
            {state.status === "loading" ? (
              <div>loading...</div>
            ) : (
              <button type="submit">Create Classroom</button>
            )}
          </FormStyle>
        </>
        {state.error && <ErrorDiv>Error: {state.error}</ErrorDiv>}
      </Container>

      {state.status === "modal" && (
        <SuccessModal
          type="classroom"
          importedState={className}
          importedId={classId}
        />
      )}
    </>
  );
};

const Container = styled.div`
  max-width: 80vw;
  /* min-height: 70vh; */
  display: flex;
  flex-direction: column;
  flex: 3;
  margin: 20px auto;
`;

const FormStyle = styled.form`
  display: flex;
  margin: 20px 0;
`;

const SelectStyle = styled.select`
  padding: 5px 2px;
  border-left: none;
  border-right: none;
`;

const InputStyle = styled.input`
  width: 400px;
  padding-left: 5px;
`;

const ErrorDiv = styled.div`
  border: 1px solid red;
  color: red;
  width: 20vw;
  padding: 20px;
`;
export default CreateClassroom;
