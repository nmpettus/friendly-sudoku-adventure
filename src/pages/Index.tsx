import { useState, useCallback } from "react";
import { generateSudoku } from "@/utils/sudokuGenerator";
import SudokuBoard from "@/components/SudokuBoard";
import NumberControls from "@/components/NumberControls";
import DifficultySelector from "@/components/DifficultySelector";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

type Difficulty = 'easy' | 'medium' | 'hard';

const Index = () => {
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  const [selectedCell, setSelectedCell] = useState<[number, number] | null>(null);
  const [grid, setGrid] = useState(() => generateSudoku(difficulty));
  const [initialGrid, setInitialGrid] = useState(() => grid.map(row => [...row]));

  const handleNewGame = useCallback(() => {
    const newGrid = generateSudoku(difficulty);
    setGrid(newGrid);
    setInitialGrid(newGrid.map(row => [...row]));
    setSelectedCell(null);
  }, [difficulty]);

  const handleCellSelect = (row: number, col: number) => {
    if (initialGrid[row][col] === 0) {
      setSelectedCell([row, col]);
    }
  };

  const handleNumberSelect = (number: number) => {
    if (selectedCell) {
      const [row, col] = selectedCell;
      if (initialGrid[row][col] === 0) {
        const newGrid = grid.map(row => [...row]);
        newGrid[row][col] = number;
        setGrid(newGrid);
      }
    }
  };

  const handleDifficultyChange = (newDifficulty: Difficulty) => {
    setDifficulty(newDifficulty);
    const newGrid = generateSudoku(newDifficulty);
    setGrid(newGrid);
    setInitialGrid(newGrid.map(row => [...row]));
    setSelectedCell(null);
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Sudoku</h1>
        
        <div className="flex justify-between items-center mb-6">
          <DifficultySelector
            selectedDifficulty={difficulty}
            onSelectDifficulty={handleDifficultyChange}
          />
          <Button
            onClick={handleNewGame}
            variant="outline"
            size="icon"
            className="w-10 h-10"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>

        <SudokuBoard
          grid={grid}
          initialGrid={initialGrid}
          selectedCell={selectedCell}
          onCellSelect={handleCellSelect}
        />

        <NumberControls onNumberSelect={handleNumberSelect} />
      </div>
    </div>
  );
};

export default Index;