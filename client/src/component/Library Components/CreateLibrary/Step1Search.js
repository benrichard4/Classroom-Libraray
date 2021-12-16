import React, { useEffect, useState } from "react";
import styled from "styled-components";
import LoadingSpinner from "../../LoadingSpinner";
import { getPaginatedSearchResults } from "../../../services/GoogleBooks";
import Step1SearchResult from "./Step1SearchResult";

//component that searches for books using the google api
const Step1Search = ({ setBookLinedUp }) => {
  const [search, setSearch] = useState("");
  const [searchType, setSearchType] = useState("GeneralSearch");
  const [maxPages, setMaxPages] = useState(6);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  //function that handles the search state when something is typed innto input
  const handleOnChange = (data) => {
    setSearch(data);
  };

  //changes the state of the type of search from dropdown
  const handleSearchTypeSelect = (e) => {
    setSearchType(e.target.value);
  };

  //funciton that handles the submitting of what was in input and dropdown to search through google api. max pages has to go with how many results are displayed at a time
  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMaxPages(6);
    let modifiedsearch = search.split(" ").join("+");
    await getPaginatedSearchResults(
      searchType,
      modifiedsearch,
      0,
      maxPages
    ).then((data) => setResults(data));
    setLoading(false);
  };

  //function that shows more results
  const handleLoadMoreButton = () => {
    setMaxPages(maxPages + maxPages);
  };

  //when max pages changes, run function that gets information from google api
  useEffect(() => {
    if (search) {
      let modifiedsearch = search.split(" ").join("+");
      getPaginatedSearchResults(searchType, modifiedsearch, 0, maxPages).then(
        (data) => setResults(data)
      );
    }
  }, [maxPages]);

  //If the enter key is pressed in the input box, then the handleClick function is called
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSubmit(event);
      return;
    }
  };

  return (
    <>
      <FirstContainer>
        <SubTitle>Step 1: Find and choose Book</SubTitle>
        <FormDiv>
          <SearchForm onSubmit={handleSubmit}>
            <InputStyled
              type="text"
              onChange={(e) => handleOnChange(e.target.value)}
              onKeyDown={handleKeyDown}
              value={search}
              autoFocus
            ></InputStyled>
            <div>
              <SelectStyle value={searchType} onChange={handleSearchTypeSelect}>
                <option value="GeneralSearch" defaultValue>
                  Keyword
                </option>
                <option value="IsbnSearch">ISBN</option>
                <option value="TitleSearch">By Title</option>
              </SelectStyle>
            </div>
            <SearchButton type="submit">Search</SearchButton>
          </SearchForm>
        </FormDiv>
        {loading ? (
          <LoadingSpinner style={{ marginTop: "50px" }} />
        ) : (
          results && (
            <ResultsWrapper>
              {results.map((result, index) => {
                return (
                  <Step1SearchResult
                    key={index}
                    result={result}
                    index={index}
                    setBookLinedUp={setBookLinedUp}
                  />
                );
              })}
              <ResultDiv>
                <LoadMoreButton onClick={handleLoadMoreButton}>
                  Load More ...
                </LoadMoreButton>
              </ResultDiv>
            </ResultsWrapper>
          )
        )}
      </FirstContainer>
    </>
  );
};

export default Step1Search;

const FirstContainer = styled.div`
  display: flex;
  max-width: 800px;
  width: 95%;
  margin: 0 auto;
  flex-direction: column;
  justify-content: flex-start;
`;

const SubTitle = styled.h2`
  margin-top: 10px;
`;
const FormDiv = styled.div``;

const SearchForm = styled.form`
  margin: 20px 15px 20px 15px;
  display: flex;
  flex-wrap: wrap;
`;

const InputStyled = styled.input`
  width: 50%;
  padding-left: 10px;
`;

const SelectStyle = styled.select`
  padding: 5px 2px;
  border-left: none;
  border-right: none;
`;

const SearchButton = styled.button`
  padding: 5px 15px;
  background-color: darkblue;
  border: none;
  border-radius: 3px;
  color: white;
`;

const ResultsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0 auto;
`;

const ResultDiv = styled.div`
  padding: 10px;
  margin: 10px;
  border: 1px solid silver;
  display: flex;

  &:last-child {
    border: none;
  }
`;

const LoadMoreButton = styled.button`
  padding: 5px 15px;
  font-size: calc(10px + 0.3vw);
  background-color: darkblue;
  border: none;
  border-radius: 3px;
  color: white;
  cursor: pointer;
  &:hover {
    transform: scale(1.05);
    transition: ease 100ms;
  }
`;
