import { StartGameAction, OpenCellAction, ClickMineAction, FlagMineAction, QuestionCellAction, NormalizeCellAction, IncrementTimerAction, ReducerState, ReducerActions, Context } from './model/interface'

//액션 타입들
export const StartGame = 'StartGame' as const;
export const OpenCell = 'OpenCell' as const;
export const ClickMine = 'ClickMine' as const;
export const FlagCell = 'FlagCell' as const;
export const QuestionCell = 'QuestionCell' as const;
export const NormalizeCell = 'NormalizeCell' as const;
export const IncrementTimer = 'IncrementTimer' as const;
// as const로 묶어줄 수 있음

export const startGame = (row: number, cell: number, mine: number): StartGameAction => {
  return { type: StartGame, row, cell, mine }
};

export const openCell = (row: number, cell: number): OpenCellAction => {
  return { type: OpenCell, row, cell }
};

export const clickMine = (row: number, cell: number): ClickMineAction => {
  return { type: ClickMine, row, cell }
};

export const flagMine = (row: number, cell: number): FlagMineAction => {
  return { type: FlagCell, row, cell }
};

export const questionCell = (row: number, cell: number): QuestionCellAction => {
  return { type: QuestionCell, row, cell }
};

export const normalizeCell = (row: number, cell: number): NormalizeCellAction => {
  return { type: NormalizeCell, row, cell }
};

export const incrementTimer = (): IncrementTimerAction => {
  return { type: IncrementTimer }
};