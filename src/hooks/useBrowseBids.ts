
import { useState } from "react";
import { Bid } from "@/types/auth";
import { Task, fetchBidsData } from "@/utils/taskDataFetcher";
import { useToast } from "@/hooks/use-toast";

export const useBrowseBids = () => {
  const [bids, setBids] = useState<Bid[]>([]);
  const [isLoadingBids, setIsLoadingBids] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isViewBidsDialogOpen, setIsViewBidsDialogOpen] = useState(false);
  
  const { toast } = useToast();

  const handleViewBids = async (task: Task, userId: string | undefined) => {
    if (!userId) return;
    
    setIsLoadingBids(true);
    setSelectedTask(task);
    setIsViewBidsDialogOpen(true);
    
    try {
      const { bids: fetchedBids, error } = await fetchBidsData(task.id);
      
      if (error) {
        toast({
          title: "Information",
          description: error,
        });
        setBids([]);
        return;
      }
      
      setBids(fetchedBids);
    } catch (error) {
      console.error("Error in handleViewBids:", error);
      toast({
        title: "Error",
        description: "Failed to load bids",
        variant: "destructive",
      });
    } finally {
      setIsLoadingBids(false);
    }
  };

  return {
    bids,
    isLoadingBids,
    selectedTask,
    isViewBidsDialogOpen,
    setSelectedTask,
    setIsViewBidsDialogOpen,
    handleViewBids
  };
};
