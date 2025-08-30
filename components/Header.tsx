
import React from 'react';
import { ChefHatIcon } from './icons/ChefHatIcon';
import { FridgeIcon } from './icons/FridgeIcon';

export const Header: React.FC = () => {
  return (
    <header className="bg-[#1a1a1a]/80 backdrop-blur-sm border-b border-gray-800 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-center sm:justify-start">
        <div className="flex items-center space-x-3">
          <div className="flex -space-x-2">
            <ChefHatIcon className="h-8 w-8 text-white" />
            <FridgeIcon className="h-8 w-8 text-[#ff6b35]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white">FridgeChef</h1>
            <p className="text-xs text-[#b3b3b3]">Cook with what you have</p>
          </div>
        </div>
      </div>
    </header>
  );
};
