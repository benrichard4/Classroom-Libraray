import React, { useState } from "react";
import styled from "styled-components";

//search bar that out puts suggestions live when typing
const SearchBar = ({ suggestions, handleSelect }) => {
  const [value, setValue] = useState("");
  const [selectSuggestionIndex, setSelectedSuggestionIndex] = useState(0);

  let matchSuggestions = [];
  let firstHalf = "";
  let secondHalf = "";

  const checkMatch = (suggestion) => {
    let { title } = suggestion;
    if (value === "") {
      return null;
    } else {
      return title.toUpperCase().match(value.toUpperCase());
    }
  };

  matchSuggestions = suggestions.filter(checkMatch);

  return (
    <>
      <Container>
        <Input
          type="text"
          placeholder="Search by title"
          value={value}
          onChange={(ev) => setValue(ev.target.value)}
          onKeyDown={(ev) => {
            switch (ev.key) {
              case "Enter": {
                handleSelect(matchSuggestions[selectSuggestionIndex].title);
                return;
              }
              case "ArrowUp": {
                setSelectedSuggestionIndex(selectSuggestionIndex - 1);
                return;
              }
              case "ArrowDown": {
                setSelectedSuggestionIndex(selectSuggestionIndex + 1);
                return;
              }
            }
          }}
        />

        <Button onClick={() => setValue("")}>Clear</Button>
      </Container>
      <UnorderedList value={value}>
        {matchSuggestions.map((match, index) => {
          firstHalf = match.title.slice(
            0,
            match.title.toUpperCase().indexOf(value.toUpperCase()) +
              value.length
          );
          secondHalf = match.title.slice(
            match.title.toUpperCase().indexOf(value.toUpperCase()) +
              value.length,
            match.title.length
          );
          const isSelectedFunc = () => {
            if (selectSuggestionIndex < 0) {
              setSelectedSuggestionIndex(0);
              return selectSuggestionIndex === index;
            } else if (selectSuggestionIndex > matchSuggestions.length - 1) {
              setSelectedSuggestionIndex(matchSuggestions.length - 1);
              return selectSuggestionIndex === index;
            } else {
              return selectSuggestionIndex === index;
            }
          };
          let isSelected = isSelectedFunc();
          return (
            <Suggestion
              key={match.volumeNum}
              style={{
                background: isSelected
                  ? "hsla(50deg, 100%, 80%, 0.25)"
                  : "transparent",
              }}
              onClick={() => handleSelect(match.title)}
              onMouseEnter={() => setSelectedSuggestionIndex(index)}
            >
              <span>
                {firstHalf}
                <Prediction>{secondHalf}</Prediction>
              </span>
              {/* <InSpan>
                {" "}
                in
                <CategorySpan>
                  
                  {categories[match.categoryId].name}
                </CategorySpan>
              </InSpan> */}
            </Suggestion>
          );
        })}
      </UnorderedList>
    </>
  );
};

const Container = styled.div`
  display: flex;
  padding: 0;
  align-items: center;
  justify-content: flex-start;
  height: auto;
  width: 100%;
`;

const Input = styled.input`
  height: 30px;
  padding: 10px;
  margin: 5px;
  width: 300px;

  &:focus {
    outline: none;
    box-shadow: 0 0 6px blue;
  }
`;
const Button = styled.button`
  border: none;
  border-radius: 3px;
  background-color: darkblue;
  color: white;
  height: 30px;
  width: 80px;
  margin: 5px;
`;

const UnorderedList = styled.ul`
  box-shadow: 0 0 6px grey;
  width: 400px;
  margin-left: 5px;
  padding: 5px;
  display: ${(props) => (props.value ? "block" : "none")};
  position: absolute;
  background-color: white;
  list-style-type: none;
`;
const Suggestion = styled.li`
  padding: 10px;
`;

const Prediction = styled.span`
  font-weight: bold;
`;

export default SearchBar;
