import { cn } from "@/lib/utils";
import { isValidMove } from "@/utils/sudokuGenerator";
import { useState, useEffect } from "react";

interface SudokuBoardProps {
  grid: number[][];
  initialGrid: number[][];
  selectedCell: [number, number] | null;
  onCellSelect: (row: number, col: number) => void;
}

const SudokuBoard = ({
  grid,
  initialGrid,
  selectedCell,
  onCellSelect,
}: SudokuBoardProps) => {
  const [completedRows, setCompletedRows] = useState<number[]>([]);
  const [completedCols, setCompletedCols] = useState<number[]>([]);
  const [completedBoxes, setCompletedBoxes] = useState<string[]>([]);

  const isInitialCell = (row: number, col: number) => initialGrid[row][col] !== 0;
  const isSelected = (row: number, col: number) =>
    selectedCell?.[0] === row && selectedCell?.[1] === col;
  const isInvalid = (row: number, col: number) => {
    const value = grid[row][col];
    return value !== 0 && !isValidMove(grid, row, col, value);
  };

  const isRowComplete = (row: number) => {
    const rowValues = new Set(grid[row]);
    return rowValues.size === 9 && !rowValues.has(0);
  };

  const isColumnComplete = (col: number) => {
    const colValues = new Set(grid.map(row => row[col]));
    return colValues.size === 9 && !colValues.has(0);
  };

  const isBoxComplete = (row: number, col: number) => {
    const boxStartRow = Math.floor(row / 3) * 3;
    const boxStartCol = Math.floor(col / 3) * 3;
    const boxValues = new Set();
    
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        boxValues.add(grid[boxStartRow + i][boxStartCol + j]);
      }
    }
    
    return boxValues.size === 9 && !boxValues.has(0);
  };

  useEffect(() => {
    let timer: number;

    const checkCompletions = () => {
      // Clear any existing highlights first
      setCompletedRows([]);
      setCompletedCols([]);
      setCompletedBoxes([]);

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

      // Only update states if there are new completions
      if (newCompletedRows.length > 0 || newCompletedCols.length > 0 || newCompletedBoxes.length > 0) {
        setCompletedRows(newCompletedRows);
        setCompletedCols(newCompletedCols);
        setCompletedBoxes(newCompletedBoxes);

        // Clear highlights after 1 second
        timer = window.setTimeout(() => {
          setCompletedRows([]);
          setCompletedCols([]);
          setCompletedBoxes([]);
        }, 1000);
      }
    };

    checkCompletions();

    // Cleanup function to clear any existing timer and highlights
    return () => {
      if (timer) {
        window.clearTimeout(timer);
      }
      setCompletedRows([]);
      setCompletedCols([]);
      setCompletedBoxes([]);
    };
  }, [grid]);

  return (
    <div className="grid grid-cols-9 gap-0 max-w-[500px] mx-auto border-2 border-sudoku-border-bold">
      {grid.map((row, rowIndex) =>
        row.map((cell, colIndex) => (
          <button
            key={`${rowIndex}-${colIndex}`}
            className={cn(
              "w-[40px] h-[40px] sm:w-[55px] sm:h-[55px] flex items-center justify-center",
              "border border-sudoku-border text-lg font-medium transition-colors",
              "focus:outline-none focus:ring-2 focus:ring-primary",
              isInitialCell(rowIndex, colIndex)
                ? "font-bold"
                : "text-primary hover:bg-sudoku-cell-highlight",
              isSelected(rowIndex, colIndex) && "bg-sudoku-cell-selected",
              isInvalid(rowIndex, colIndex) && "bg-sudoku-cell-error",
              completedRows.includes(rowIndex) && "bg-sudoku-complete-row transition-colors duration-1000",
              completedCols.includes(colIndex) && "bg-sudoku-complete-col transition-colors duration-1000",
              completedBoxes.includes(`${Math.floor(rowIndex/3)*3}-${Math.floor(colIndex/3)*3}`) && 
                "bg-sudoku-complete-box transition-colors duration-1000",
              colIndex % 3 === 2 && "border-r-2 border-r-sudoku-border-bold",
              rowIndex % 3 === 2 && "border-b-2 border-b-sudoku-border-bold"
            )}
            onClick={() => onCellSelect(rowIndex, colIndex)}
            disabled={isInitialCell(rowIndex, colIndex)}
          >
            {cell !== 0 ? cell : ""}
          </button>
        ))
      )}
    </div>
  );
};

export default SudokuBoard;