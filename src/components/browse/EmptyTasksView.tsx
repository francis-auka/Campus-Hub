
import { Button } from "@/components/ui/button";
import { Search, AlertCircle, RefreshCw } from "lucide-react";

interface EmptyTasksViewProps {
  onResetFilters: () => void;
  isError?: boolean;
  errorMessage?: string;
}

const EmptyTasksView = ({ 
  onResetFilters, 
  isError = false, 
  errorMessage = "There was an error loading tasks. Please try again."
}: EmptyTasksViewProps) => {
  return (
    <div className="text-center py-8 sm:py-12">
      <div className="bg-gray-50 inline-block p-4 sm:p-6 rounded-full mb-4">
        {isError ? (
          <AlertCircle className="h-8 w-8 sm:h-12 sm:w-12 text-red-500" />
        ) : (
          <Search className="h-8 w-8 sm:h-12 sm:w-12 text-gray-400" />
        )}
      </div>
      <h3 className="text-lg sm:text-xl font-semibold">
        {isError ? "Failed to load tasks" : "No tasks found"}
      </h3>
      <p className="text-gray-600 mt-2 text-sm sm:text-base">
        {isError 
          ? errorMessage
          : "Try adjusting your filters or search terms"}
      </p>
      <Button onClick={onResetFilters} variant="outline" className="mt-4 inline-flex items-center gap-2">
        {isError ? (
          <>
            <RefreshCw className="h-4 w-4" />
            Refresh Tasks
          </>
        ) : (
          "Reset All Filters"
        )}
      </Button>
    </div>
  );
};

export default EmptyTasksView;
