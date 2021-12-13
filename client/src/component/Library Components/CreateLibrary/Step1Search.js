import React, { useEffect, useState } from "react";
import styled from "styled-components";
import LoadingSpinner from "../../LoadingSpinner";
import { getPaginatedSearchResults } from "../../../services/GoogleBooks";
import Step1SearchResult from "./Step1SearchResult";

const Step1Search = ({ setBookLinedUp }) => {
  const [search, setSearch] = useState("");
  const [searchType, setSearchType] = useState("GeneralSearch");
  const [maxPages, setMaxPages] = useState(6);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleOnChange = (data) => {
    setSearch(data);
  };

  const handleSearchTypeSelect = (e) => {
    setSearchType(e.target.value);
  };

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

  const handleLoadMoreButton = () => {
    setMaxPages(maxPages + maxPages);
  };

  useEffect(() => {
    let modifiedsearch = search.split(" ").join("+");
    getPaginatedSearchResults(searchType, modifiedsearch, 0, maxPages).then(
      (data) => setResults(data)
    );
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
        <h2>Step 1: Find and choose Book</h2>
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
            <button type="submit">Search</button>
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
  /* border: 2px solid blue; */
  /* align-items:flex-start; */
`;

const FormDiv = styled.div`
  /* border: 2px solid pink; */
`;

const SearchForm = styled.form`
  margin: 20px 15px 20px 15px;
  display: flex;
  flex-wrap: wrap;
  /* border: 2px solid green; */
  /* justify-content: center; */
`;

const InputStyled = styled.input`
  width: 50%; //400px;;
  /* height: 106px; */
`;

const SelectStyle = styled.select`
  padding: 5px 2px;
  border-left: none;
  border-right: none;
`;

const ResultsWrapper = styled.div`
  /* max-width: 600px; */
  display: flex;
  flex-direction: column;
  /* flex-wrap: wrap; */
  margin: 0 auto;
  /* border: 2px solid red; */
`;

const ResultDiv = styled.div`
  padding: 10px;
  /* padding-bottom: 40px; */
  margin: 10px;
  border: 1px solid silver;
  /* width: 25%; */
  display: flex;
  /* flex-direction: column; */

  &:last-child {
    border: none;
  }
`;

const LoadMoreButton = styled.button`
  padding: 5px;
  font-size: 0.55vw;
`;
