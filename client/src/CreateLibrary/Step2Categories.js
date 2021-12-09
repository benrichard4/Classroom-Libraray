import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { CurrentUserContext } from "../component/context/CurrentUserContext";

const Step2Categories = ({
  setCategoriesLinedUp,
  removeCategoryLinedUp,
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
    console.log("in on change", e.target.checked, e.target.value);
    if (e.target.value === "Fiction") {
      if (
        state.categories.find((category) => {
          return category === "Non-Fiction";
        })
      ) {
        setCategoriesLinedUp(e.target.value);
        removeCategoryLinedUp("Non-Fiction");
      } else {
        setCategoriesLinedUp(e.target.value);
      }
    } else if (e.target.value === "Non-Fiction") {
      if (
        state.categories.find((category) => {
          return category === "Fiction";
        })
      ) {
        setCategoriesLinedUp(e.target.value);
        removeCategoryLinedUp("Fiction");
      } else {
        setCategoriesLinedUp(e.target.value);
      }
    } else {
      if (e.target.checked) {
        setCategoriesLinedUp(e.target.value);
      } else {
        removeCategoryLinedUp(e.target.value);
      }
    }
  };

  console.log("stateinsidecategories", state.categories);
  return (
    <Container>
      <h1>Step 2: Choose Categories</h1>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          {Object.keys(allCategories).map((filters, index) => {
            return (
              <form key={index}>
                <FilterName>{filters.toUpperCase()}</FilterName>
                <Divider />
                <FilterOptionContainer>
                  {allCategories[filters].map((filter, index) => {
                    return (
                      <FilterOption key={index}>
                        <input
                          type={filters === "type" ? "radio" : "checkbox"}
                          name={filters === "type" ? "type" : filters}
                          id={filter}
                          value={filter}
                          //   checked={state.categories.some((category) => {
                          //     return category === filter;
                          //   })}
                          onChange={(e) => {
                            handleOnChange(e);
                          }}
                        ></input>
                        <LabelStyle for={filter}>{filter}</LabelStyle>
                      </FilterOption>
                    );
                  })}
                </FilterOptionContainer>
              </form>
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
  flex-direction: row;
  flex-wrap: wrap;
  /* max-height: calc(500px - 0.75 * 30vw); */
  /* max-width: 100%; */
  height: 100%;
  width: 100%;
`;

const FilterOption = styled.div`
  margin: 3px 5px;
`;

const LabelStyle = styled.label`
  margin-left: 3px;
`;

export default Step2Categories;
