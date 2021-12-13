import React, { useEffect, useReducer, useState } from "react";
import { useParams } from "react-router";
import styled from "styled-components";
import LoadingSpinner from "../../LoadingSpinner";
import Step1Search from "./Step1Search";
import Step2Categories from "./Step2Categories";
import Step3Quantity from "./Step3Quantity";
import Step4Finalize from "./Step4Finalize";

const initialState = {
  step: 1,
  status: "idle",
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
  bookComplete: false,
  categoriesComplete: false,
  quantityComplete: false,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "BOOK-LINED-UP":
      return {
        ...state,
        bookInfo: action.data,
        step: state.step + 1,
        bookComplete: true,
        categoriesComplete: false,
        quantityComplete: false,
      };
    case "ADD-CATEGORY":
      return {
        ...state,
        categories: [...state.categories, action.category],
        categoriesComplete: false,
      };
    case "REMOVE-CATEGORY":
      let NewList = state.categories.filter((category) => {
        return category !== action.category;
      });
      return {
        ...state,
        categories: NewList,
        categoriesComplete: false,
      };
    case "CATEGORIES-LINED-UP":
      return {
        ...state,
        step: state.step + 1,
        categoriesComplete: true,
      };
    case "QUANTITY-LINED-UP":
      return {
        ...state,
        qtyAvailable: action.quantity,
        step: state.step + 1,
        quantityComplete: true,
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
        status: "idle",
      };
    case "REQUEST-FAILURE":
      return {
        ...state,
        error: action.message,
        status: "idle",
        bookComplete: false,
        categoriesComplete: false,
        quantityComplete: false,
        step: 1,
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
        categoriesComplete: false,
      };
    case "RETURN-TO-STEP3":
      return {
        ...state,
        step: 3,
        quantityComplete: false,
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
        setCurrentLibrary(LibraryData.data);
      });
  }, []);

  const updateLibrary = () => {
    fetch(`/libraries/${_id}`)
      .then((res) => res.json())
      .then((LibraryData) => {
        setCurrentLibrary(LibraryData.data);
      });
  };
  const setBookLinedUp = (bookData) => {
    dispatch({ type: "BOOK-LINED-UP", data: bookData });
  };

  const setAddCategory = (category) => {
    dispatch({ type: "ADD-CATEGORY", category: category });
  };

  const setRemoveCategory = (category) => {
    dispatch({ type: "REMOVE-CATEGORY", category: category });
  };

  const setCategoriesLinedUp = () => {
    dispatch({ type: "CATEGORIES-LINED-UP" });
  };

  const setQuantityLinedUp = (quantity) => {
    dispatch({ type: "QUANTITY-LINED-UP", quantity: quantity });
  };

  const setReturnToStep1 = () => {
    dispatch({ type: "RETURN-TO-STEP1" });
  };

  const setReturnToStep2 = () => {
    dispatch({ type: "RETURN-TO-STEP2" });
  };

  const setReturnToStep3 = () => {
    dispatch({ type: "RETURN-TO-STEP3" });
  };

  const setAddBookRequest = () => {
    dispatch({ type: "ADD-BOOK-REQUEST" });
  };

  const setBookReqestSuccessful = () => {
    dispatch({ type: "BOOK-REQUEST-SUCCESSFUL" });
  };

  const setRequestFailure = (message) => {
    dispatch({ type: "REQUEST-FAILURE", message: message });
  };

  const handleRemoveBook = (volumeNum) => {
    setAddBookRequest();
    fetch(`/libraries/${currentLibrary._id}/removeBook`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        volumeNum,
      }),
    })
      .then((res) => res.json())
      .then((json) => {
        if (json.status === 200) {
          setBookReqestSuccessful();
          updateLibrary();
        } else {
          setRequestFailure(json.errorMsg);
        }
      })
      .catch((err) => {
        console.error(err);
        setRequestFailure("An unknown error has occurred");
      });
  };

  return (
    <>
      {currentLibrary && (
        <>
          <Title>{currentLibrary.name}: Add/Remove Books</Title>
          <Container>
            <FirstBox>
              {state.step === 1 && (
                <Step1Search setBookLinedUp={setBookLinedUp} />
              )}
              {state.step === 2 && state.categoriesComplete === false && (
                <Step2Categories
                  setAddCategory={setAddCategory}
                  setRemoveCategory={setRemoveCategory}
                  setCategoriesLinedUp={setCategoriesLinedUp}
                  state={state}
                />
              )}
              {state.step === 3 && state.quantityComplete === false && (
                <Step3Quantity
                  setQuantityLinedUp={setQuantityLinedUp}
                  stateQty={state.qtyAvailable}
                />
              )}
              {state.bookComplete &&
                state.categoriesComplete &&
                state.quantityComplete && (
                  <Step4Finalize
                    setAddBookRequest={setAddBookRequest}
                    setBookReqestSuccessful={setBookReqestSuccessful}
                    setRequestFailure={setRequestFailure}
                    state={state}
                  />
                )}
            </FirstBox>
            <SecondBox>
              <StepDiv complete={state.bookComplete} onClick={setReturnToStep1}>
                <p>{"Step 1 (Book):"}</p>
                {state.bookInfo && (
                  <ChosenBookImg src={state.bookInfo.thumbnail}></ChosenBookImg>
                )}
              </StepDiv>
              <StepDiv
                complete={state.categoriesComplete}
                onClick={setReturnToStep2}
              >
                {"Step 2 (Categories):"}
                {state.categories.length > 0 && (
                  <ListStyle>
                    {state.categories.map((category) => {
                      return <ListItem>{category}</ListItem>;
                    })}
                  </ListStyle>
                )}
              </StepDiv>
              <StepDiv
                complete={state.quantityComplete}
                onClick={setReturnToStep3}
              >
                {"Step 3 (Quantity Available):"}
                {state.qtyAvailable && <p>{state.qtyAvailable}</p>}
              </StepDiv>
              <p>To revise a step: click on a step above</p>
              <BigButton
                buttonActive={
                  state.bookComplete &&
                  state.categoriesComplete &&
                  state.quantityComplete
                }
                disabled={
                  !state.bookComplete &&
                  !state.categoriesComplete &&
                  !state.quantityComplete
                }
                onClick={(ev) => {
                  setAddBookRequest();

                  fetch(`/libraries/${currentLibrary._id}/addBook`, {
                    method: "PUT",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                      volumeNum: state.bookInfo.volumeNum,
                      title: state.bookInfo.title,
                      authors: state.bookInfo.authors,
                      description: state.bookInfo.description,
                      thumbnail: state.bookInfo.thumbnail,
                      language: state.bookInfo.language,
                      publishedDate: state.bookInfo.publishedDate,
                      publisher: state.bookInfo.publisher,
                      isbn13: state.bookInfo.isbn13,
                      isbn10: state.bookInfo.isbn10,
                      categories: state.categories,
                      waitingList: [],
                      qtyAvailable: state.qtyAvailable,
                    }),
                  })
                    .then((res) => res.json())
                    .then((json) => {
                      if (json.status === 201) {
                        setBookReqestSuccessful();
                        updateLibrary();
                      } else {
                        setRequestFailure(json.errorMsg);
                      }
                    })
                    .catch((err) => {
                      console.error(err);
                      setRequestFailure("An unknown error has occurred");
                    });
                }}
              >
                ADD BOOK TO LIBRARY
              </BigButton>
              {state.error && <StepDiv complete={false}>{state.error}</StepDiv>}
            </SecondBox>

            <ThirdBox>
              {currentLibrary.name}:
              {state.status === "loading" ? (
                <LoadingSpinner style={{ marginTop: "50px" }} />
              ) : (
                <BookListDiv>
                  {currentLibrary.library.map((book, index) => {
                    return (
                      <BookItemDiv key={index}>
                        <ImageResult
                          src={book.thumbnail}
                          alt={book.title}
                        ></ImageResult>
                        <BookInfo>
                          <p>
                            {book.title}, By:{" "}
                            {book.authors
                              ? book.authors.map((author) => author)
                              : "N/A"}
                          </p>
                          <p style={{ fontSize: "13px", marginTop: "5px" }}>
                            Qty:{book.qtyAvailable}
                          </p>
                        </BookInfo>
                        <DeleteButton
                          onClick={() => {
                            handleRemoveBook(book.volumeNum);
                          }}
                        >
                          X
                        </DeleteButton>
                      </BookItemDiv>
                    );
                  })}
                </BookListDiv>
              )}
            </ThirdBox>
          </Container>
        </>
      )}
    </>
  );
};

