import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { CurrentUserContext } from ".././context/CurrentUserContext";

const CategoriesSideBar = ({ setAddFilter, setRemoveFilter, state }) => {
  const [allCategories, setAllCategories] = useState({});
  const [counter, setCounter] = useState(0);
  const [loading, setLoading] = useState(true);
  const { userState } = useContext(CurrentUserContext);

  useEffect(() => {
    //for each category, fetch the information and save it to state
    console.log("USERSTATE", userState);
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
    // if (e.target.value === "Fiction") {
    //   if (
    //     state.selectedFilters.find((category) => {
    //       return category === "Non-Fiction";
    //     })
    //   ) {
    //     setAddFilter(e.target.value);
    //     setRemoveFilter("Non-Fiction");
    //   } else {
    //     setAddFilter(e.target.value);
    //   }
    // } else if (e.target.value === "Non-Fiction") {
    //   if (
    //     state.selectedFilters.find((category) => {
    //       return category === "Fiction";
    //     })
    //   ) {
    //     setAddFilter(e.target.value);
    //     setRemoveFilter("Fiction");
    //   } else {
    //     setAddFilter(e.target.value);
    //   }
    // } else {
    if (e.target.checked) {
      setAddFilter(e.target.value);
    } else {
      setRemoveFilter(e.target.value);
    }
    // }
  };

  return (
    loading === false && (
      <Container>
        {Object.keys(allCategories).map((filters, index) => {
          return (
            <FormStyle key={index}>
              <FilterName>
                {filters.replace(/([a-z])([A-Z])/g, "$1 $2").toUpperCase()}
              </FilterName>
              <Divider />
              <FilterOptionContainer myindex={index === 0}>
                {allCategories[filters].map((filter, index) => {
                  return (
                    <FilterOption key={index}>
                      <input
                        type="checkbox"
                        name={filters === "type" ? "type" : filters}
                        id={filter}
                        value={filter}
                        checked={
                          state.selectedFilters.length === 0
                            ? false
                            : state.selectedFilters.find((category) => {
                                return category === filter;
                              })
                        }
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
          );
        })}
      </Container>
    )
  );
};

const Container = styled.div`
  /* border: 1px solid red; */
  width: 95%;
  position: relative;
  margin: 0 auto;
`;

const FormStyle = styled.form`
  margin-top: 10px;
  box-shadow: 0 0 5px 1px silver inset;
  border-radius: 2px;
  padding: 10px;
`;

const FilterName = styled.p`
  margin-top: 5px;
  font-size: 14px;
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
  max-height: calc(600px - 0.75 * 30vw);
  min-height: ${({ myindex }) => (myindex ? "50px" : "100px")};
  max-width: 98%;
  height: 100%;
  width: 100%;
  /* border: 1px solid pink; */
`;

const FilterOption = styled.div`
  margin: 3px 5px;
  font-size: 15px;
`;

const LabelStyle = styled.label`
  margin-left: 3px;
`;

const CompleteCategoriesButton = styled.button`
  padding: 10px;
  cursor: pointer;

  top: 0;
`;

export default CategoriesSideBar;
