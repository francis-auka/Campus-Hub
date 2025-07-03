
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Task, sendInitialMessage } from "@/utils/taskDataFetcher";
import { useToast } from "@/hooks/use-toast";

export const useBrowseChatActions = () => {
  const [isChatDialogOpen, setIsChatDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isSubmittingMessage, setIsSubmittingMessage] = useState(false);
  
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleOpenChatDialog = (task: Task, userId: string | undefined) => {
    if (!userId) {
      toast({
        title: "Login required",
        description: "You need to be logged in to send messages",
        variant: "destructive",
      });
      return;
    }

    if (task.user.id === userId) {
      toast({
        title: "Can't message yourself",
        description: "This is your own task posting",
        variant: "destructive",
      });
      return;
    }

    setSelectedTask(task);
    setIsChatDialogOpen(true);
  };

  const handleSendInitialMessage = async (message: string, userId: string | undefined) => {
    if (!userId || !selectedTask) {
      toast({
        title: "Error",
        description: "You must be logged in to send a message",
        variant: "destructive",
      });
      return;
    }

    setIsSubmittingMessage(true);
    try {
      const { success, error } = await sendInitialMessage(
        selectedTask.id,
        userId,
        selectedTask.user.id,
        message
      );

      if (!success) {
        toast({
          title: "Error",
          description: error || "Failed to send message",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Message sent",
        description: "Your message has been sent to the task poster",
      });

      setIsChatDialogOpen(false);
      navigate('/messages');
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmittingMessage(false);
    }
  };

  return {
    isChatDialogOpen,
    selectedTask,
    isSubmittingMessage,
    setIsChatDialogOpen,
    setSelectedTask,
    handleOpenChatDialog,
    handleSendInitialMessage
  };
};
