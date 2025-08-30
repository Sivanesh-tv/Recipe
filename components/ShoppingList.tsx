import React from 'react';
import type { ShoppingListItem } from '../types';
import { TrashIcon } from './icons/TrashIcon';
import { ShoppingCartIcon } from './icons/ShoppingCartIcon';
import { XIcon } from './icons/XIcon';

interface ShoppingListProps {
  items: ShoppingListItem[];
  onRemove: (id: number) => void;
  onClear: () => void;
}

export const ShoppingList: React.FC<ShoppingListProps> = ({ items, onRemove, onClear }) => {
  const groupedItems = items.reduce((acc, item) => {
    const aisle = item.aisle || 'Other';
    if (!acc[aisle]) {
      acc[aisle] = [];
    }
    acc[aisle].push(item);
    return acc;
  }, {} as Record<string, ShoppingListItem[]>);

  const sortedAisles = Object.keys(groupedItems).sort();

  return (
    <div className="bg-[#1a1a1a] p-6 rounded-lg border border-gray-800 h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <ShoppingCartIcon className="w-6 h-6 text-[#ff6b35]" />
          Shopping List
        </h2>
        {items.length > 0 && (
          <button onClick={onClear} className="text-sm text-gray-400 hover:text-[#ff6b35] flex items-center gap-1 transition-colors">
            <TrashIcon className="w-4 h-4" />
            Clear All
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="text-center py-10 text-gray-500 flex-grow flex flex-col items-center justify-center">
            <ShoppingCartIcon className="w-20 h-20 mx-auto mb-4 text-gray-700" />
            <p className="font-semibold">Your shopping list is empty</p>
            <p className="text-sm">Add missing ingredients from recipes.</p>
        </div>
      ) : (
        <div className="overflow-y-auto flex-grow -mr-3 pr-3 space-y-4">
          {sortedAisles.map(aisle => (
            <div key={aisle}>
              <h3 className="font-semibold text-sm text-gray-400 border-b border-gray-700 pb-1 mb-2 capitalize">{aisle}</h3>
              <ul className="space-y-1">
                {groupedItems[aisle].map(item => (
                  <li key={item.id} className="flex items-center justify-between text-sm text-gray-300 bg-[#262626] p-2 rounded-md group">
                    <span className="flex-1">{item.original}</span>
                    <button onClick={() => onRemove(item.id)} className="opacity-0 group-hover:opacity-100 transition-opacity" aria-label={`Remove ${item.name}`}>
                      <XIcon className="w-4 h-4 text-gray-500 hover:text-white"/>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
