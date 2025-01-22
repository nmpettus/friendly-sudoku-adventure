import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Difficulty = 'easy' | 'medium' | 'hard';

interface DifficultySelectorProps {
  selectedDifficulty: Difficulty;
  onSelectDifficulty: (difficulty: Difficulty) => void;
}

const DifficultySelector = ({
  selectedDifficulty,
  onSelectDifficulty,
}: DifficultySelectorProps) => {
  const difficulties: Difficulty[] = ['easy', 'medium', 'hard'];

  return (
    <div className="flex gap-2 justify-center mb-6">
      {difficulties.map((difficulty) => (
        <Button
          key={difficulty}
          onClick={() => onSelectDifficulty(difficulty)}
          variant="outline"
          className={cn(
            "capitalize",
            selectedDifficulty === difficulty && "bg-primary text-primary-foreground"
          )}
        >
          {difficulty}
        </Button>
      ))}
    </div>
  );
};

export default DifficultySelector;