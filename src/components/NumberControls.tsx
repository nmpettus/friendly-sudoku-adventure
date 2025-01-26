import { Button } from "@/components/ui/button";

interface NumberControlsProps {
  onNumberSelect: (number: number) => void;
  completedNumbers: number[];
}

const NumberControls = ({ onNumberSelect, completedNumbers }: NumberControlsProps) => {
  return (
    <div className="flex justify-center gap-1 sm:gap-2 mb-4">
      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((number) => (
        <Button
          key={number}
          onClick={() => onNumberSelect(number)}
          variant="outline"
          className="h-8 w-8 sm:h-12 sm:w-12 text-base sm:text-xl font-semibold p-0"
          disabled={completedNumbers.includes(number)}
        >
          {number}
        </Button>
      ))}
    </div>
  );
};

export default NumberControls;