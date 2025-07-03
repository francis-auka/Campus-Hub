
import { Button } from "@/components/ui/button";
import { Task } from "@/utils/taskDataFetcher";
import { CreditCard, SmartphoneCharging } from "lucide-react";

interface PayNowButtonProps {
  task: Task;
  onPayNow: (task: Task) => void;
  disabled?: boolean;
}

const PayNowButton = ({ task, onPayNow, disabled = false }: PayNowButtonProps) => {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onPayNow(task);
  };

  return (
    <Button
      variant="outline"
      size="sm"
      className="bg-green-50 text-green-600 border-green-200 hover:bg-green-100 hover:text-green-700 transition-all duration-200 transform hover:scale-105"
      onClick={handleClick}
      disabled={disabled}
    >
      <SmartphoneCharging className="h-4 w-4 mr-1" /> Pay Now
    </Button>
  );
};

export default PayNowButton;
