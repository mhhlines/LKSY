'use client';

import { List } from '@/shared/types';

type TagFilterProps = {
  lists: List[];
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
};

export function TagFilter({ lists, selectedTags, onTagsChange }: TagFilterProps) {
  const allTags = Array.from(new Set(lists.flatMap((list) => list.tags))).sort();

  const handleTagClick = (tag: string) => {
    if (selectedTags.includes(tag)) {
      onTagsChange(selectedTags.filter((t) => t !== tag));
    } else {
      onTagsChange([...selectedTags, tag]);
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {allTags.map((tag) => (
        <button
          key={tag}
          onClick={() => handleTagClick(tag)}
          className={`px-3 py-1 rounded-full text-sm transition-colors ${
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



