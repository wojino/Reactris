import React, { useEffect, useCallback, useState } from "react";
import useBoard from "../hooks/useBoard";
import usePiece from "../hooks/usePiece";
import "./Board.css";
import TETROMINOES from "../utils/tetrominoes";

function Board() {
  const { board, updateBoard } = useBoard();
  const {
    piece,
    position,
    holdPiece,
    isColliding,
    movePiece,
    rotatePieceCW,
    rotatePieceCCW,
    rotatePiece180,
    resetPiece,
    holdCurrentPiece,
    setCanHold,
  } = usePiece(board);
  const [isHardDrop, setIsHardDrop] = useState(false);

  const renderPieceOnBoard = useCallback(() => {
    const newBoard = board.map((row) => [...row]);
    piece.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value !== "0") {
          newBoard[position.y + y][position.x + x] = value;
        }
      });
    });
    return newBoard;
  }, [board, piece, position]);

  const renderHoldBoard = useCallback(() => {
    const grid = Array(4)
      .fill(null)
      .map(() => Array(4).fill("0"));
    if (!holdPiece) {
      return grid;
    }

    const pieceShape = TETROMINOES[holdPiece][0];
    for (let y = 0; y < pieceShape.length; y += 1) {
      for (let x = 0; x < pieceShape[y].length; x += 1) {
        console.log(y, x);
        grid[y][x] = pieceShape[y][x];
      }
    }

    return grid;
  }, [holdPiece]);

  const clearLines = useCallback(() => {
    const newBoard = board.filter((row) => row.some((cell) => cell === "0"));
    const clearedLines = 20 - newBoard.length;
    const emptyRows = Array.from({ length: clearedLines }, () =>
      Array(10).fill("0"),
    );
    updateBoard([...emptyRows, ...newBoard]);
  }, [board, updateBoard]);

  const savePiece = useCallback(() => {
    for (let y = 0; y < piece.length; y += 1) {
      for (let x = 0; x < piece[y].length; x += 1) {
        if (piece[y][x] !== "0") {
          board[position.y + y][position.x + x] = piece[y][x];
        }
      }
    }
  }, [board, piece, position]);

  const lockPiece = useCallback(() => {
    const newBoard = renderPieceOnBoard();
    updateBoard(newBoard);
    savePiece();
    resetPiece();
    setCanHold(true);
    clearLines();
  }, [
    renderPieceOnBoard,
    updateBoard,
    savePiece,
    resetPiece,
    clearLines,
    setCanHold,
  ]);

  const calculateDropDistance = useCallback(() => {
    let dropDistance = 0;
    while (
      !isColliding({ x: position.x, y: position.y + dropDistance + 1 }, piece)
    ) {
      dropDistance += 1;
    }
    return dropDistance;
  }, [isColliding, position, piece, board]);

  useEffect(() => {
    if (isHardDrop) {
      lockPiece();
      setIsHardDrop(false);
    }
  }, [isHardDrop, lockPiece]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case "ArrowLeft":
          movePiece({ x: -1, y: 0 });
          break;

        case "ArrowRight":
          movePiece({ x: 1, y: 0 });
          break;

        case "ArrowDown":
          if (isColliding({ x: position.x, y: position.y + 1 }, piece)) {
            lockPiece();
          } else {
            movePiece({ x: 0, y: 1 });
          }
          break;

        case "ArrowUp":
        case "x":
        case "X":
          rotatePieceCW();
          break;

        case "Control":
        case "z":
        case "Z":
          rotatePieceCCW();
          break;

        case "a":
        case "A":
          rotatePiece180();
          break;

        case "c":
        case "C":
          holdCurrentPiece();
          break;

        case " ":
          movePiece({ x: 0, y: calculateDropDistance() });
          setIsHardDrop(true);
          break;

        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    movePiece,
    rotatePieceCW,
    rotatePieceCCW,
    rotatePiece180,
    lockPiece,
    isColliding,
    piece,
    board,
    position,
    calculateDropDistance,
    resetPiece,
    holdCurrentPiece,
  ]);

  const updatedBoard = renderPieceOnBoard();
  const holdBoard = renderHoldBoard();

  return (
    <div className="game-container">
      <div className="board-container">
        <div className="board">
          {updatedBoard.map((row, y) =>
            row.map((cell, x) => (
              <div
                key={JSON.stringify([x, y])}
                className={`cell ${cell === "0" ? "empty" : cell}`}
              />
            )),
          )}
        </div>
      </div>

      <div className="hold-container">
        <div className="hold">
          {holdBoard.map((row, y) =>
            row.map((cell, x) => (
              <div
                key={JSON.stringify([x, y])}
                className={`cell ${cell === "0" ? "empty" : cell}`}
              />
            )),
          )}
        </div>
      </div>
    </div>
  );
}

export default Board;
