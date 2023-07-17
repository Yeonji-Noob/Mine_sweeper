import * as React from 'react';
import styled from 'styled-components';

const BaseTable = () => {

  return (
    <Table>
      <tbody>
        {Array(9).fill(null).map((tr, rowIndex) => (
          <tr key={rowIndex}>
            {Array(9).fill(null).map((td, columnIndex) => (
              <TD key={columnIndex}></TD>
            ))}
          </tr>
        ))}
      </tbody>
    </Table>
  )

};

export default BaseTable;


const Table = styled.table`
  display: absolute;
  z-index: 1;
`;

const TD = styled.td`
  border: 2px outset #8ae0d8;
  width: 18px;
  height: 18px;
  position: relative;
  text-align: center;
  z-index: 1;
`;