import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { completeTask } from "@/utils/taskDataFetcher";

interface CompleteTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  hustleId: string;
  hustleTitle: string;
  onComplete: () => void;
}

const CompleteTaskModal = ({
  isOpen,
  onClose,
  hustleId,
  hustleTitle,
  onComplete,
}: CompleteTaskModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleCompleteTask = async () => {
    try {
      setIsSubmitting(true);
      
      const { success, error } = await completeTask(hustleId);
      
      if (!success) throw new Error(error || "Failed to complete task");
      
      toast({
        title: "Task completed",
        description: "The task has been marked as complete",
      });
      
      onComplete();
      onClose();
    } catch (error) {
      console.error("Error completing task:", error);
      toast({
        title: "Error",
        description: "Failed to complete task. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Complete Task</DialogTitle>
          <DialogDescription>
            Are you sure you want to mark this task as complete?
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <p className="text-sm text-gray-700">
            Task: <span className="font-medium">{hustleTitle}</span>
          </p>
          <p className="text-xs text-gray-500 mt-2">
            This action will close the task and remove it from the active listings.
            The task will be automatically removed from the database after 6 hours.
          </p>
        </div>
        
        <DialogFooter className="flex space-x-2 sm:justify-between">
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleCompleteTask} disabled={isSubmitting}>
            {isSubmitting ? (
              <span className="flex items-center">
                <div className="h-4 w-4 mr-2 animate-spin rounded-full border-b-2 border-white"></div>
                Completing...
              </span>
            ) : (
              "Complete Task"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CompleteTaskModal;
