import React, { useEffect, useReducer, useState } from "react";
import { useParams } from "react-router";
import styled from "styled-components";
import { getPaginatedSearchResults } from "../services/GoogleBooks";
import Step1Search from "./Step1Search";

const initialState = {
  step: 1,
  libraryName: null,
  error: null,
  bookInfo: {
    volumeNum: null,
    // title: null,
    // authors: null,
    // description: null,
    // thumbnail: null,
    // language: null,
    // publishedDate: null,
    // publisher: null,
    // isbn13: null,
    // isbn10: null,
  },
  categories: [],
  qtyAvailable: null,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "INITIAL-STATE":
      return initialState;
    case "LOADING":
      return {
        ...state,
        status: "loading",
      };
    case "BOOK-LINED-UP":
      return {
        ...state,
        bookInfo: action.data,
        step: state.step + 1,
      };
    case "CATEGORIES-LINED-UP":
      return {
        ...state,
        categories: action.categories,
        step: state.step + 1,
      };
    case "QUANTITIES-LINED-UP":
      return {
        ...state,
        qtyAvailable: action.qty,
        step: state.step + 1,
      };
    case "ADD-BOOK-REQUEST":
      return {
        ...state,
        status: "loading",
        error: null,
      };
    case "BOOK-REQUEST-SUCCESSFUL":
      return {
        ...initialState,
        step: 2,
      };
    case "REQUEST-FAILURE":
      return {
        ...state,
        error: action.message,
        status: "idle",
      };
  }
};

const ModifyLibrary = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [currentLibrary, setCurrentLibrary] = useState(null);
  const { _id } = useParams();

  useEffect(() => {
    fetch(`/libraries/${_id}`)
      .then((res) => res.json())
      .then((LibraryData) => {
        console.log(LibraryData);
        setCurrentLibrary(LibraryData.data);
      });
  }, []);

  return (
    currentLibrary && (
      <>
        <h1>Modify library:{currentLibrary.name}</h1>
        <Container>
          <FirstBox>
            {state.step === 1 && <Step1Search />}
            {/* {state.step === 2 && <Step2Categories />}
        {state.step === 3 && <Step3Quantity />}
        {state.step === 4 && <Finalize />} */}
          </FirstBox>
          <SecondBox></SecondBox>
          <ThirdBox></ThirdBox>
        </Container>
      </>
    )
  );
};

const Container = styled.div`
  max-width: 80vw;
  min-height: 70vh;
  display: flex;
  flex: 3;
  margin: 20px auto;
`;

const Box = styled.div`
  flex: 1;
  border: 2px solid grey;
  border-right: none;
  &:last-child {
    border-right: 2px solid grey;
  }
`;
const FirstBox = styled(Box)``;

const SecondBox = styled(Box)``;

const ThirdBox = styled(Box)``;

export default ModifyLibrary;
