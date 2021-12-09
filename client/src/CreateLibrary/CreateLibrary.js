import React, { useEffect, useReducer, useState } from "react";
import styled from "styled-components";
import { useAuth0 } from "@auth0/auth0-react";
import { useHistory } from "react-router";
import { getPaginatedSearchResults } from "../services/GoogleBooks";
import Step1Search from "./Step1Search";

const initialState = {
  status: "idle",
  error: null,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "LIBRARY-NAME-REQUEST":
      return {
        ...state,
        status: "loading",
        error: null,
      };
    case "LIBRARY-NAME-SUCCESSFUL":
      return initialState;
    case "REQUEST-FAILURE":
      return {
        ...state,
        error: action.message,
        status: "idle",
      };
  }
};

const CreateLibrary = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [libName, setLibName] = useState("");
  const { user } = useAuth0();
  const history = useHistory();

  const handleOnChange = (data) => {
    setLibName(data);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    libraryNameRequest();
  };

  const libraryNameRequest = () => {
    dispatch({ type: "LIBRARY-NAME-REQUEST" });
    fetch("/libraries", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        teacherEmail: user.email,
        name: libName,
        library: [],
      }),
    })
      .then((res) => res.json())
      .then((json) => {
        console.log("JSON", json);
        libraryNameSuccess();
        history.push(`/modifylibrary/${json.data._id}`);
      })
      .catch((err) => {
        console.log("error:", err);
        libraryNameFailure();
        return;
      });
  };

  const libraryNameSuccess = () => {
    dispatch({ type: "LIBRARY-NAME-SUCCESSFUL" });
  };

  const libraryNameFailure = () => {
    dispatch({ type: "REQUEST-FAILURE" });
  };

  return (
    <>
      <h1>Create-a-library</h1>
      <Container>
        <>
          <p>
            Simply type a name and click "Create Library" to create a library
          </p>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              onChange={(e) => handleOnChange(e.target.value)}
              value={libName}
            ></input>
            {state.status === "loading" ? (
              <div>loading...</div>
            ) : (
              <button type="submit">Create Library</button>
            )}
          </form>
        </>
      </Container>
    </>
  );
};

export default CreateLibrary;

const Container = styled.div`
  max-width: 80vw;
  /* min-height: 70vh; */
  display: flex;
  flex: 3;
  margin: 20px auto;
`;
