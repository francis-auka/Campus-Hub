
import { useState } from "react";
import { Task, submitBid } from "@/utils/taskDataFetcher";
import { useToast } from "@/hooks/use-toast";

export const useBrowseBidActions = (
  tasks: Task[], 
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>, 
  filteredTasks: Task[], 
  setFilteredTasks: React.Dispatch<React.SetStateAction<Task[]>>
) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isSubmittingBid, setIsSubmittingBid] = useState(false);
  
  const { toast } = useToast();

  const handleOpenBidDialog = (task: Task) => {
    setSelectedTask(task);
    setIsDialogOpen(true);
  };

  const handleSubmitBid = async (amount: string, message: string, userId: string | undefined, userName: string | undefined) => {
    if (!userId || !selectedTask) {
      toast({
        title: "Error",
        description: "You must be logged in to place a bid",
        variant: "destructive",
      });
      return;
    }

    if (!amount || !message) {
      toast({
        title: "Missing information",
        description: "Please provide both an amount and a message for your bid.",
        variant: "destructive",
      });
      return;
    }
    
    // Validate maximum bid amount (50)
    const numericAmount = parseInt(amount);
    if (numericAmount > 50) {
      toast({
        title: "Bid amount too high",
        description: "Maximum bid amount is KSh 50",
        variant: "destructive",
      });
      return;
    }

    setIsSubmittingBid(true);
    try {
      const { success, error } = await submitBid(
        selectedTask.id,
        userId,
        amount,
        message,
        userName || 'Anonymous User'
      );

      if (!success) {
        toast({
          title: "Error",
          description: error || "Failed to submit bid",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Bid submitted!",
        description: "Your bid has been successfully submitted.",
      });

      // Update task count in both lists
      const updatedTasks = tasks.map((task) => {
        if (task.id === selectedTask.id) {
          return { ...task, bids: task.bids + 1 };
        }
        return task;
      });
      
      setTasks(updatedTasks);
      setFilteredTasks(
        filteredTasks.map((task) => {
          if (task.id === selectedTask.id) {
            return { ...task, bids: task.bids + 1 };
          }
          return task;
        })
      );
      
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error submitting bid:", error);
      toast({
        title: "Error",
        description: "Failed to submit bid. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmittingBid(false);
    }
  };

  return {
    isDialogOpen,
    selectedTask,
    isSubmittingBid,
    setIsDialogOpen,
    setSelectedTask,
    handleOpenBidDialog,
    handleSubmitBid
  };
};