const Title = styled.h1`
  margin-left: 10vw;
  margin-top: 10px;
`;

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
  max-height: 70vh;
  &:last-child {
    border-right: 1px solid grey;
  }
`;
const FirstBox = styled(Box)`
  flex: 3;
  overflow: auto;
  overflow-x: hidden;
  position: relative;
  padding-top: 0;
`;

const SecondBox = styled(Box)`
  display: flex;
  flex-direction: column;
`;

const ThirdBox = styled(Box)`
  flex: 3;
`;

const StepDiv = styled.button`
  background-color: ${({ complete }) =>
    complete ? " rgb(84,192,84, 0.2) " : "rgb(255,215,215,0.2)"};
  text-align: left;
  min-height: 10vh;
  max-height: 30%;
  display: flex;
  flex-direction: column;
  box-shadow: ${({ complete }) =>
    complete
      ? "0 0 5px 1px rgb(84,192,84)"
      : "0 0 5px 1px rgb(255,100,100,1) "};
  padding: 10px;
  border-radius: 3px;
  margin: 10px;
  cursor: pointer;
  border: none;
  &:hover {
    transform: scale(1.02);
  }
  transition: 200ms ease;
`;

const ListStyle = styled.ul`
  margin-left: 20px;
  margin-top: 5px;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  max-height: 90%;
  gap: 0 50px;
`;

const ListItem = styled.li`
  max-width: 100px;
`;

const ChosenBookImg = styled.img`
  /* width: 40%; */
  height: 80%;
  margin: 10px auto;
`;

const BigButton = styled.button`
  width: 150px;
  height: 50px;
  margin: 10px auto;
  color: white;
  text-shadow: 0 0 5px black;
  border: none;
  background-color: ${({ buttonActive }) =>
    buttonActive ? "green" : "rgb(255,0,0,0.5)"};
  cursor: ${({ buttonActive }) => (buttonActive ? "pointer" : "default")};
  border-radius: 3px;
`;

const BookListDiv = styled.div``;

const BookItemDiv = styled.div`
  border: 1px solid silver;
  display: flex;
  align-items: center;
  position: relative;
`;

const ImageResult = styled.img`
  width: 10%;
  margin: 5px;
`;

const BookInfo = styled.div`
  /* border: 1px solid red; */
  margin-right: 20px;
`;

const DeleteButton = styled.button`
  position: absolute;
  top: 3px;
  right: 3px;
  color: #a01515;
  background-color: transparent;
  border: none;
  cursor: pointer;
  &:hover {
    transform: scale(1.1);
  }
`;
export default LibraryAddBook;
