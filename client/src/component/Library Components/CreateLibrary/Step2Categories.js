import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { CurrentUserContext } from "../../context/CurrentUserContext";
import LoadingSpinner from "../../LoadingSpinner";

//component that handles step 2 of adding book to library which is selecting categories
const Step2Categories = ({
  setAddCategory,
  setRemoveCategory,
  setCategoriesLinedUp,
  state,
}) => {
  const [allCategories, setAllCategories] = useState({});
  const [loading, setLoading] = useState(true);
  const [counter, setCounter] = useState(0);
  const { userState } = useContext(CurrentUserContext);

  useEffect(() => {
    //for each category, fetch the information and save it to state
    if (userState.currentUser.categories) {
      userState.currentUser.categories.forEach((category) => {
        fetch(`/categories/${category}`)
          .then((res) => res.json())
          .then((receivedCategories) => {
            if (receivedCategories.status === 200) {
              setCounter(counter + 1);
              let addedCategories = receivedCategories.data.filters;
              setAllCategories({ ...allCategories, ...addedCategories });
            }
          });
      });
    }
  }, [userState]);

  //keeps track of all the categories, and only set the loading to false if all of the categories have been pushed to state.
  useEffect(() => {
    if (counter === userState.currentUser.categories.length) {
      setLoading(false);
    }
  }, [counter]);

  //function that controls adding the categories from the 1st box to the middle box.
  const handleOnChange = (e) => {
    if (e.target.value === "Fiction") {
      if (
        state.categories.find((category) => {
          return category === "Non-Fiction";
        })
      ) {
        setAddCategory(e.target.value);
        setRemoveCategory("Non-Fiction");
      } else {
        setAddCategory(e.target.value);
      }
    } else if (e.target.value === "Non-Fiction") {
      if (
        state.categories.find((category) => {
          return category === "Fiction";
        })
      ) {
        setAddCategory(e.target.value);
        setRemoveCategory("Fiction");
      } else {
        setAddCategory(e.target.value);
      }
    } else {
      if (e.target.checked) {
        setAddCategory(e.target.value);
      } else {
        setRemoveCategory(e.target.value);
      }
    }
  };

  //"sets" the categories up for when they user is ready to push them to the library
  const handleCompleteOnClick = () => {
    setCategoriesLinedUp();
  };

  return (
    <Container>
      <CatTitleDiv>
        <h2>Step 2: Choose Categories </h2>
        <CompleteCategoriesButton onClick={handleCompleteOnClick}>
          Complete Categories
        </CompleteCategoriesButton>
      </CatTitleDiv>
      {loading ? (
        <LoadingSpinner style={{ marginTop: "50px" }} />
      ) : (
        <>
          {Object.keys(allCategories).map((filters, index) => {
            return (
              <React.Fragment key={index}>
                <FormStyle>
                  <FilterName>{filters.toUpperCase()}</FilterName>
                  <Divider />
                  <FilterOptionContainer myindex={index === 0}>
                    {allCategories[filters].map((filter, index) => {
                      return (
                        <FilterOption key={index}>
                          <input
                            type={filters === "type" ? "radio" : "checkbox"}
                            name={filters === "type" ? "type" : filters}
                            id={filter}
                            value={filter}
                            checked={state.categories.find((category) => {
                              return category === filter;
                            })}
                            onChange={(e) => {
                              handleOnChange(e);
                            }}
                          ></input>
                          <LabelStyle htmlFor={filter}>{filter}</LabelStyle>
                        </FilterOption>
                      );
                    })}
                  </FilterOptionContainer>
                </FormStyle>
              </React.Fragment>
            );
          })}
        </>
      )}
    </Container>
  );
};

const Container = styled.div`
  /* border: 1px solid red; */
  width: 95%;
  position: relative;
  margin: 0 auto;
`;

const CatTitleDiv = styled.div`
  position: sticky;
  top: 0px;
  background-color: white;
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding-top: 10px;
  padding-bottom: 10px;
  border-bottom: 1px solid silver;
  width: 100%;
`;

const FormStyle = styled.form`
  margin-top: 10px;
  box-shadow: 0 0 5px 1px silver inset;
  border-radius: 2px;
  padding: 10px;
`;

const FilterName = styled.p`
  margin-top: 5px;
`;

const Divider = styled.hr`
  /* width: 95%; */
  margin: 0 auto;
`;
const FilterOptionContainer = styled.div`
  margin: 5px 5px 10px 5px;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  align-content: flex-start;
  gap: 2px 15px;
  max-height: calc(500px - 0.75 * 30vw);
  min-height: ${({ myindex }) => (myindex ? "50px" : "100px")};
  max-width: 98%;
  height: 100%;
  width: 100%;
  /* border: 1px solid pink; */
`;

const FilterOption = styled.div`
  margin: 3px 5px;
`;

const LabelStyle = styled.label`
  margin-left: 3px;
`;

const CompleteCategoriesButton = styled.button`
  padding: 10px;
  cursor: pointer;
  background-color: darkblue;
  border: none;
  border-radius: 3px;
  top: 0;
  color: white;
  &:hover {
    transform: scale(1.03);
    transition: ease 200ms;
  }
  &:active {
    transform: scale(0.97);
    transition: ease 200ms;
  }
`;

export default Step2Categories;
