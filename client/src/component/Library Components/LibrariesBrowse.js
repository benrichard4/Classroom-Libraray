import React, { useContext, useEffect, useReducer, useState } from "react";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import { useHistory } from "react-router";
import styled from "styled-components";

import { CurrentUserContext } from "../context/CurrentUserContext";
import LoadingSpinner from "../LoadingSpinner";
import SearchBar from "../SearchBar";
import CategoriesSideBar from "./CategoriesSideBar";

const initialState = {
  status: "idle",
  selectedFilters: [],
  fullLibrary: null,
  filteredLibrary: null,
  error: null,
  sort: "By Title",
};

const reducer = (state, action) => {
  //function that filters the library by the selected filter
  const filterLibraryFunction = (filters, filteredLibrary) => {
    if (filters.length === 0) {
      return state.fullLibrary.library;
    } else {
      //filter through library to get book
      let newFilteredLibrary = filteredLibrary.filter((book) => {
        //filter through books' catergories
        let arr = [];
        book.categories.forEach((category) => {
          //filter through filters array adn check to see if they match any of each book's categories. If it does, return it
          filters.forEach((filter) => {
            if (filter === category) {
              arr.push(filter);
            }
          });
        });
        return arr.length === filters.length;
      });
      return newFilteredLibrary;
    }
  };

  const sortListTitle = (list) => {
    list.sort((a, b) => {
      if (a.title.toLowerCase() < b.title.toLowerCase()) {
        return -1;
      }
      if (a.title.toLowerCase() > b.title.toLowerCase()) {
        return 1;
      }
      return 0;
    });
    return list;
  };

  const sortListAuthor = (list) => {
    let stay = list.filter((book) => {
      return book.author;
    });
    console.log("STAY", stay.length);
    let sorted = list.filter((book) => {
      return !book.author;
    });
    console.log("SORTED", sorted);
    sorted.sort((a, b) => {
      if (a.authors[0].toLowerCase() < b.authors[0].toLowerCase()) {
        return -1;
      }
      if (a.authors[0].toLowerCase() > b.authors[0].toLowerCase()) {
        return 1;
      }
      return 0;
    });
    console.log("SORTED", sorted);
    // if (stay.length >= 1) {
    let newList = [...sorted, ...stay];
    return newList;
    // } else {
    //   return sorted;
    // }
  };

  switch (action.type) {
    case "PAGE-LOADED":
      const newFilteredLibrary = sortListTitle(action.library.library);
      return {
        ...state,
        filteredLibrary: newFilteredLibrary,
        fullLibrary: action.library,
        status: "idle",
      };
    case "SET-LOADING":
      return {
        ...state,
        status: "loading",
      };
    case "ADD-FILTER":
      let newFilterAdd = [...state.selectedFilters, action.filter];
      return {
        ...state,
        status: "idle",
        selectedFilters: newFilterAdd,
        filteredLibrary: filterLibraryFunction(
          newFilterAdd,
          state.fullLibrary.library
        ),
      };
    case "REMOVE-FILTER":
      let newFiltersRemove = state.selectedFilters.filter((filterItem) => {
        return filterItem !== action.filter;
      });
      return {
        ...state,
        status: "idle",
        selectedFilters: newFiltersRemove,
        filteredLibrary: filterLibraryFunction(
          newFiltersRemove,
          state.fullLibrary.library
        ),
      };
    case "SORT-LIBRARY":
      let newSortedLibrary = [];
      if (action.sort === "byTitle") {
        newSortedLibrary = sortListTitle(state.filteredLibrary);
      } else {
        newSortedLibrary = sortListAuthor(state.filteredLibrary);
      }
      return {
        ...state,
        filteredLibrary: newSortedLibrary,
        sort: action.sort,
      };

    default:
      throw new Error(`${action.type} is not an action`);
  }
};

