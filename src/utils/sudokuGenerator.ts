type Difficulty = 'easy' | 'medium' | 'hard';

export const generateSudoku = (difficulty: Difficulty): number[][] => {
  // Initialize empty 9x9 grid
  const grid: number[][] = Array(9).fill(null).map(() => Array(9).fill(0));
  
  // Fill diagonal 3x3 boxes first (these can be filled independently)
  fillDiagonalBoxes(grid);
  
  // Solve the rest of the puzzle
  solveSudoku(grid);
  
  // Remove numbers based on difficulty
  const cellsToRemove = {
    easy: 30,
    medium: 40,
    hard: 50
  }[difficulty];
  
  return removeNumbers(grid, cellsToRemove);
};

const fillDiagonalBoxes = (grid: number[][]) => {
  for (let box = 0; box < 9; box += 3) {
    fillBox(grid, box, box);
  }
};

const fillBox = (grid: number[][], row: number, col: number) => {
  const numbers = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);
  let index = 0;
  
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      grid[row + i][col + j] = numbers[index];
      index++;
    }
  }
};

const shuffle = (array: number[]): number[] => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const solveSudoku = (grid: number[][]): boolean => {
  let row = 0;
  let col = 0;
  let isEmpty = false;
  
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      if (grid[i][j] === 0) {
        row = i;
        col = j;
        isEmpty = true;
        break;
      }
    }
    if (isEmpty) break;
  }
  
  if (!isEmpty) return true;
  
  for (let num = 1; num <= 9; num++) {
    if (isSafe(grid, row, col, num)) {
      grid[row][col] = num;
      if (solveSudoku(grid)) return true;
      grid[row][col] = 0;
    }
  }
  
  return false;
};

const isSafe = (grid: number[][], row: number, col: number, num: number): boolean => {
  // Check row
  for (let x = 0; x < 9; x++) {
    if (grid[row][x] === num) return false;
  }
  
  // Check column
  for (let x = 0; x < 9; x++) {
    if (grid[x][col] === num) return false;
  }
  
  // Check 3x3 box
  const startRow = row - row % 3;
  const startCol = col - col % 3;
  
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (grid[i + startRow][j + startCol] === num) return false;
    }
  }
  
  return true;
};

const removeNumbers = (grid: number[][], count: number): number[][] => {
  const result = grid.map(row => [...row]);
  let removed = 0;
  
  while (removed < count) {
    const row = Math.floor(Math.random() * 9);
    const col = Math.floor(Math.random() * 9);
    
    if (result[row][col] !== 0) {
      result[row][col] = 0;
      removed++;
    }
  }
  
  return result;
};

export const isValidMove = (grid: number[][], row: number, col: number, num: number): boolean => {
  // Remove the number from its position first (to handle the case where we're checking the same position)
  const originalValue = grid[row][col];
  grid[row][col] = 0;
  
  const valid = isSafe(grid, row, col, num);
  
  // Restore the original value
  grid[row][col] = originalValue;
  
  return valid;
};