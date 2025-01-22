import { useState, useCallback } from "react";
import { generateSudoku } from "@/utils/sudokuGenerator";
import SudokuBoard from "@/components/SudokuBoard";
import NumberControls from "@/components/NumberControls";
import DifficultySelector from "@/components/DifficultySelector";
import { Button } from "@/components/ui/button";
import { RefreshCw, HelpCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

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
        <h1 className="text-3xl font-bold text-center mb-4">Sudoku</h1>
        
        <div className="flex justify-center items-center gap-4 mb-6">
          <DifficultySelector
            selectedDifficulty={difficulty}
            onSelectDifficulty={handleDifficultyChange}
          />
          <Button
            onClick={handleNewGame}
            variant="outline"
            size="icon"
            className="w-10 h-10 bg-purple-100 hover:bg-purple-200"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button 
                variant="outline" 
                className="gap-2 bg-blue-100 hover:bg-blue-200"
              >
                <HelpCircle className="h-4 w-4" />
                How to Play
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>How to Play Sudoku</DialogTitle>
                <DialogDescription className="space-y-4 pt-4">
                  <div>
                    <h3 className="font-semibold mb-2">Basic Rules:</h3>
                    <p>Fill in the grid so that every row, column, and 3x3 box contains the numbers 1-9 without repeating.</p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-2">How to Play:</h3>
                    <ol className="list-decimal list-inside space-y-2">
                      <li>Click on any empty cell you want to fill</li>
                      <li>Select a number from the number pad above the grid</li>
                      <li>Continue until you complete the puzzle</li>
                      <li>Click a red square again to erase a wrong number</li>
                    </ol>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-2">Visual Feedback:</h3>
                    <ul className="list-disc list-inside space-y-2">
                      <li>Red background: Wrong number placement</li>
                      <li>Light green highlight: Completed row</li>
                      <li>Light purple highlight: Completed column</li>
                      <li>Light yellow highlight: Completed 3x3 box</li>
                    </ul>
                  </div>
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </div>

        <NumberControls onNumberSelect={handleNumberSelect} />
        
        <SudokuBoard
          grid={grid}
          initialGrid={initialGrid}
          selectedCell={selectedCell}
          onCellSelect={handleCellSelect}
          setGrid={setGrid}
        />
      </div>
    </div>
  );
};

export default Index;