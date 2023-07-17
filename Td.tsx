import * as React from 'react';
import { Dispatch, FC, useContext, memo, useCallback } from 'react';
import { TableContext, CODE } from './MineSearch';

import { TdProps, RealTdProps, Codes } from './model/interface';
import { clickMine, flagMine, normalizeCell, openCell, questionCell } from './action';

const getTdStyle = (code: Codes) => {
  switch (code) {
    case CODE.NORMAL:
    case CODE.MINE:
      return {
        background: '#444',
      };
    case CODE.CLICKED_MINE:
    case CODE.OPENED:
      return {
        background: 'white',
      };
    case CODE.QUESTION_MINE:
    case CODE.QUESTION:
      return {
        background: 'yellow',
      };
    case CODE.FLAG_MINE:
    case CODE.FLAG:
      return {
        background: 'red',
      };
    default:
      return {
        background: 'white',
      };
  }
};

const getTdText = (code: Codes) => {
  console.log('getTdtext');
  switch (code) {
    case CODE.NORMAL:
      return '';
    case CODE.MINE:
      return 'X';
    case CODE.CLICKED_MINE:
      return '펑';
    case CODE.FLAG_MINE:
    case CODE.FLAG:
      return '!';
    case CODE.QUESTION_MINE:
    case CODE.QUESTION:
      return '?';
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
    <td
      style={getTdStyle(data)}
      onClick={onClickTd}
      onContextMenu={onRightClickTd}
    >{getTdText(data)}</td>
  )
});

export default memo(Td);