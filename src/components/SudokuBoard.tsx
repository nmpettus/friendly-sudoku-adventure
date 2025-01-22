import { cn } from "@/lib/utils";
import { isValidMove } from "@/utils/sudokuGenerator";

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
  const isInitialCell = (row: number, col: number) => initialGrid[row][col] !== 0;
  const isSelected = (row: number, col: number) =>
    selectedCell?.[0] === row && selectedCell?.[1] === col;
  const isInvalid = (row: number, col: number) => {
    const value = grid[row][col];
    return value !== 0 && !isValidMove(grid, row, col, value);
  };

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