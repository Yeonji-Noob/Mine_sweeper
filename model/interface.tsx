import { ClickMine, FlagCell, IncrementTimer, NormalizeCell, OpenCell, QuestionCell, StartGame } from "../MineSearch";
import { Dispatch } from "react";


//---------------------게임 Action 모음---------------------//

//게임시작
export interface StartGameAction {
  type: typeof StartGame,
  row: number,
  cell: number,
  mine: number,
}

//칸 클릭
export interface OpenCellAction {
  type: typeof OpenCell,
  row: number,
  cell: number,
}

//지뢰클릭
export interface ClickMineAction {
  type: typeof ClickMine,
  row: number,
  cell: number,
}

//깃발
export interface FlagMineAction {
  type: typeof FlagCell,
  row: number,
  cell: number,
}

//물음표
export interface QuestionCellAction {
  type: typeof QuestionCell,
  row: number,
  cell: number,
}

// 물음표or깃발칸 정상으로 돌리기
export interface NormalizeCellAction {
  type: typeof NormalizeCell,
  row: number,
  cell: number,
}

// 타이머 올리기
export interface IncrementTimerAction {
  type: typeof IncrementTimer,
}

// 7가지 액션을 모아서 type alias
// reducer에 한번에 넣기 위함
export type ReducerActions = StartGameAction | OpenCellAction | ClickMineAction | FlagMineAction | QuestionCellAction | NormalizeCellAction | IncrementTimerAction;

//----------------------------------------------------------//

// reduce 인터페이스
export interface ReducerState {
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

//----------------------------------------------------------//

// contextApi 인터페이스

export interface Context {
  tableData: number[][],
  halted: boolean,
  dispatch: Dispatch<ReducerActions>,
}