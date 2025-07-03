
import React from "react";

interface BrowseHeaderProps {
  tasksCount?: number;
}

const BrowseHeader = ({ tasksCount }: BrowseHeaderProps = {}) => {
  return (
    <>
      <h1 className="text-2xl sm:text-3xl font-bold mb-2">Browse Tasks</h1>
      <p className="text-gray-600 mb-6 sm:mb-8 text-sm sm:text-base">
        Find tasks to help with and earn money or trade skills
        {tasksCount !== undefined && tasksCount > 0 && ` (${tasksCount} tasks available)`}
      </p>
    </>
  );
};

export default BrowseHeader;
