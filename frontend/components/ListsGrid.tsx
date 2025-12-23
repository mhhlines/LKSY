'use client';

import { List } from '@/shared/types';
import Link from 'next/link';
import { format } from 'date-fns';

type ListsGridProps = {
  lists: List[];
};

export function ListsGrid({ lists }: ListsGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {lists.map((list) => (
        <Link
          key={list.id}
          href={`/lists/${list.id}`}
          className="block p-6 border rounded-lg hover:shadow-lg transition-shadow"
        >
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-xl font-semibold">{list.name}</h3>
            <span className="text-sm text-gray-500">v{list.version}</span>
          </div>
          <p className="text-gray-600 mb-4 line-clamp-2">{list.description}</p>
          <div className="flex flex-wrap gap-2 mb-4">
            {list.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
              >
                {tag}
              </span>
            ))}
          </div>
          <div className="text-sm text-gray-500">
            {list.type === 'checks' && 'checks' in list && (
              <span>{list.checks.length} checks</span>
            )}
            {list.last_updated && (
              <span className="ml-2">
                Updated {format(new Date(list.last_updated), 'MMM d, yyyy')}
              </span>
            )}
          </div>
        </Link>
      ))}
    </div>
  );
}

