
import { Loader2 } from "lucide-react";

const LoadingView = () => {
  return (
    <div className="text-center py-8 sm:py-12">
      <div className="flex flex-col items-center justify-center">
        <Loader2 className="h-8 w-8 sm:h-10 sm:w-10 animate-spin text-primary" />
        <p className="mt-3 text-gray-500">Loading tasks...</p>
        <p className="text-xs text-gray-400 mt-1">This may take a moment</p>
      </div>
    </div>
  );
};

export default LoadingView;
