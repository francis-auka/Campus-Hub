
import { useState, useEffect, useCallback } from "react";
import { fetchHustlesData, Task } from "@/utils/hustleDataFetcher";
import { useToast } from "@/hooks/use-toast";
import { FilterOptions } from "@/components/browse/FilterBar";

export const useBrowseTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [hasBidsTable, setHasBidsTable] = useState(true);
  const [hasAssignedToColumn, setHasAssignedToColumn] = useState(true);
  
  const { toast } = useToast();

  const loadTasks = useCallback(async () => {
    setIsLoading(true);
    setLoadError(null);
    try {
      const { tasks, error, hasBidsTable: bidsFlag, hasAssignedToColumn: assignedFlag } = await fetchHustlesData();
      
      if (error) {
        toast({
          title: "Error",
          description: error,
          variant: "destructive",
        });
        setLoadError(error);
        setTasks([]);
        setFilteredTasks([]);
        return;
      }
      
      setHasBidsTable(bidsFlag);
      setHasAssignedToColumn(assignedFlag);
      setTasks(tasks);
      setFilteredTasks(tasks);
    } catch (error) {
      console.error("Error loading tasks:", error);
      const errorMessage = "Failed to load tasks. Please refresh the page.";
      setLoadError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const filterTasks = useCallback((taskList: Task[], options: FilterOptions) => {
    let result = [...taskList];

    if (options.searchTerm) {
      const lowercaseSearch = options.searchTerm.toLowerCase();
      result = result.filter(
        (task) =>
          task.title.toLowerCase().includes(lowercaseSearch) ||
          task.description.toLowerCase().includes(lowercaseSearch)
      );
    }

    if (options.category && options.category !== "all") {
      result = result.filter((task) => task.category === options.category);
    }

    if (options.maxPrice) {
      result = result.filter((task) => {
        if (task.offer_type !== "cash" || !task.offer_amount) return true;
        
        const offerAmount = parseInt(task.offer_amount);
        return offerAmount <= parseInt(options.maxPrice);
      });
    }

    if (options.status && options.status !== "all") {
      result = result.filter((task) => task.status === options.status);
    }

    setFilteredTasks(result);
  }, []);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  return {
    tasks,
    filteredTasks,
    isLoading,
    loadError,
    hasBidsTable,
    hasAssignedToColumn,
    loadTasks,
    filterTasks,
    setFilteredTasks
  };
};
