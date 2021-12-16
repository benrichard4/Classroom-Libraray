import React, { useEffect, useState } from "react";
import styled from "styled-components";

//component for displaying the categories side bar in the library browser with callapsable types
const CategoriesSideBarCollapsable = ({
  setAddFilter,
  setRemoveFilter,
  state,
  currentTeacher,
}) => {
  const [allCategories, setAllCategories] = useState({});
  const [counter, setCounter] = useState(0);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    //for each category, fetch the information and save it to state
    if (currentTeacher) {
      currentTeacher.categories.forEach((category) => {
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
  }, [currentTeacher]);

  //keep the loading true until all of the categories have been loaded, also sets the open state to an array of falses, length of all categories.
  useEffect(() => {
    if (currentTeacher && allCategories) {
      if (counter === currentTeacher.categories.length) {
        setLoading(false);
        let arraySet = [];
        for (let i = 1; i <= Object.keys(allCategories).length; i++) {
          arraySet.push(false);
        }
        setOpen(arraySet);
      }
    }
  }, [counter, allCategories]);

  //add or remove categories depending on what was selected
  const handleOnChange = (e) => {
    if (e.target.checked) {
      setAddFilter(e.target.value);
    } else {
      setRemoveFilter(e.target.value);
    }
  };

  //handles the toggle to open or close category div
  const handleToggle = (e, index) => {
    e.preventDefault();
    let newOpen = [...open];
    if (open[index] !== index) {
      newOpen[index] = index;
      setOpen(newOpen);
    } else {
      newOpen[index] = "closed";
      setOpen(newOpen);
    }
  };

  return (
    loading === false &&
    allCategories && (
      <Container>
        {Object.keys(allCategories).map((filters, index) => {
          return (
            <FormStyle key={index}>
              <FilterNameDiv
                onClick={(e) => {
                  handleToggle(e, index);
                }}
              >
                <FilterName>
                  {filters.replace(/([a-z])([A-Z])/g, "$1 $2").toUpperCase()}
                </FilterName>
                <UpDownArrow>{open[index] === index ? "▲" : "▼"}</UpDownArrow>
              </FilterNameDiv>
              <Divider />
              <FilterOptionContainer
                myindex={index === 0}
                className={open[index] === index ? `open` : `closed`}
              >
                {allCategories[filters].map((filter, index) => {
                  return (
                    <FilterOption key={index}>
                      <input
                        style={{ cursor: "pointer" }}
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
  width: 95%;
  position: relative;
  margin: 0 auto;
`;

const FormStyle = styled.form`
  margin-top: 10px;
  box-shadow: 0 0 5px 2px lightblue inset;
  border-radius: 2px;
  padding: 10px;
`;

const FilterNameDiv = styled.button`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  width: 100%;
  background-color: transparent;
  border: none;
  cursor: pointer;
`;

const FilterName = styled.p`
  font-family: "Cambria", serif;

  text-align: left;
  margin-top: 5px;
  font-size: calc(12px + 0.3vw);
`;

const UpDownArrow = styled.p`
  height: 15px;
  color: silver;
  font-size: 14px;
  margin-right: 3px;
`;

const Divider = styled.hr`
  margin: 0 auto;
`;
const FilterOptionContainer = styled.div`
  margin: 5px 5px 10px 5px;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  align-content: flex-start;
  gap: 2px 15px;
  min-height: ${({ myindex }) => (myindex ? "50px" : "100px")};
  max-width: 98%;
  height: 100%;
  width: 100%;

  &.open {
    display: block;
  }
  &.closed {
    display: none;
  }
`;

const FilterOption = styled.div`
  margin: 3px 5px;
  &:hover {
    color: rgb(168, 82, 132);
  }
`;

const LabelStyle = styled.label`
  margin-left: 3px;
  font-size: calc(12px + 0.3vw);
  cursor: pointer;
`;

export default CategoriesSideBarCollapsable;
