import React, { createContext, useReducer } from "react";

export const CheckoutContext = createContext(null);

const initialState = {
  checkoutStatus: "idle",
  checkoutModalState: "closed",
  error: null,
  chosenClassroom: null,
  chosenStudent: null,
  chosenBook: null,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "BEGIN-CHECKOUT":
      return {
        ...state,
        checkoutModalState: "open",
      };
    case "CANCEL-CHECKOUT":
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
    case "REQUEST-CHECKOUT":
      return {
        ...state,
        checkoutStatus: "loading",
      };
    case "CHECKOUT-SUCCESSFUL":
      return {
        ...state,
        checkoutStatus: "checkedout",
        checkoutModalState: "closed",
      };
    case "CHECKOUT-FAILED":
      return {
        ...state,
        checkoutStatus: "error",
        error: action.message,
      };

    case "CLEAR-SNACKBAR":
      return {
        ...state,
        checkoutStatus: "idle",
      };
    default:
      throw new Error(`${action.type} is not a valid action`);
  }
};

const CheckoutProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const beginCheckout = () => {
    dispatch({ type: "BEGIN-CHECKOUT" });
  };

  const cancelCheckout = () => {
    dispatch({ type: "CANCEL-CHECKOUT" });
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

  const requestCheckout = () => {
    dispatch({ type: "REQUEST-CHECKOUT" });
  };

  const checkoutSuccessful = () => {
    dispatch({ type: "CHECKOUT-SUCCESSFUL" });
  };

  const checkoutFailed = () => {
    dispatch({ type: "CHECKOUT-FAILED" });
  };

  const clearCheckoutSnackbar = () => {
    dispatch({ type: "CLEAR-SNACKBAR" });
  };

  return (
    <CheckoutContext.Provider
      value={{
        ...state,
        actions: {
          beginCheckout,
          cancelCheckout,
          setClassroom,
          setStudent,
          setBook,
          requestCheckout,
          checkoutSuccessful,
          checkoutFailed,
          clearCheckoutSnackbar,
        },
      }}
    >
      {children}
    </CheckoutContext.Provider>
  );
};

export default CheckoutProvider;
