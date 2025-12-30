'use client';

import { List } from '@/shared/types';
import { useState, useMemo } from 'react';
import { SearchBar } from './SearchBar';
import { TagFilter } from './TagFilter';
import { SortSelector } from './SortSelector';
import { ListsGrid } from './ListsGrid';

type ListFiltersProps = {
  lists: List[];
};

type SortOption = 'popular' | 'recent' | 'alphabetical';

export function ListFilters({ lists }: ListFiltersProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortOption, setSortOption] = useState<SortOption>('popular');

  // Filter and sort lists
  const filteredAndSortedLists = useMemo(() => {
    let filtered = lists;

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (list) =>
          list.name.toLowerCase().includes(query) ||
          list.description.toLowerCase().includes(query) ||
          list.id.toLowerCase().includes(query)
      );
    }

    // Filter by selected tags
    if (selectedTags.length > 0) {
      filtered = filtered.filter((list) =>
        selectedTags.every((tag) => list.tags.includes(tag))
      );
    }

    // Sort lists
    const sorted = [...filtered].sort((a, b) => {
      switch (sortOption) {
        case 'alphabetical':
          return a.name.localeCompare(b.name);
        case 'recent':
          const dateA = a.last_updated ? new Date(a.last_updated).getTime() : 0;
          const dateB = b.last_updated ? new Date(b.last_updated).getTime() : 0;
          return dateB - dateA;
        case 'popular':
        default:
          // Sort by number of checks/items, then by name
          const itemsA = a.type === 'checks' && 'checks' in a ? a.checks.length : 0;
          const itemsB = b.type === 'checks' && 'checks' in b ? b.checks.length : 0;
          if (itemsB !== itemsA) {
            return itemsB - itemsA;
          }
          return a.name.localeCompare(b.name);
      }
    });

    return sorted;
  }, [lists, searchQuery, selectedTags, sortOption]);

  return (
    <>
      <div className="mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
        <SearchBar onSearchChange={setSearchQuery} />
        <div className="flex gap-4 items-center">
          <TagFilter
            lists={lists}
            selectedTags={selectedTags}
            onTagsChange={setSelectedTags}
          />
          <SortSelector value={sortOption} onChange={setSortOption} />
        </div>
      </div>

      {filteredAndSortedLists.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            No lists found matching your criteria.
          </p>
          {(searchQuery || selectedTags.length > 0) && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedTags([]);
              }}
              className="mt-4 text-primary-600 hover:text-primary-700 underline"
            >
              Clear filters
            </button>
          )}
        </div>
      ) : (
        <>
          {filteredAndSortedLists.length < lists.length && (
            <div className="mb-4 text-sm text-gray-600">
              Showing {filteredAndSortedLists.length} of {lists.length} lists
            </div>
          )}
          <ListsGrid lists={filteredAndSortedLists} />
        </>
      )}
    </>
  );
}

