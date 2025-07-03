
import { useState } from "react";
import { Task } from "@/utils/hustleDataFetcher";

export const useBrowseTaskActions = (loadTasks: () => Promise<void>) => {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isCompleteTaskModalOpen, setIsCompleteTaskModalOpen] = useState(false);

  const handleMarkTaskComplete = (task: Task) => {
    setSelectedTask(task);
    setIsCompleteTaskModalOpen(true);
  };

  const handleTaskCompleted = () => {
    loadTasks();
  };

  return {
    selectedTask,
    isCompleteTaskModalOpen,
    setSelectedTask,
    setIsCompleteTaskModalOpen,
    handleMarkTaskComplete,
    handleTaskCompleted
  };
};
