import * as React from 'react';
import { useEffect, useReducer, useMemo, Dispatch } from 'react';

// 값에 해당하는 코드를 정리
/*
💀: -7
😶: -1
❓︎: -2
🚩: -3
❓︎💀: -4
🚩💀: -5
👉️💀: -6
📂: 0
*/
export const CODE = {
  MINE: -7,
  NORMAL: -1,
  QUESTION: -2,
  FLAG: -3,
  QUESTION_MINE: -4,
  FLAG_MINE: -5,
  CLICKED_MINE: -6,
  OPENED: 0, //0 이상이라면 다 opened
} as const;

interface ReducerState {
  // 2차원 배열
  tableData: number[][],
  data: {
    row: number,
    cell: number,
    mine: number,
  }
  timer: number,
  result: string,
  halted: boolean,
  openedCount: number,
}

const initialState: ReducerState = {
  tableData: [],
  data: {
    row: 0,
    cell: 0,
    mine: 0,
  },
  timer: 0,
  result: '',
  halted: true,
  openedCount: 0
}

// 지뢰를 심는 함수
const plantMine = (row: number, cell: number, mine: number) => {
  const candidate = Array(row * cell).fill(undefined).map((arr, i) => i);
}