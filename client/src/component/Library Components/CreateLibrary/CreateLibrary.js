import React, { useContext, useEffect, useReducer, useState } from "react";
import styled from "styled-components";
import { useAuth0 } from "@auth0/auth0-react";
import { useHistory } from "react-router";
import { getPaginatedSearchResults } from "../../../services/GoogleBooks";
import Step1Search from "./Step1Search";
import { CurrentUserContext } from "../../context/CurrentUserContext";
import SuccessModal from "../../SuccessModal";

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

const CreateLibrary = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [libName, setLibName] = useState("");
  const [libId, setLibId] = useState("");
  const { user } = useAuth0();
  const history = useHistory();
  const { getTeacherByEmail } = useContext(CurrentUserContext);

  const handleOnChange = (data) => {
    setLibName(data);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    libraryNameRequest();
  };

  const libraryNameRequest = () => {
    dispatch({ type: "LIBRARY-NAME-REQUEST" });
    if (libName === "") {
      libraryNameFailure("Missing Information");
    } else {
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
          if (json.status === 201) {
            libraryNameSuccess();
            getTeacherByEmail();
            setLibId(json.data._id);
          } else {
            libraryNameFailure(json.errorMsg);
            return;
          }
        })
        .catch((err) => {
          console.log("error:", err);
          libraryNameFailure();
          return;
        });
    }
  };

  const libraryNameSuccess = () => {
    dispatch({ type: "LIBRARY-NAME-SUCCESSFUL" });
  };

  const libraryNameFailure = (message) => {
    dispatch({ type: "REQUEST-FAILURE", message: message });
  };

  return (
    <>
      <Title>Create-a-library</Title>
      <Container>
        <>
          <p>
            Simply type a name and click "Create Library" to create a library
          </p>
          <FormStyle onSubmit={handleSubmit}>
            <input
              type="text"
              onChange={(e) => handleOnChange(e.target.value)}
              value={libName}
              placeholder="Type Library Name..."
            ></input>
            {state.status === "loading" ? (
              <div>loading...</div>
            ) : (
              <button type="submit">Create Library</button>
            )}
          </FormStyle>
        </>
        {state.error && <ErrorDiv>Error: {state.error}</ErrorDiv>}
      </Container>
      {state.status === "modal" && (
        <SuccessModal
          type="library"
          importedState={libName}
          importedId={libId}
        />
      )}
    </>
  );
};

const Title = styled.h1`
  margin-left: 10vw;
  margin-top: 10px;
`;

const FormStyle = styled.form`
  display: flex;
  margin: 20px 0;
`;

const Container = styled.div`
  max-width: 80vw;
  /* min-height: 70vh; */
  display: flex;
  flex-direction: column;
  flex: 3;
  margin: 20px auto;
`;

const ErrorDiv = styled.div`
  border: 1px solid red;
  color: red;
  width: 20vw;
  padding: 20px;
`;

export default CreateLibrary;
