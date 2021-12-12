import React, { useEffect, useReducer, useState } from "react";
import { useParams } from "react-router";
import styled from "styled-components";
import CategoriesSideBar from "./CategoriesSideBar";

const initialState = {
  status: "idle",
  selectedFilters: [],
  fullLibrary: null,
  filteredLibrary: null,
  error: null,
};

const reducer = (state, action) => {
  const filterLibraryFunction = (filters, filteredLibrary) => {
    if (filters.length === 0) {
      return state.fullLibrary.library;
    } else {
      //filter through library to get book
      console.log("INFILTEREDFUNCTION", filters, filteredLibrary);
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
      console.log("NEW FILTERED LIBRARY", newFilteredLibrary);
      return newFilteredLibrary;
    }
  };

  switch (action.type) {
    case "PAGE-LOADED":
      return {
        ...state,
        filteredLibrary: action.library.library,
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
      console.log(
        "ACTION.FILTER",
        action.filter,
        "STATE.SELECTEDFILTERS",
        state.selectedFilters
      );
      let newFiltersRemove = state.selectedFilters.filter((filterItem) => {
        // console.log("filteritem", filterItem, "action.filter", action.filter);
        return filterItem !== action.filter;
      });
      // console.log("NEWFILTERSREMOVE", newFiltersRemove);
      return {
        ...state,
        status: "idle",
        selectedFilters: newFiltersRemove,
        filteredLibrary: filterLibraryFunction(
          newFiltersRemove,
          state.fullLibrary.library
        ),
      };
    default:
      throw new Error(`${action.type} is not an action`);
  }
};

const LibrariesBrowse = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { _id } = useParams();

  //get the library in question. Then be able to filter it and display the results.
  useEffect(() => {
    fetch(`/libraries/${_id}`)
      .then((res) => res.json())
      .then((LibraryData) => {
        console.log(LibraryData);
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

  console.log("FILTEREDSTATE", state);
  return (
    state.filteredLibrary && (
      <Container>
        <TopSectionDiv>
          <TitleDiv>
            <h2>{state.fullLibrary.name}</h2>
          </TitleDiv>
          <SearchDiv>SearchDiv</SearchDiv>
          <DropDownDiv>DropDownDiv</DropDownDiv>
        </TopSectionDiv>
        <FilterAndDisplayDiv>
          <SideCategoriesDiv>
            <h3>Categories</h3>
            <CategoriesSideBar
              setAddFilter={setAddFilter}
              setRemoveFilter={setRemoveFilter}
              state={state}
            />
          </SideCategoriesDiv>
          <DisplayContainer>
            <BookBox>
              {state.filteredLibrary.length === 0 ? (
                <h3> No results found</h3>
              ) : (
                state.filteredLibrary.map((book, index) => {
                  return (
                    <BookDiv key={index}>
                      <ImgDiv>
                        <BookImg
                          src={book.thumbnail}
                          alt={`${book.title} pic`}
                        ></BookImg>
                      </ImgDiv>
                      <BookInfo>Title: {book.title}</BookInfo>
                    </BookDiv>
                  );
                })
              )}
            </BookBox>
          </DisplayContainer>
        </FilterAndDisplayDiv>
      </Container>
    )
  );
};

const Container = styled.div`
  margin: 0 auto;
  width: 80vw;
  max-width: 1200px;
  border: 1px solid black;
  display: flex;
  flex-direction: column;
  padding: 10px;
`;

const TopSectionDiv = styled.div`
  border: 1px solid black;
  margin: 5px 0;
  display: flex;
`;

const TitleDiv = styled.div`
  flex: 2;
  border: 1px solid black;
  margin: 5px 10px;
`;

const SearchDiv = styled.div`
  flex: 3;
  border: 1px solid black;
  margin: 5px 0;
`;

const DropDownDiv = styled.div`
  flex: 1;
  border: 1px solid black;
  margin: 5px 0;
`;

const FilterAndDisplayDiv = styled.div`
  border: 1px solid black;
  margin: 5px 0;
  display: flex;
  padding: 10px;
`;

const SideCategoriesDiv = styled.div`
  flex: 1;
  border: 1px solid black;
  margin: 5px 0;
`;

const DisplayContainer = styled.div`
  border: 1px solid black;
  margin: 5px 0;
  flex: 4;
`;

const BookBox = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  /* justify-content: center; */
  align-content: flex-start;
  border: 2px solid red;
  margin: 5px 3%;
`;

const BookDiv = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px solid black;
  height: 200px;
  width: 30%; //275px;;
  min-width: 200px;
  margin: 5px;
`;

const ImgDiv = styled.div`
  border: 1px solid green;
  width: 100%;
  height: 50%;
  display: flex;
  /* justify-content: left; */
`;

const BookImg = styled.img`
  margin: 0 5px;
  height: 100%;
`;

const BookInfo = styled.p`
  font-size: 1.1vw;
`;
export default LibrariesBrowse;
