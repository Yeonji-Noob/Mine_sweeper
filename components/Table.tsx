import * as React from 'react';
//props로 넘기는 대신에 useContext를 사용함
import { useContext } from 'react';
import styled from 'styled-components';
import { TableContext } from './MineSearch';
import Tr from './Tr';



const Table = () => {
  const { tableData } = useContext(TableContext);
  return (
    <table>
      <tbody>
        {Array(tableData.length).fill(null).map((tr, i) => <Tr key={i} rowIndex={i} />)}
      </tbody>
    </table>
  );
}

export default Table;

