import { useState, useEffect } from "react";
import { TETROMINOES } from "../utils/tetrominoes";

const generate7Bag = () => {
  const tetrominoKeys = Object.keys(TETROMINOES) as Array<
    keyof typeof TETROMINOES
  >;
  const bag = [...tetrominoKeys];
  for (let i = bag.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [bag[i], bag[j]] = [bag[j], bag[i]];
  }
  return bag;
};

export const usePiece = (board: string[][]) => {
  const [currentBag, setCurrentBag] = useState(generate7Bag());
  const [bagIndex, setBagIndex] = useState(0);

  const [piece, setPiece] = useState(TETROMINOES[currentBag[0]][0]);
  const [type, setType] = useState(currentBag[0]);
  const [position, setPosition] = useState({ x: 3, y: 0 });
  const [rotation, setRotation] = useState(0);

  const [holdPiece, setHoldPiece] = useState<keyof typeof TETROMINOES | null>(
    null,
  );
  const [canHold, setCanHold] = useState(true);

  const isColliding = (
    newPosition: { x: number; y: number },
    newPiece: string[][],
    board: string[][],
  ) => {
    for (let y = 0; y < newPiece.length; y++) {
      for (let x = 0; x < newPiece[y].length; x++) {
        if (newPiece[y][x] !== "0") {
          const newX = newPosition.x + x;
          const newY = newPosition.y + y;

          if (newX < 0 || newX >= board[0].length || newY >= board.length) {
            return true;
          }

          if (board[newY][newX] !== "0") {
            return true;
          }
        }
      }
    }
    return false;
  };

  const getNextTetromino = () => {
    setBagIndex((prevIndex) => {
      const nextIndex = prevIndex + 1;

      if (nextIndex >= currentBag.length) {
        const newBag = generate7Bag();
        setCurrentBag(newBag);
        setBagIndex(0);
        return 0;
      }
      return nextIndex;
    });
  };

  useEffect(() => {
    const nextTetromino = currentBag[bagIndex];
    setType(nextTetromino);
    setPiece(TETROMINOES[nextTetromino][0]);
    setPosition({ x: 3, y: 0 });
    setRotation(0);
  }, [bagIndex, currentBag]);

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
    const newRotation =
      (rotation - 1 + TETROMINOES[type].length) % TETROMINOES[type].length;
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

  const savePiece = () => {
    for (let y = 0; y < piece.length; y++) {
      for (let x = 0; x < piece[y].length; x++) {
        if (piece[y][x] !== "0") {
          board[position.y + y][position.x + x] = piece[y][x];
        }
      }
    }
  };

  const resetPiece = () => {
    getNextTetromino();
  };

  const holdCurrentPiece = () => {
    if (!canHold) return;

    if (holdPiece === null) {
      setHoldPiece(type);
      resetPiece();
    } else {
      const temp = holdPiece;
      setHoldPiece(type);
      setType(temp);
      setPiece(TETROMINOES[temp][0]);
      setPosition({ x: 3, y: 0 });
      setRotation(0);
    }
    setCanHold(false);
  };

  return {
    piece,
    position,
    isColliding,
    movePiece,
    rotatePieceCW,
    rotatePieceCCW,
    rotatePiece180,
    savePiece,
    resetPiece,
    holdCurrentPiece,
    holdPiece,
    setCanHold,
  };
};
