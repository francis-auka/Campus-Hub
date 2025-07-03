
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Task } from "@/utils/taskDataFetcher";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";

export const usePaymentActions = () => {
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleOpenPaymentModal = (task: Task) => {
    if (!user) {
      toast({
        title: "Login required",
        description: "You need to be logged in to make a payment",
        variant: "destructive",
      });
      navigate("/login", { state: { from: "/browse" } });
      return;
    }

    // Check if this is the user's own task
    if (task.user.id === user.id) {
      toast({
        title: "Cannot pay yourself",
        description: "This is your own task posting",
        variant: "destructive",
      });
      return;
    }

    // Check if task status is appropriate for payment
    if (task.status !== "in progress") {
      toast({
        title: "Payment not available",
        description: "This task is not currently in progress",
        variant: "destructive",
      });
      return;
    }

    setSelectedTask(task);
    setIsPaymentModalOpen(true);
  };

  const handlePaymentComplete = () => {
    toast({
      title: "Payment initiated",
      description: "Your payment is being processed. Check your M-Pesa for confirmation.",
    });
    
    // Redirect to payments page to see status
    setTimeout(() => {
      navigate("/payments");
    }, 1500);
  };

  return {
    isPaymentModalOpen,
    selectedTask,
    setIsPaymentModalOpen,
    setSelectedTask,
    handleOpenPaymentModal,
    handlePaymentComplete,
  };
};
