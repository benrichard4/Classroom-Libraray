import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { CurrentUserContext } from "../../context/CurrentUserContext";

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
    userState.currentUser.categories.map((category) => {
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
  }, []);

  useEffect(() => {
    if (counter === userState.currentUser.categories.length) {
      setLoading(false);
    }
  }, [counter]);

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
        <div>Loading...</div>
      ) : (
        <>
          {Object.keys(allCategories).map((filters, index) => {
            return (
              <FormStyle key={index}>
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
                        <LabelStyle for={filter}>{filter}</LabelStyle>
                      </FilterOption>
                    );
                  })}
                </FilterOptionContainer>
              </FormStyle>
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

  top: 0;
`;

export default Step2Categories;