const LibrariesBrowse = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { userState } = useContext(CurrentUserContext);
  const { _id } = useParams();
  const history = useHistory();

  //get the library in question. Then be able to filter it and display the results.
  useEffect(() => {
    fetch(`/libraries/${_id}`)
      .then((res) => res.json())
      .then((LibraryData) => {
        setPageLoaded(LibraryData.data);
      });
  }, []);

  const setPageLoaded = (library) => {
    dispatch({ type: "PAGE-LOADED", library: library });
  };

  const setAddFilter = (filter) => {
    dispatch({ type: "ADD-FILTER", filter: filter });
  };

  const setRemoveFilter = (filter) => {
    dispatch({ type: "REMOVE-FILTER", filter: filter });
  };

  const sortLibrary = (sort) => {
    dispatch({ type: "SORT-LIBRARY", sort });
  };

  console.log("STATE", state);
  return state.fullLibrary === null || userState.currentUser === null ? (
    <LoadingSpinner style={{ marginTop: "50px" }} />
  ) : (
    <Container>
      <TopSectionDiv>
        <TitleDiv>
          <h2>{state.fullLibrary.name}</h2>
        </TitleDiv>
        <SearchDiv>
          <SearchBar
            suggestions={state.fullLibrary.library}
            handleSelect={(suggestion) => {
              let foundBook = state.fullLibrary.library.find((book) => {
                return book.title === suggestion;
              });
              history.push(`/library/${_id}/book/${foundBook.volumeNum}`);
            }}
          />
        </SearchDiv>
        <DropDownDiv>
          <DropDownTitle>Sort Alphabetically</DropDownTitle>
          <StyledSelect
            value={state.sort}
            onChange={(e) => {
              sortLibrary(e.target.value);
            }}
          >
            <option value="byTitle" defaultValue>
              By Title
            </option>
            <option value="byAuthor">By Author</option>
          </StyledSelect>
        </DropDownDiv>
      </TopSectionDiv>
      <FilterAndDisplayDiv>
        <SideCategoriesDiv>
          <h3>Categories</h3>
          <CategoriesSideBar
            setAddFilter={setAddFilter}
            setRemoveFilter={setRemoveFilter}
            state={state}
            currentTeacher={
              userState.userType === "teacher"
                ? userState.currentUser
                : userState.studentTeacher
            }
          />
        </SideCategoriesDiv>
        <DisplayContainer>
          <BookBox>
            {state.filteredLibrary.length === 0 ? (
              <h3> No results found</h3>
            ) : (
              state.filteredLibrary.map((book, index) => {
                return (
                  <BookLink
                    to={`/library/${_id}/book/${book.volumeNum}`}
                    key={index}
                  >
                    <ImgDiv>
                      <BookImg
                        src={book.thumbnail}
                        alt={`${book.title} pic`}
                      ></BookImg>
                      <BookInfo>
                        Available: {book.qtyAvailable}/
                        {book.isCheckedout.length}
                      </BookInfo>
                    </ImgDiv>
                    <BookInfo>Title: {book.title}</BookInfo>
                    <BookInfo>
                      {"Author(s): "}
                      {book.authors
                        ? book.authors.map((author, index) => {
                            if (index + 1 === book.authors.length) {
                              return `${author}`;
                            } else {
                              return `${author}, `;
                            }
                          })
                        : "N/A"}
                    </BookInfo>
                  </BookLink>
                );
              })
            )}
          </BookBox>
        </DisplayContainer>
      </FilterAndDisplayDiv>
    </Container>
  );
};

const Container = styled.div`
  margin: 0 auto;
  margin-top: 10px;
  width: 80vw;
  max-width: 1200px;
  /* border: 1px solid black; */
  display: flex;
  flex-direction: column;
  padding: 10px;
`;

const TopSectionDiv = styled.div`
  border-bottom: 1px solid silver;
  padding-bottom: 10px;
  margin: 5px 0;
  display: flex;
`;

const TitleDiv = styled.div`
  flex: 6;
  /* border: 1px solid black; */
  margin: 5px 10px;
`;

const SearchDiv = styled.div`
  flex: 10;
  /* border: 1px solid black; */
  margin: 5px 0;
`;

const DropDownDiv = styled.div`
  flex: 3;
  /* border: 1px solid black; */
  margin: 5px 0;
  display: flex;
  flex-direction: column;
  align-items: flex;
`;

const DropDownTitle = styled.p`
  font-size: 14px;
`;

const StyledSelect = styled.select`
  width: 120px;
`;

const FilterAndDisplayDiv = styled.div`
  /* border: 1px solid black; */
  margin: 5px 0;
  display: flex;
  padding: 10px;
`;

const SideCategoriesDiv = styled.div`
  flex: 1;
  /* border: 1px solid black; */
  margin: 5px 0;
`;

const DisplayContainer = styled.div`
  /* border: 1px solid black; */
  margin: 5px 0;
  flex: 4;
`;

const BookBox = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  /* justify-content: center; */
  align-content: flex-start;
  /* border: 2px solid red; */
  margin: 5px 3%;
`;

const BookLink = styled(Link)`
  text-decoration: none;
  color: black;
  display: flex;
  flex-direction: column;
  border: 1px solid lightblue;
  height: 200px;
  width: 30%; //275px;;
  min-width: 200px;
  margin: 5px;
  padding: 10px;
  &:hover {
    box-shadow: 0 0 5px 1px lightblue;
  }
`;

const ImgDiv = styled.div`
  /* border: 1px solid green; */
  width: 100%;
  height: 50%;
  display: flex;
  margin-bottom: 10px;
  justify-content: space-between;
`;

const BookImg = styled.img`
  margin: 0 5px;
  height: 100%;
  margin-left: 10px;
  max-width: 90px;
`;

const BookInfo = styled.div`
  font-size: calc(12px + 0.3vw);
  margin: 3px 0;
`;
export default LibrariesBrowse;
