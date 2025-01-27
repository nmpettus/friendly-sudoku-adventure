import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface SudokuBoardProps {
  grid: number[][];
  initialGrid: number[][];
  selectedCell: [number, number] | null;
  onCellSelect: (row: number, col: number) => void;
  setGrid: (grid: number[][]) => void;
}

const SudokuBoard = ({
  grid,
  initialGrid,
  selectedCell,
  onCellSelect,
  setGrid,
}: SudokuBoardProps) => {
  const [completedRows, setCompletedRows] = useState<number[]>([]);
  const [completedCols, setCompletedCols] = useState<number[]>([]);
  const [completedBoxes, setCompletedBoxes] = useState<string[]>([]);
  const [wrongPlacements, setWrongPlacements] = useState<string[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);

  const isRowComplete = (row: number) => {
    const numbers = new Set(grid[row].filter(n => n !== 0));
    return numbers.size === 9;
  };

  const isColumnComplete = (col: number) => {
    const numbers = new Set(grid.map(row => row[col]).filter(n => n !== 0));
    return numbers.size === 9;
  };

  const isBoxComplete = (startRow: number, startCol: number) => {
    const numbers = new Set();
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        const num = grid[startRow + i][startCol + j];
        if (num !== 0) numbers.add(num);
      }
    }
    return numbers.size === 9;
  };

  const getBoxCoords = (row: number, col: number) => {
    return `${Math.floor(row / 3) * 3}-${Math.floor(col / 3) * 3}`;
  };

  const isValidPlacement = (row: number, col: number, value: number): boolean => {
    // Check row
    for (let i = 0; i < 9; i++) {
      if (i !== col && grid[row][i] === value) return false;
    }
    
    // Check column
    for (let i = 0; i < 9; i++) {
      if (i !== row && grid[i][col] === value) return false;
    }
    
    // Check 3x3 box
    const boxRow = Math.floor(row / 3) * 3;
    const boxCol = Math.floor(col / 3) * 3;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (boxRow + i !== row || boxCol + j !== col) {
          if (grid[boxRow + i][boxCol + j] === value) return false;
        }
      }
    }
    
    return true;
  };

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    const checkCompletions = () => {
      setCompletedRows([]);
      setCompletedCols([]);
      setCompletedBoxes([]);

      // Check for wrong placements
      const newWrongPlacements: string[] = [];
      grid.forEach((row, rowIndex) => {
        row.forEach((value, colIndex) => {
          if (value !== 0 && !isValidPlacement(rowIndex, colIndex, value)) {
            newWrongPlacements.push(`${rowIndex}-${colIndex}`);
          }
        });
      });
      setWrongPlacements(newWrongPlacements);

      // Check if all cells are filled and valid
      const allFilled = grid.every(row => row.every(cell => cell !== 0));
      const allValid = newWrongPlacements.length === 0;
      setIsCompleted(allFilled && allValid);

      // Check for newly completed rows
      const newCompletedRows = Array.from({ length: 9 }, (_, i) => i)
        .filter(row => isRowComplete(row));
      
      // Check for newly completed columns
      const newCompletedCols = Array.from({ length: 9 }, (_, i) => i)
        .filter(col => isColumnComplete(col));
      
      // Check for newly completed boxes
      const newCompletedBoxes = [];
      for (let row = 0; row < 9; row += 3) {
        for (let col = 0; col < 9; col += 3) {
          if (isBoxComplete(row, col)) {
            newCompletedBoxes.push(`${row}-${col}`);
          }
        }
      }

      if (newCompletedRows.length > 0 || newCompletedCols.length > 0 || newCompletedBoxes.length > 0) {
        setCompletedRows(newCompletedRows);
        setCompletedCols(newCompletedCols);
        setCompletedBoxes(newCompletedBoxes);

        timer = setTimeout(() => {
          setCompletedRows([]);
          setCompletedCols([]);
          setCompletedBoxes([]);
        }, 1000);
      }
    };

    checkCompletions();

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
      setCompletedRows([]);
      setCompletedCols([]);
      setCompletedBoxes([]);
    };
  }, [grid]);

  const handleCellClick = (row: number, col: number) => {
    if (initialGrid[row][col] !== 0) return;
    
    // If the cell is wrong and clicked again, clear it
    if (wrongPlacements.includes(`${row}-${col}`)) {
      const newGrid = grid.map(r => [...r]);
      newGrid[row][col] = 0;
      setGrid(newGrid);
      return;
    }
    
    onCellSelect(row, col);
  };

  return (
    <div className="grid grid-cols-9 gap-0.5 bg-gray-300 p-0.5 max-w-[500px] mx-auto">
      {grid.map((row, rowIndex) =>
        row.map((cell, colIndex) => {
          const isInitial = initialGrid[rowIndex][colIndex] !== 0;
          const isSelected = selectedCell?.[0] === rowIndex && selectedCell?.[1] === colIndex;
          const isHighlightedRow = completedRows.includes(rowIndex);
          const isHighlightedCol = completedCols.includes(colIndex);
          const isHighlightedBox = completedBoxes.includes(getBoxCoords(rowIndex, colIndex));
          const isWrong = wrongPlacements.includes(`${rowIndex}-${colIndex}`);

          return (
            <button
              key={`${rowIndex}-${colIndex}`}
              className={cn(
                "aspect-square flex items-center justify-center text-sm sm:text-lg font-semibold transition-colors",
                "focus:outline-none focus:ring-2 focus:ring-blue-500",
                isInitial ? "bg-gray-100 text-gray-900" : "bg-white text-blue-600",
                isSelected && "bg-blue-100",
                isWrong && "bg-red-100",
                !isWrong && isHighlightedRow && "bg-[#F2FCE2] animate-bloom",
                !isWrong && isHighlightedCol && "bg-[#E5DEFF] animate-bloom",
                !isWrong && isHighlightedBox && "bg-[#FEF7CD] animate-bloom",
                isCompleted && "bg-[#FEF7CD]",
                (colIndex + 1) % 3 === 0 && colIndex < 8 && "border-r-2 border-gray-400",
                (rowIndex + 1) % 3 === 0 && rowIndex < 8 && "border-b-2 border-gray-400"
              )}
              onClick={() => handleCellClick(rowIndex, colIndex)}
              disabled={isInitial}
            >
              {cell !== 0 ? cell : ""}
            </button>
          );
        })
      )}
    </div>
  );
};

export default SudokuBoard;
