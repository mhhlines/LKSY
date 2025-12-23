'use client';

import { List } from '@/shared/types';
import { useState } from 'react';

type TagFilterProps = {
  lists: List[];
};

export function TagFilter({ lists }: TagFilterProps) {
  const allTags = Array.from(new Set(lists.flatMap((list) => list.tags))).sort();
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  return (
    <div className="flex flex-wrap gap-2">
      {allTags.slice(0, 10).map((tag) => (
        <button
          key={tag}
          onClick={() => {
            setSelectedTags((prev) =>
              prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
            );
          }}
          className={`px-3 py-1 rounded-full text-sm ${
            selectedTags.includes(tag)
              ? 'bg-primary-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          {tag}
        </button>
      ))}
    </div>
  );
}

