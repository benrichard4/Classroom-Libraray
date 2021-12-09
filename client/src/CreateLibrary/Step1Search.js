import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { getPaginatedSearchResults } from "../services/GoogleBooks";

// initialState = {
//     search: "",
//     searchType: "GeneralSearch",
//     maxPages: 6,
//     results: null,
//     status: "loading",
//     chosenBook: {
//         volumeNumber: null,
//         categories: [],
//         qtyAvailable: null
//     }
// }

// useReduce = (state, type) => {
//     switch (action.type) {
//         case "INITIAL-STATE":
//             return initialState;
//         case "LOADING":
//             return {
//                 ...state,
//                 status: "loading"
//             }
//         case "DATA-RECEIVED":
//             return {
//                 ...state,
//                 results: action.data,
//                 status: "idle"
//             }
//         case "INCREASE-MAX-PAGES":
//             return {
//                 ...state,
//                 maxPages: action.maxPages
//             }
//         case "BOOK-CHOSEN"
//     }
// }

const Step1Search = () => {
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

  const handleSubmit = (event) => {
    event.preventDefault();
    setLoading(true);
    setMaxPages(6);
    let modifiedsearch = search.split(" ").join("+");
    getPaginatedSearchResults(searchType, modifiedsearch, 0, maxPages).then(
      (data) => setResults(data)
    );
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

  console.log("Maxpages", maxPages);
  console.log(search);
  console.log("results", results);
  console.log("searchType", searchType);
  return (
    <>
      <FirstContainer>
        <h1>Step 1: Find and choose Book</h1>
        <FormDiv>
          <SearchForm onSubmit={handleSubmit}>
            <InputStyled
              type="text"
              onChange={(e) => handleOnChange(e.target.value)}
              value={search}
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
        {results && (
          <ResultsWrapper>
            {results.map((result, index) => {
              return (
                <ResultDiv>
                  {result.volumeInfo.imageLinks ? (
                    <img
                      key={index}
                      src={result.volumeInfo.imageLinks.thumbnail}
                      alt={`book result ${index}`}
                    ></img>
                  ) : (
                    <p>Image not Found</p>
                  )}
                </ResultDiv>
              );
            })}
            <ResultDiv>
              <LoadMoreButton onClick={handleLoadMoreButton}>
                Load More ...
              </LoadMoreButton>
            </ResultDiv>
          </ResultsWrapper>
        )}
      </FirstContainer>
    </>
  );
};

export default Step1Search;

const FirstContainer = styled.div`
  display: flex;
  max-width: 400px;
  width: 30vw;
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
  /* border: 2px solid green; */
  /* justify-content: center; */
`;

const InputStyled = styled.input`
  width: 400px;
`;

const SelectStyle = styled.select`
  padding: 5px 2px;
  border-left: none;
  border-right: none;
`;

const ResultsWrapper = styled.div`
  /* max-width: 600px; */
  display: flex;
  flex-wrap: wrap;
  margin: 0 auto;
  /* border: 2px solid red; */
`;

const ResultDiv = styled.div`
  padding: 5px 10px;
  padding-bottom: 40px;
  margin: 15px;
  border: 2px solid silver;
  &:last-child {
    border: none;
  }
`;

const LoadMoreButton = styled.button`
  height: 20%;
  padding: 5px;
  font-size: 13px;
  margin-top: 150px;
`;
