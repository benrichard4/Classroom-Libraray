import React, { createContext, useContext, useEffect, useReducer } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { CurrentUserContext } from "./CurrentUserContext";

export const LibraryContext = createContext(null);

//initial state for teacher
const InitialState = {
  currentUser: null,
  status: "logged-out",
};

//reducer for multiple cases
//loading
//add book
//remove book
//checkout book
//return book

const reducer = (userState, action) => {};

const LibraryProvider = ({ children }) => {
  const { user } = useAuth0();
  const { userState } = useContext(CurrentUserContext);

  const [libraryState, dispatch] = useReducer(reducer, InitialState);

  return (
    <CurrentUserContext.Provider value={{}}>
      {children}
    </CurrentUserContext.Provider>
  );
};

export default CurrentUserProvider;
