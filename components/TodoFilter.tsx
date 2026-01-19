'use client';

import { FilterType } from '@/types/todo';

interface TodoFilterProps {
  currentFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  stats: {
    total: number;
    active: number;
    completed: number;
  };
}

export default function TodoFilter({
  currentFilter,
  onFilterChange,
  stats,
}: TodoFilterProps) {
  const filters: { value: FilterType; label: string; count: number }[] = [
    { value: 'all', label: '全て', count: stats.total },
    { value: 'active', label: '進行中', count: stats.active },
    { value: 'completed', label: '完了', count: stats.completed },
  ];

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {filters.map(({ value, label, count }) => (
        <button
          key={value}
          onClick={() => onFilterChange(value)}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            currentFilter === value
              ? 'bg-blue-500 text-white shadow-md'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
          }`}
        >
          {label}
          <span
            className={`ml-2 text-sm ${
              currentFilter === value
                ? 'text-blue-100'
                : 'text-gray-500 dark:text-gray-400'
            }`}
          >
            ({count})
          </span>
        </button>
      ))}
    </div>
  );
}
