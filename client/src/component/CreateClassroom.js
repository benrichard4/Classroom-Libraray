import React, { useContext, useEffect, useReducer, useState } from "react";
import styled from "styled-components";
import { useAuth0 } from "@auth0/auth0-react";
import { useHistory } from "react-router";

import { CurrentUserContext } from "./context/CurrentUserContext";
import { Link } from "react-router-dom";

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
      return initialState;
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
  const [libId, setLibId] = useState(null);
  const { user } = useAuth0();
  const history = useHistory();
  const { getTeacherByEmail } = useContext(CurrentUserContext);

  const handleOnChange = (data) => {
    setClassName(data);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    classroomNameRequest();
  };

  const classroomNameRequest = () => {
    dispatch({ type: "CLASSROOM-NAME-REQUEST" });
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
        classroomNameSuccess();
        getTeacherByEmail();
        history.push(`/library/${json.data._id}/addstudents`);
      })
      .catch((err) => {
        console.log("error:", err);
        classroomNameFailure();
        return;
      });
  };

  const classroomNameSuccess = () => {
    dispatch({ type: "LIBRARY-NAME-SUCCESSFUL" });
  };

  const classroomNameFailure = () => {
    dispatch({ type: "REQUEST-FAILURE" });
  };

  return (
    <>
      <h1>Create-a-Classroom</h1>
      <Container>
        <>
          <p>
            Simply type a name, link a library, and click "Create Classroom" to
            create a classroom.
          </p>
          <p>
            If you haven't created a Library yet,{" "}
            <Link to="/library/create">click here </Link>
          </p>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              onChange={(e) => handleOnChange(e.target.value)}
              value={className}
            ></input>
            {state.status === "loading" ? (
              <div>loading...</div>
            ) : (
              <button type="submit">Create Classroom</button>
            )}
          </form>
        </>
      </Container>
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

export default CreateClassroom;
