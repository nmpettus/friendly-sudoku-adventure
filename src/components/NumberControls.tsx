import { Button } from "@/components/ui/button";

interface NumberControlsProps {
  onNumberSelect: (number: number) => void;
}

const NumberControls = ({ onNumberSelect }: NumberControlsProps) => {
  return (
    <div className="flex justify-center gap-2 mb-6">
      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((number) => (
        <Button
          key={number}
          onClick={() => onNumberSelect(number)}
          variant="outline"
          className="h-12 w-12 text-xl font-semibold"
        >
          {number}
        </Button>
      ))}
    </div>
  );
};

export default NumberControls;