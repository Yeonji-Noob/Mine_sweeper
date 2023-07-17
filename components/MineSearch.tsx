import * as React from 'react';
import { useEffect, useReducer, createContext, useMemo, Dispatch } from 'react';

import styled from 'styled-components';

//interface들을 불러오기
import { ReducerState, ReducerActions, Context, Codes } from '../model/interface'
import { StartGame, OpenCell, ClickMine, FlagCell, QuestionCell, NormalizeCell, IncrementTimer } from './action';

import Form from './Form';
import Table from './Table';
import BaseTable from './BaseTable';

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


// 컴포넌트간 공유할 데이터를 작성
// contextApi로 자손을 여러번 거치지 않고 한번에 보낼 수 있음
// 만들 때는 createContext로, 쓸 때는 useContext로 사용함
export const TableContext = createContext<Context>({
  tableData: [],
  halted: true,
  dispatch: () => { },
})


const initialState: ReducerState = {
  tableData: [],
  data: {
    row: 0,
    cell: 0,
    mine: 0,
  },
  timer: 0,
  result: '',

  // 중지상태. 게임 시작시 false가 될 것임
  halted: true,

  openedCount: 0
}

// 지뢰를 심는 함수
const plantMine = (row: number, cell: number, mine: number): Codes[][] => {

  //배열 생성
  const candidate = Array(row * cell).fill(undefined).map((arr, i) => i);


  //섞기 (랜덤 순서가 들어있는 shuffle 배열 만들기)
  const shuffle = [];
  while (candidate.length > row * cell - mine) {
    // splice는 배열의 형태로 추출하기 때문에 [0]를 붙여준다
    const chosen = candidate.splice(Math.floor(Math.random() * candidate.length), 1)[0];
    shuffle.push(chosen);
  }


  // 지뢰가 아닌 칸!
  const data: Codes[][] = [];
  for (let i = 0; i < row; i++) {
    const rowData: Codes[] = [];
    data.push(rowData);
    for (let j = 0; j < cell; j++) {
      rowData.push(CODE.NORMAL);
    }
  }

  //지뢰인 칸
  for (let k = 0; k < shuffle.length; k++) {
    const ver = Math.floor(shuffle[k] / cell);
    const hor = shuffle[k] % cell;
    data[ver][hor] = CODE.MINE;
  }

  console.log(data);
  return data;

};

// 일반적으로 중괄호는 종결의 의미를 내포하고 있기 때문에 세미콜론을 안넣지만
// 함수표현식에는 끝에 세미콜론, 함수선언문에서는 쓰지 않는다.



//immer.js로 가독성을 좋게 할 수 있긴 함....

