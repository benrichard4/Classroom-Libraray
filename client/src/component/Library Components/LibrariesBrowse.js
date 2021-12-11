import React, { useEffect, useReducer, useState } from "react";
import { useParams } from "react-router";
import styled from "styled-components";

let initialState = {
  status: "idle",
  filters: [],
  filteredLibrary: null,
  error: null,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "FILTER-REQUESTED":
      return {
        ...state,
        filters: filters.push(action.filter),
      };
    case "FILTERED-LIBRARY-SUCCESS":
      return {
        ...state,
      };
    case "FILTERED-LIBRARY-FAILURE":
      return {
        ...state,
      };
    default:
      throw new Error(`${action.type} is not an action`);
  }
};

const LibrariesBrowse = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [currentLibrary, setCurrentLibrary] = useState(null);
  const { _id } = useParams();

  //get the library in question. Then be able to filter it and display the results.
  useEffect(() => {
    fetch(`/libraries/${_id}`)
      .then((res) => res.json())
      .then((LibraryData) => {
        setCurrentLibrary(LibraryData.data);
      });
  }, []);

  return (
    <Container>
      Container
      <TopSectionDiv>
        <TitleDiv>Title</TitleDiv>
        <SearchDiv>SearchDiv</SearchDiv>
        <DropDownDiv>DropDownDiv</DropDownDiv>
      </TopSectionDiv>
      <FilterAndDisplayDiv>
        <SideCategoriesDiv>SideCategoriesDiv</SideCategoriesDiv>
        <DisplayContainer>DisplayContainer</DisplayContainer>
      </FilterAndDisplayDiv>
    </Container>
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
  flex: 3;
`;
export default LibrariesBrowse;
