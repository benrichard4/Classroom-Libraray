import React, { useState } from "react";
import styled from "styled-components";

//component for setting the qty availbale to teh students in the library
const Step3Quantity = ({ setQuantityLinedUp, stateQty }) => {
  const [qty, setQty] = useState(1);
  const values = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  return (
    <div>
      <SubTitle> Step 3: Select Quantity Available in Library</SubTitle>
      <FormDiv>
        <SearchForm
          onSubmit={(e) => {
            e.preventDefault();
            setQuantityLinedUp(qty ? qty : stateQty);
          }}
        >
          <div>
            <SelectStyle
              value={qty}
              onChange={(e) => {
                setQty(e.target.value);
              }}
              // defaultValue={stateQty ? stateQty : 1}
            >
              {values.map((value1, index) => {
                return (
                  <option key={index} value={value1}>
                    {value1}
                  </option>
                );
              })}
            </SelectStyle>
          </div>
          <Button type="submit">Submit</Button>
        </SearchForm>
      </FormDiv>
    </div>
  );
};

const FormDiv = styled.div``;

const SubTitle = styled.h2`
  margin-top: 10px;
`;

const SearchForm = styled.form`
  margin: 20px 15px 20px 15px;
  display: flex;
`;

const SelectStyle = styled.select`
  padding: 5px 2px;
  margin-left: 15px;
  margin-top: 20px;
`;

const Button = styled.button`
  padding: 5px 15px;
  margin-top: 20px;
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

export default Step3Quantity;
