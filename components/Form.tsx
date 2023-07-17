import * as React from 'react';
import { TableContext } from './MineSearch';
import { startGame } from './action';
import { useState, useCallback, useContext, memo } from 'react';
import styled from 'styled-components';


const Form = ({ result, halted }: { result: string, halted: boolean }) => {

  const [row, setRow] = useState(9);
  const [cell, setCell] = useState(9);
  const [mine, setMine] = useState(10);
  const { dispatch } = useContext(TableContext);

  const onChangeRow = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setRow(Number(e.target.value));
  }, []);

  const onChangeCell = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setCell(Number(e.target.value));
  }, []);

  const onChangeMine = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setMine(Number(e.target.value));
  }, []);

  const onClickBtn = useCallback(() => {
    dispatch(startGame(row, cell, mine));
  }, [row, cell, mine]);

  return (
    <div>
      <input type="number" placeholder='세로' value={row} onChange={onChangeRow} style={{ display: 'none' }} />
      <input type="number" placeholder='가로' value={cell} onChange={onChangeCell} style={{ display: 'none' }} />
      <input type="number" placeholder='지뢰' value={mine} onChange={onChangeMine} style={{ display: 'none' }} />
      <Button onClick={onClickBtn}>
        {halted === false || result === '' ? '😊' : result}
      </Button>

    </div>
  );
}

export default Form;


const Button = styled.button`
  width: auto;
  height: 40px;
  position: relative;
  left: 50%;
  transform: translateX(-50%);
  font-size: 28px;
  text-align: center;
  border: 0px;
  background-color: transparent;
  cursor: pointer;
`;

const Emoji = styled.div`

  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  font-size: 28px;
  border: 0;
  background-color: transparent;
`;