import React, { useState } from "react";
import styled from "styled-components";

const Step3Quantity = ({ setQuantityLinedUp, stateQty }) => {
  const [qty, setQty] = useState(null);
  const values = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  return (
    <div>
      <h2> Step 3: Select Quantity Available in Library</h2>
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
              defaultValue={stateQty ? stateQty : 1}
            >
              {values.map((value1) => {
                return (
                  <option value={value1} defaultValue={stateQty ? stateQty : 1}>
                    {value1}
                  </option>
                );
              })}
            </SelectStyle>
          </div>
          <button type="submit">Submit</button>
        </SearchForm>
      </FormDiv>
    </div>
  );
};

const FormDiv = styled.div`
  /* border: 2px solid pink; */
`;

const SearchForm = styled.form`
  margin: 20px 15px 20px 15px;
  display: flex;
  /* border: 2px solid green; */
  /* justify-content: center; */
`;

const SelectStyle = styled.select`
  padding: 5px 2px;
`;

export default Step3Quantity;
