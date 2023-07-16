import * as React from 'react';
import { useEffect, useReducer, createContext, useMemo, Dispatch } from 'react';

//interface들을 불러오기
import { StartGameAction, OpenCellAction, ClickMineAction, FlagMineAction, QuestionCellAction, NormalizeCellAction, IncrementTimerAction, ReducerState, ReducerActions, Context } from './model/interface'


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
const plantMine = (row: number, cell: number, mine: number) => {

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
  const data = [];
  for (let i = 0; i < row; i++) {
    const rowData: number[] = [];
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


//액션 타입들

export const StartGame = 'StartGame' as const;
export const OpenCell = 'OpenCell' as const;
export const ClickMine = 'ClickMine' as const;
export const FlagCell = 'FlagCell' as const;
export const QuestionCell = 'QuestionCell' as const;
export const NormalizeCell = 'NormalizeCell' as const;
export const IncrementTimer = 'IncrementTimer' as const;

// as const로 묶어줄 수 있음



const startGame = (row: number, cell: number, mine: number): StartGameAction => {
  return { type: StartGame, row, cell, mine }
};

const openCell = (row: number, cell: number): OpenCellAction => {
  return { type: OpenCell, row, cell }
};

const clickMine = (row: number, cell: number): ClickMineAction => {
  return { type: ClickMine, row, cell }
};

const flagCell = (row: number, cell: number): FlagMineAction => {
  return { type: FlagCell, row, cell }
};

const questionCell = (row: number, cell: number): QuestionCellAction => {
  return { type: QuestionCell, row, cell }
};

const normalizeCell = (row: number, cell: number): NormalizeCellAction => {
  return { type: NormalizeCell, row, cell }
};

const incrementTimer = (): IncrementTimerAction => {
  return { type: IncrementTimer }
};


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

    // case OpenCell:

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
      <Form />
      <div>{timer}</div>
      <Table />
      <div>{result}</div>
    </TableContext.Provider>
  );
}

export default MineSearch;