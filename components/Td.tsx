import * as React from 'react';
import { Dispatch, FC, useContext, memo, useCallback } from 'react';
import { TableContext, CODE } from './MineSearch';
import styled from 'styled-components';
import { TdProps, RealTdProps, Codes } from '../model/interface';
import { clickMine, flagMine, normalizeCell, openCell, questionCell } from './action';



const getTdStyle = (code: Codes) => {
  switch (code) {
    case CODE.NORMAL:
    case CODE.MINE:
      return {
        background: '#75C1BA',
      };
    case CODE.CLICKED_MINE:
      return {
        background: 'red',
      };
    case CODE.OPENED:
      return {
        background: '#60a19b',
      };
    case CODE.QUESTION_MINE:
    case CODE.QUESTION:
      return {
        background: '#75C1BA',
      };
    case CODE.FLAG_MINE:
    case CODE.FLAG:
      return {
        background: '#75C1BA',
      };
    default:
      return {
        background: '#60a19b',
      };
  }
};

const getTdText = (code: Codes) => {
  console.log('getTdtext');
  switch (code) {
    case CODE.NORMAL:
      return '';
    case CODE.MINE:
      return '';
    case CODE.CLICKED_MINE:
      return '💣️';
    case CODE.FLAG_MINE:
    case CODE.FLAG:
      return '❗';
    case CODE.QUESTION_MINE:
    case CODE.QUESTION:
      return '❔';
    default:
      return code || '';
  }
};

const Td: FC<TdProps> = ({ rowIndex, cellIndex }) => {
  const { tableData, dispatch, halted } = React.useContext(TableContext);

  const onClickTd = useCallback(() => {
    if (halted) {
      return;
    }
    switch (tableData[rowIndex][cellIndex]) {
      case CODE.OPENED:
      case CODE.FLAG_MINE:
      case CODE.FLAG:
      case CODE.QUESTION_MINE:
      case CODE.QUESTION:
        return;
      case CODE.NORMAL:
        dispatch(openCell(rowIndex, cellIndex));
        return;
      case CODE.MINE:
        dispatch(clickMine(rowIndex, cellIndex));
        return;
      default:
        return;
    }
  }, [tableData[rowIndex][cellIndex], halted]);


  //마우스 우클릭 이벤트
  const onRightClickTd = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    if (halted) {
      return;
    }
    switch (tableData[rowIndex][cellIndex]) {
      case CODE.NORMAL:
      case CODE.MINE:
        dispatch(flagMine(rowIndex, cellIndex));
        return;
      case CODE.FLAG_MINE:
      case CODE.FLAG:
        dispatch(questionCell(rowIndex, cellIndex));
        return;
      case CODE.QUESTION_MINE:
      case CODE.QUESTION:
        dispatch(normalizeCell(rowIndex, cellIndex));
        return;
      default:
        return;
    }
  }, [tableData[rowIndex][cellIndex], halted]);


  return (
    <RealTd
      onClickTd={onClickTd}
      onRightClickTd={onRightClickTd}
      data={tableData[rowIndex][cellIndex]}
    />
  );

};

const RealTd: FC<RealTdProps> = memo(({ onClickTd, onRightClickTd, data }) => {
  // console.log('real td rendered');
  return (
    <TD
      style={getTdStyle(data)}
      onClick={onClickTd}
      onContextMenu={onRightClickTd}
    >{getTdText(data)}
    </TD>
  )
});

export default memo(Td);

const TD = styled.td`
  border: 2px outset #8ae0d8;
  width: 18px;
  height: 18px;
  position: relative;
  text-align: center;
  cursor: pointer;
  z-index: 20;
  font-size: 12px;
  font-weight: 600;
`;