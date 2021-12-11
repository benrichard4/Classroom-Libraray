import React from "react";
import styled from "styled-components";
import LoadingSpinner from "../LoadingSpinner";

const ClassListSummary = ({ classState }) => {
  return (
    <SummaryTable>
      <tr>
        <th>First Name</th>
        <th>Last Name</th>
        <th>Username</th>
        <th>Password</th>
      </tr>
      {classState.loading === "loading" || classState.classList === null ? (
        <LoadingSpinner style={{ marginTop: "50px" }} />
      ) : (
        classState.classList.map((student, index) => {
          return (
            <React.Fragment key={index}>
              <SummaryTableRow>
                <SummaryTableData>{student.givenName}</SummaryTableData>
                <SummaryTableData>{student.surname}</SummaryTableData>
                <SummaryTableData>{student.username}</SummaryTableData>
                <SummaryTableData>{student.password}</SummaryTableData>
              </SummaryTableRow>
            </React.Fragment>
          );
        })
      )}
    </SummaryTable>
  );
};

const SummaryTable = styled.table`
  width: 95%;
  /* height: 90%; */
  margin: 0 auto;
  border: 1px solid silver;
`;

const SummaryTableRow = styled.tr`
  &:nth-child(odd) {
    background-color: silver;
  }
`;

const SummaryTableData = styled.td`
  /* border: 1px solid blue; */
  padding: 5px 0;
  text-align: center;
`;
export default ClassListSummary;
