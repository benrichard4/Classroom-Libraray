import React, { createContext, useEffect, useReducer } from "react";
import { useAuth0 } from "@auth0/auth0-react";

export const CurrentUserContext = createContext(null);

//initial state for teacher
const teacherInitialState = {
  currentUser: null,
  status: "logged-out",
};

//reducer for multiple cases
const reducer = (userState, action) => {
  switch (action.type) {
    case "LOGGED-OUT":
      return teacherInitialState;
    case "LOADING":
      return {
        ...userState,
        status: "loading",
      };
    case "DATA-RECEIVED":
      return {
        ...userState,
        currentUser: action.data,
        status: "idle",
      };
    case "ERROR":
      return {
        ...userState,
        status: "error",
      };

    default:
      throw new Error(`Error, ${action.type} is not an action`);
  }
};

const CurrentUserProvider = ({ children }) => {
  const { user } = useAuth0();
  const [userState, dispatch] = useReducer(reducer, teacherInitialState);

  //check to see if user exists in teacher collection in db
  //if it does, get user
  //if it doesn't create user and set info
  useEffect(() => {
    if (user) {
      setLoadingState();
      getTeacherByEmail();
    } else {
      setLoggedOutState();
    }
  }, [user]);

  const getTeacherByEmail = () => {
    fetch(`/teachers/${user.email}`)
      .then((res) => res.json())
      .then((teacherData) => {
        const { status, data, message, errorMsg } = teacherData;
        if (status === 201) {
          receiveCurrentUserDataFromServer(data);
        } else {
          createTeacherProfile(user.email, user.given_name, user.family_name);
        }
      })
      .catch((err) => {
        console.log("error:", err);
        receiveErrorFromServer();
        return;
      });
  };
  //function that creates a teacher document in teachers collection
  const createTeacherProfile = (email, givenName, surname) => {
    fetch(`/teachers`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        email,
        givenName,
        surname,
        libraries: [],
        classrooms: [],
        categories: ["Std_categories_booknook"],
      }),
    })
      .then((res) => res.json())
      .then((teacherData) => {
        const { status, data, message, errorMsg } = teacherData;
        if (status === 201) {
          receiveCurrentUserDataFromServer(data);
        } else {
          createTeacherProfile(user.email, user.given_name, user.family_name);
        }
      })
      .catch((err) => {
        console.log("error:", err);
        receiveErrorFromServer();
        return;
      });
  };

  //function to change status to LOGGED-OUT in dispatch
  const setLoggedOutState = () => {
    dispatch({ type: "LOGGED-OUT" });
  };

  //function to change status to LOADING in dispatch
  const setLoadingState = () => {
    dispatch({ type: "LOADING" });
  };

  //function to change status to DATA-RECEIVE in dispatch
  const receiveCurrentUserDataFromServer = (data) => {
    dispatch({ type: "DATA-RECEIVED", data });
  };

  //function to change status to ERROR in dispatch
  const receiveErrorFromServer = () => {
    dispatch({ ...userState, type: "ERROR" });
  };

  return (
    <CurrentUserContext.Provider
      value={{
        userState,
        getTeacherByEmail,
        actions: {
          setLoggedOutState,
          setLoadingState,
          receiveCurrentUserDataFromServer,
          receiveErrorFromServer,
        },
      }}
    >
      {children}
    </CurrentUserContext.Provider>
  );
};

export default CurrentUserProvider;
