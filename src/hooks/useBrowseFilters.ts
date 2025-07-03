
import { useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { FilterOptions } from "@/components/browse/FilterBar";

export const useBrowseFilters = (
  filterTasks: (taskList: any[], options: FilterOptions) => void,
  tasks: any[],
  setFilteredTasks: (tasks: any[]) => void,
  loadTasks: () => Promise<void>,
  loadError: string | null
) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    searchTerm: "",
    category: "",
    maxPrice: "",
    status: ""
  });

  const handleApplyFilters = useCallback((options: FilterOptions) => {
    setFilterOptions(options);
    filterTasks(tasks, options);
    
    const params = new URLSearchParams();
    if (options.category && options.category !== "all") {
      params.set("category", options.category);
    }
    if (options.maxPrice) {
      params.set("maxPrice", options.maxPrice);
    }
    if (options.searchTerm) {
      params.set("search", options.searchTerm);
    }
    if (options.status && options.status !== "all") {
      params.set("status", options.status);
    }
    
    setSearchParams(params);
  }, [filterTasks, tasks, setSearchParams]);

  const handleResetFilters = useCallback(() => {
    setFilterOptions({
      searchTerm: "",
      category: "",
      maxPrice: "",
      status: ""
    });
    setFilteredTasks(tasks);
    setSearchParams({});
    
    if (loadError) {
      loadTasks();
    }
  }, [setFilteredTasks, tasks, setSearchParams, loadError, loadTasks]);

  return {
    filterOptions,
    handleApplyFilters,
    handleResetFilters
  };
};
