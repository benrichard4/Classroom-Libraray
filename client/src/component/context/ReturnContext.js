import React, { createContext, useReducer } from "react";

export const ReturnContext = createContext(null);

const initialState = {
  returnStatus: "idle",
  returnModalState: "closed",
  error: null,
  chosenClassroom: null,
  chosenStudent: null,
  chosenBook: null,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "BEGIN-RETURN":
      return {
        ...state,
        returnModalState: "open",
      };
    case "CANCEL-RETURN":
      return initialState;
    case "SET-CLASSROOM":
      return {
        ...state,
        chosenClassroom: action.classroom,
      };
    case "SET-STUDENT":
      return {
        ...state,
        chosenStudent: action.student,
      };
    case "SET-BOOK":
      return {
        ...state,
        chosenBook: action.book,
      };
    case "REQUEST-RETURN":
      return {
        ...state,
        returnStatus: "loading",
      };
    case "RETURN-SUCCESSFUL":
      return {
        ...state,
        returnStatus: "returned",
        returnModalState: "closed",
        chosenClassroom: null,
        chosenStudent: null,
        chosenBook: null,
      };
    case "RETURN-FAILED":
      return {
        ...state,
        returnStatus: "error",
        error: action.message,
      };

    case "CLEAR-SNACKBAR":
      return {
        ...state,
        returnStatus: "idle",
      };
    default:
      throw new Error(`${action.type} is not a valid action`);
  }
};

const ReturnProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const beginReturn = () => {
    dispatch({ type: "BEGIN-RETURN" });
  };

  const cancelReturn = () => {
    dispatch({ type: "CANCEL-RETURN" });
  };

  const setClassroom = (classroom) => {
    dispatch({ type: "SET-CLASSROOM", classroom });
  };

  const setStudent = (student) => {
    dispatch({ type: "SET-STUDENT", student });
  };
  const setBook = (book) => {
    dispatch({ type: "SET-BOOK", book });
  };

  const requestReturn = () => {
    dispatch({ type: "REQUEST-RETURN" });
  };

  const returnSuccessful = () => {
    dispatch({ type: "RETURN-SUCCESSFUL" });
  };

  const returnFailed = () => {
    dispatch({ type: "RETURN-FAILED" });
  };

  const clearReturnSnackbar = () => {
    dispatch({ type: "CLEAR-SNACKBAR" });
  };

  return (
    <ReturnContext.Provider
      value={{
        ...state,
        actions: {
          beginReturn,
          cancelReturn,
          setClassroom,
          setStudent,
          setBook,
          requestReturn,
          returnSuccessful,
          returnFailed,
          clearReturnSnackbar,
        },
      }}
    >
      {children}
    </ReturnContext.Provider>
  );
};

export default ReturnProvider;
