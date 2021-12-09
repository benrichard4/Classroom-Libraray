import React, { useEffect, useReducer, useState } from "react";
import { useParams } from "react-router";
import styled from "styled-components";
import { getPaginatedSearchResults } from "../services/GoogleBooks";
import Step1Search from "./Step1Search";
import Step2Categories from "./Step2Categories";

const initialState = {
  step: 1,
  error: null,
  bookInfo: null,
  //{
  //   volumeNum: null,
  //   title: null,
  //   authors: null,
  //   description: null,
  //   thumbnail: null,
  //   language: null,
  //   publishedDate: null,
  //   publisher: null,
  //   isbn13: null,
  //   isbn10: null,
  // },
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
        categories: [...state.categories, action.categories],
      };
    case "REMOVE-CATEGORY-LINED-UP":
      let NewList = state.categories.filter((category) => {
        return category !== action.categories;
      });
      return {
        ...state,
        categories: NewList,
      };
    case "QUANTITY-LINED-UP":
      return {
        ...state,
        qtyAvailable: action.quantity,
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
        step: 1,
      };
    case "REQUEST-FAILURE":
      return {
        ...state,
        error: action.message,
        status: "idle",
      };
    case "RETURN-TO-STEP1":
      return {
        ...state,
        step: 1,
      };
    case "RETURN-TO-STEP2":
      return {
        ...state,
        step: 2,
      };
    case "RETURN-TO-STEP3":
      return {
        ...state,
        step: 3,
      };
  }
};

const LibraryAddBook = () => {
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

  const setBookLinedUp = (bookData) => {
    dispatch({ type: "BOOK-LINED-UP", data: bookData });
  };

  const setCategoriesLinedUp = (categories) => {
    dispatch({ type: "CATEGORIES-LINED-UP", categories: categories });
  };

  const removeCategoryLinedUp = (categories) => {
    dispatch({ type: "REMOVE-CATEGORY-LINED-UP", categories: categories });
  };

  const setQuantityLinedUp = (quantity) => {
    dispatch({ type: "QUANTITY-LINED-UP", quantity: quantity });
  };

  console.log("STATE:", state.categories);
  return (
    <>
      {currentLibrary && (
        <>
          <h1>{currentLibrary.name}: Add Books</h1>
          <Container>
            <FirstBox>
              {state.step === 1 && (
                <Step1Search setBookLinedUp={setBookLinedUp} />
              )}
              {console.log("STATE1:", state.categories)}
              {state.step === 2 && (
                <Step2Categories
                  setCategoriesLinedUp={setCategoriesLinedUp}
                  removeCategoryLinedUp={removeCategoryLinedUp}
                  state={state}
                />
              )}
              {/* {state.step === 3 && <Step3Quantity />}
        {state.step === 4 && <Finalize />} */}
            </FirstBox>
            <SecondBox>
              <StepDiv>
                <p>{"Step 1 (Book):"}</p>
                {state.bookInfo && (
                  <ChosenBookImg src={state.bookInfo.thumbnail}></ChosenBookImg>
                )}
              </StepDiv>
              <StepDiv>
                {"Step 2 (Categories):"}
                {state.categories.length > 0 && (
                  <ListStyle>
                    {state.categories.map((category) => {
                      return <li>{category}</li>;
                    })}
                  </ListStyle>
                )}
              </StepDiv>
              <StepDiv>{"Step 3 (Quantity Available):"}</StepDiv>
            </SecondBox>
            <ThirdBox></ThirdBox>
          </Container>
        </>
      )}
    </>
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
  flex: 2;
  border: 1px solid grey;
  border-right: none;
  padding: 10px;
  &:last-child {
    border-right: 1px solid grey;
  }
`;
const FirstBox = styled(Box)`
  flex: 3;
`;

const SecondBox = styled(Box)`
  display: flex;
  flex-direction: column;
`;

const ThirdBox = styled(Box)`
  flex: 3;
`;

const StepDiv = styled.div`
  min-height: 150px;
  display: flex;
  flex-direction: column;
`;

const ListStyle = styled.ul`
  margin-left: 20px;
  margin-top: 5px;
`;

const ChosenBookImg = styled.img`
  width: 50%;
  margin: 10px auto;
`;
export default LibraryAddBook;
