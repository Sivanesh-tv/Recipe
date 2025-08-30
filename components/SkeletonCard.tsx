
import React from 'react';

export const SkeletonCard: React.FC = () => {
  return (
    <div className="bg-[#1a1a1a] border border-gray-800 rounded-lg overflow-hidden animate-pulse">
      <div className="bg-gray-700 h-48 w-full"></div>
      <div className="p-4">
        <div className="flex gap-2 mb-4">
          <div className="h-5 bg-gray-700 rounded-full w-20"></div>
          <div className="h-5 bg-gray-700 rounded-full w-16"></div>
          <div className="h-5 bg-gray-700 rounded-full w-24"></div>
        </div>
        <div className="h-2 bg-gray-700 rounded-full w-full mb-2"></div>
        <div className="h-3 bg-gray-700 rounded w-1/2 mb-4"></div>
        <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
        <div className="h-3 bg-gray-700 rounded w-full mb-4"></div>
        <div className="h-10 bg-gray-700 rounded-lg w-full mt-2"></div>
      </div>
    </div>
  );
};
