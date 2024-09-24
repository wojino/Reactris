import { useState } from "react";

const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;

const createBoard = () => {
  return Array.from({ length: BOARD_HEIGHT }, () =>
    Array(BOARD_WIDTH).fill("0"),
  );
};

const useBoard = () => {
  const [board, setBoard] = useState<string[][]>(createBoard());

  const updateBoard = (newBoard: string[][]) => {
    setBoard(newBoard);
  };

  const resetBoard = () => {
    setBoard(createBoard());
  };

  return { board, updateBoard, resetBoard };
};

export default useBoard;
