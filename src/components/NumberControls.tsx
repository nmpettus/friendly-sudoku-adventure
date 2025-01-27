import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface NumberControlsProps {
  onNumberSelect: (number: number) => void;
  completedNumbers: number[];
}

const NumberControls = ({ onNumberSelect, completedNumbers }: NumberControlsProps) => {
  return (
    <div className="flex justify-center gap-1 sm:gap-2 mb-4">
      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((number) => (
        <div key={number} className="relative">
          <Button
            onClick={() => onNumberSelect(number)}
            variant="outline"
            className="h-8 w-8 sm:h-12 sm:w-12 text-base sm:text-xl font-semibold p-0"
            disabled={completedNumbers.includes(number)}
          >
            {number}
            {completedNumbers.includes(number) && (
              <div className="absolute inset-0 flex items-center justify-center">
                <X className="h-6 w-6 text-[#ea384c]" />
              </div>
            )}
          </Button>
        </div>
      ))}
    </div>
  );
};

export default NumberControls;