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

  const getButtonColor = (difficulty: Difficulty) => {
    switch(difficulty) {
      case 'easy':
        return 'bg-green-100 hover:bg-green-200';
      case 'medium':
        return 'bg-yellow-100 hover:bg-yellow-200';
      case 'hard':
        return 'bg-red-100 hover:bg-red-200';
      default:
        return '';
    }
  };

  return (
    <div className="flex gap-2">
      {difficulties.map((difficulty) => (
        <Button
          key={difficulty}
          onClick={() => onSelectDifficulty(difficulty)}
          variant="outline"
          className={cn(
            "capitalize",
            getButtonColor(difficulty),
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