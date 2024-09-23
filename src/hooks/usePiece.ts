import { useState } from 'react';
import { TETROMINOES, randomTetromino } from '../utils/tetrominoes';

export const usePiece = (board: string[][]) => {
  const initialPiece = randomTetromino();
  
  const [piece, setPiece] = useState(initialPiece.piece);
  const [type, setType] = useState<keyof typeof TETROMINOES>(initialPiece.type);
  const [position, setPosition] = useState({ x: 3, y: 0 });
  const [rotation, setRotation] = useState(0);

  const isColliding = (newPosition: { x: number, y: number }, newPiece: string[][], board: string[][]) => {
    for (let y = 0; y < newPiece.length; y++) {
      for (let x = 0; x < newPiece[y].length; x++) {
        if (newPiece[y][x] !== '0') {
          const newX = newPosition.x + x;
          const newY = newPosition.y + y;
  
          if (newX < 0 || newX >= board[0].length || newY >= board.length) {
            return true;
          }
  
          if (board[newY][newX] !== '0') {
            return true;
          }
        }
      }
    }
    return false;
  };
  


  // 블록을 이동시키는 함수
  const movePiece = (dir: { x: number; y: number }) => {
    const newPosition = { x: position.x + dir.x, y: position.y + dir.y };
    if (!isColliding(newPosition, piece, board)) {
      setPosition(newPosition);
    }
  };

  const rotatePieceCW = () => {
    const newRotation = (rotation + 1) % TETROMINOES[type].length;
    const newPiece = TETROMINOES[type][newRotation];
    if (!isColliding(position, newPiece, board)) {
      setRotation(newRotation);
      setPiece(newPiece);
    }
  };

  const rotatePieceCCW = () => {
    const newRotation = (rotation - 1 + TETROMINOES[type].length) % TETROMINOES[type].length;
    const newPiece = TETROMINOES[type][newRotation];
    if (!isColliding(position, newPiece, board)) {
      setRotation(newRotation);
      setPiece(newPiece);
    }
  };

  const rotatePiece180 = () => {
    const newRotation = (rotation + 2) % TETROMINOES[type].length;
    const newPiece = TETROMINOES[type][newRotation];
    if (!isColliding(position, newPiece, board)) {
      setRotation(newRotation);
      setPiece(newPiece);
    }
  };
  
  const resetPiece = () => {
    // save the current piece to the board
    for (let y = 0; y < piece.length; y++) {
      for (let x = 0; x < piece[y].length; x++) {
        if (piece[y][x] !== '0') {
          board[position.y + y][position.x + x] = piece[y][x];
        }
      }
    }

    const newTetromino = randomTetromino();
    setType(newTetromino.type);
    setPiece(newTetromino.piece);
    setPosition({ x: 3, y: 0 });
    setRotation(0);
  };

  return { piece, position, isColliding, movePiece, rotatePieceCW, rotatePieceCCW, rotatePiece180, resetPiece };
};
