import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

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

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

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
        timer = setTimeout(() => {
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
        clearTimeout(timer);
      }
      setCompletedRows([]);
      setCompletedCols([]);
      setCompletedBoxes([]);
    };
  }, [grid]);

  return (
    <div className="grid grid-cols-9 gap-0.5 bg-gray-300 p-0.5 max-w-[500px] mx-auto">
      {grid.map((row, rowIndex) =>
        row.map((cell, colIndex) => {
          const isInitial = initialGrid[rowIndex][colIndex] !== 0;
          const isSelected = selectedCell?.[0] === rowIndex && selectedCell?.[1] === colIndex;
          const isHighlightedRow = completedRows.includes(rowIndex);
          const isHighlightedCol = completedCols.includes(colIndex);
          const isHighlightedBox = completedBoxes.includes(getBoxCoords(rowIndex, colIndex));

          return (
            <button
              key={`${rowIndex}-${colIndex}`}
              className={cn(
                "aspect-square flex items-center justify-center text-sm sm:text-lg font-semibold transition-colors",
                "focus:outline-none focus:ring-2 focus:ring-blue-500",
                isInitial ? "bg-gray-100 text-gray-900" : "bg-white text-blue-600",
                isSelected && "bg-blue-100",
                isHighlightedRow && "bg-[#F2FCE2]",
                isHighlightedCol && "bg-[#E5DEFF]",
                isHighlightedBox && "bg-[#FEF7CD]",
                (colIndex + 1) % 3 === 0 && colIndex < 8 && "border-r-2 border-gray-400",
                (rowIndex + 1) % 3 === 0 && rowIndex < 8 && "border-b-2 border-gray-400"
              )}
              onClick={() => onCellSelect(rowIndex, colIndex)}
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