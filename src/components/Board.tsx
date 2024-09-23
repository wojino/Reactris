import React, { useEffect, useCallback } from 'react';
import { useBoard } from '../hooks/useBoard';
import { usePiece } from '../hooks/usePiece';
import './Board.css';

function Board() {
  const { board, updateBoard } = useBoard();
  const { piece, position, isColliding, movePiece, rotatePieceCW, rotatePieceCCW, rotatePiece180, resetPiece } = usePiece(board);

  const renderPieceOnBoard = useCallback(() => {
    const newBoard = board.map(row => [...row]);
    piece.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value !== '0') {
          newBoard[position.y + y][position.x + x] = value;
					console.log(position.y + y, position.x + x, value);
        }
      });
    });
    return newBoard;
  }, [board, piece, position]);

  const clearLines = useCallback(() => {
    const newBoard = board.filter(row => row.some(cell => cell === '0'));
    const clearedLines = 20 - newBoard.length;
    const emptyRows = Array.from({ length: clearedLines }, () => Array(10).fill('0'));
    updateBoard([...emptyRows, ...newBoard]);
  }, [board, updateBoard]);

  const lockPiece = useCallback(() => {
    const newBoard = renderPieceOnBoard();
    updateBoard(newBoard);
    resetPiece();
    clearLines();
  }, [renderPieceOnBoard, updateBoard, resetPiece, clearLines]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowLeft':
          movePiece({ x: -1, y: 0 });
          break;

        case 'ArrowRight':
          movePiece({ x: 1, y: 0 });
          break;

        case 'ArrowDown':
          if (isColliding({ x: position.x, y: position.y + 1 }, piece, board)) {
            lockPiece();
          } else {
            movePiece({ x: 0, y: 1 });
          }
          break;

        case 'ArrowUp':
        case 'x':
        case 'X':
          rotatePieceCW();
          break;

        case 'Control':
        case 'z':
        case 'Z':
          rotatePieceCCW();
          break;

        case 'a':
        case 'A':
          rotatePiece180();
          break;

				case ' ':
					// while (!isColliding({ x: position.x, y: position.y + 1 }, piece, board)) {
					// 	movePiece({ x: 0, y: 1 });
					// }
					// lockPiece();
					break;
					
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [movePiece, rotatePieceCW, rotatePieceCCW, rotatePiece180, lockPiece, isColliding, piece, board, position]);

  const updatedBoard = renderPieceOnBoard();

  return (
    <div className="board-container">
      <div className="board">
        {updatedBoard.map((row, y) =>
          row.map((cell, x) => (
            <div key={`${x}-${y}`} className={`cell ${cell === '0' ? 'empty' : cell}`} />
          ))
        )}
      </div>
    </div>
  );
}

export default Board;