const reducer = (state = initialState, action: ReducerActions): ReducerState => {
  switch (action.type) {
    // 게임이 시작될때의 state
    case StartGame:
      return {
        ...state,
        data: {
          row: action.row,
          cell: action.cell,
          mine: action.mine,
        },
        openedCount: 0,
        tableData: plantMine(action.row, action.cell, action.mine),
        halted: false,
        timer: 0,
      };

    // 눌렀을 때 주변칸 여러개 열리는거
    case OpenCell: {
      const tableData = [...state.tableData];
      tableData.forEach((row, i) => {
        tableData[i] = [...row];
      });
      const checked: string[] = [];
      let openedCount = 0;
      console.log(tableData.length, tableData[0].length);
      const checkAround = (row: number, cell: number) => {
        console.log(row, cell);
        if (row < 0 || row >= tableData.length || cell < 0 || cell >= tableData[0].length) {
          return;
        } // 상하좌우 없는칸은 안 열기
        if (([CODE.OPENED, CODE.FLAG, CODE.FLAG_MINE, CODE.QUESTION_MINE, CODE.QUESTION] as Codes[]).includes(tableData[row][cell])) {
          return;
        } // 닫힌 칸만 열기
        if (checked.includes(row + '/' + cell)) {
          return;
        } else {
          checked.push(row + '/' + cell);
        } // 한 번 연칸은 무시하기
        let around = [
          tableData[row][cell - 1], tableData[row][cell + 1],
        ];
        if (tableData[row - 1]) {
          around = around.concat([tableData[row - 1][cell - 1], tableData[row - 1][cell], tableData[row - 1][cell + 1]]);
        }
        if (tableData[row + 1]) {
          around = around.concat([tableData[row + 1][cell - 1], tableData[row + 1][cell], tableData[row + 1][cell + 1]]);
        }
        const count = around.filter(function (v) {
          return ([CODE.MINE, CODE.FLAG_MINE, CODE.QUESTION_MINE] as Codes[]).includes(v);
        }).length as Codes;
        if (count === 0) { // 주변칸 오픈
          if (row > -1) {
            const near = [];
            if (row - 1 > -1) {
              near.push([row - 1, cell - 1]);
              near.push([row - 1, cell]);
              near.push([row - 1, cell + 1]);
            }
            near.push([row, cell - 1]);
            near.push([row, cell + 1]);
            if (row + 1 < tableData.length) {
              near.push([row + 1, cell - 1]);
              near.push([row + 1, cell]);
              near.push([row + 1, cell + 1]);
            }
            near.forEach((n) => {
              if (tableData[n[0]][n[1]] !== CODE.OPENED) {
                checkAround(n[0], n[1]);
              }
            })
          }
        }
        if (tableData[row][cell] === CODE.NORMAL) { // 내 칸이 닫힌 칸이면 카운트 증가
          openedCount += 1;
        }
        tableData[row][cell] = count;
      };

      checkAround(action.row, action.cell);

      let halted = false;
      let result = '😊';
      console.log(state.data.row * state.data.cell - state.data.mine, state.openedCount, openedCount);

      if (state.data.row * state.data.cell - state.data.mine === state.openedCount + openedCount) { // 승리
        halted = true;
        halted == true ? result = '😎' : result = '😊';
      }

      return {
        ...state,
        tableData,
        openedCount: state.openedCount + openedCount,
        halted,
        result,
      };
    }

    case ClickMine: {
      const tableData = [...state.tableData];
      tableData[action.row] = [...state.tableData[action.row]];
      tableData[action.row][action.cell] = CODE.CLICKED_MINE;
      return {
        ...state,
        tableData,
        halted: true,
      };

    }

    case FlagCell: {
      const tableData = [...state.tableData];
      tableData[action.row] = [...state.tableData[action.row]];
      tableData[action.row][action.cell] === CODE.MINE ? tableData[action.row][action.cell] = CODE.FLAG_MINE : tableData[action.row][action.cell] = CODE.FLAG;

      return {
        ...state,
        tableData,
      };
    }

    case QuestionCell: {
      const tableData = [...state.tableData];
      tableData[action.row] = [...state.tableData[action.row]];
      tableData[action.row][action.cell] === CODE.FLAG_MINE ? tableData[action.row][action.cell] = CODE.QUESTION_MINE : tableData[action.row][action.cell] = CODE.QUESTION;

      return {
        ...state,
        tableData,
      };
    }

    case NormalizeCell: {
      const tableData = [...state.tableData];
      tableData[action.row] = [...state.tableData[action.row]];
      tableData[action.row][action.cell] === CODE.QUESTION_MINE ? tableData[action.row][action.cell] = CODE.MINE : tableData[action.row][action.cell] = CODE.NORMAL;

      return {
        ...state,
        tableData,
      };
    }

    case IncrementTimer: {
      return {
        ...state,
        timer: state.timer + 1,
      };
    }

    default:
      return state;

  }
}


const MineSearch = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { tableData, halted, timer, result } = state;


  // useMemo 사용
  // useEffect(() => {}, [])랑 내부 구조 비슷함 
  // 바뀌는 값인 tableData와 halted는 배열에도 보냄
  const value = useMemo(() => ({ tableData, halted, dispatch }), [tableData, halted]);


  useEffect(() => {
    let timer: number;
    if (halted === false) {
      timer = window.setInterval(() => {
        dispatch({ type: IncrementTimer });
      }, 1000);
    }
    return () => { clearInterval(timer) };

  }, [halted]);

  return (
    <TableContext.Provider value={value}>
      <Form result={result} halted={halted} />
      <Timer>{timer}</Timer>
      <Table />
      <BaseTable />
    </TableContext.Provider>
  );
}

export default MineSearch;


const Timer = styled.div`
  text-align: right;
  font-size: 24px;
  color: red;
  padding-right: 5px;
  cursor: default;
`;