import React, { useContext, useReducer, useState } from "react";
import styled from "styled-components";
import { useAuth0 } from "@auth0/auth0-react";

import { CurrentUserContext } from "../../context/CurrentUserContext";
import SuccessModal from "../../SuccessModal";
import Title from "../../Title";
import LoadingSpinner from "../../LoadingSpinner";

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
    default:
      throw new Error(`${action.type} is not an action`);
  }
};

const CreateLibrary = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [libName, setLibName] = useState("");
  const [libId, setLibId] = useState("");
  const { user } = useAuth0();
  const { getTeacherByEmail } = useContext(CurrentUserContext);

  //when input is typed in, set state libName
  const handleOnChange = (data) => {
    setLibName(data);
  };

  //when the create library button is clicked, run the function libraryNameRequest
  const handleSubmit = (e) => {
    e.preventDefault();
    libraryNameRequest();
  };

  //funciton the runs a POST to create a new library
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

  //function that runs the dispatch if the POST is successfull
  const libraryNameSuccess = () => {
    dispatch({ type: "LIBRARY-NAME-SUCCESSFUL" });
  };

  //function that runs the dispatch if the POST failed
  const libraryNameFailure = (message) => {
    dispatch({ type: "REQUEST-FAILURE", message: message });
  };

  return (
    <OuterContainer>
      <Title>Create a library</Title>
      <Container>
        <>
          <p>
            Simply type a name and click "Create Library" to create a library
          </p>
          <FormStyle onSubmit={handleSubmit}>
            {state.status === "loading" ? (
              <LoadingSpinner style={{ marginTop: "50px" }} />
            ) : (
              <>
                <InputStyle
                  type="text"
                  onChange={(e) => handleOnChange(e.target.value)}
                  value={libName}
                  placeholder="Type Library Name..."
                  autoFocus
                ></InputStyle>

                <Button type="submit">Create Library</Button>
              </>
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
    </OuterContainer>
  );
};

const OuterContainer = styled.div`
  min-height: calc(100vh - 180px);
`;

const FormStyle = styled.form`
  display: flex;
  margin: 20px 0;
`;

const Container = styled.div`
  max-width: 80vw;
  display: flex;
  flex-direction: column;
  flex: 3;
  margin: 20px auto;
`;

const InputStyle = styled.input`
  padding: 5px;
  width: 400px;
`;

const Button = styled.button`
  font-size: 18px;
  background-color: darkblue;
  border: none;
  color: white;
  padding: 3px 10px;
  border-radius: 3px;
  margin: 0 10px;
  cursor: pointer;
  &:hover {
    transform: scale(1.03);
    transition: ease 100ms;
  }
  &:active {
    transform: scale(0.95);
    transition: ease 100ms;
  }
`;

const ErrorDiv = styled.div`
  border: 1px solid red;
  color: red;
  width: 20vw;
  padding: 20px;
`;

export default CreateLibrary;
