'use client';

import { useState } from 'react';

type SortOption = 'popular' | 'recent' | 'alphabetical';

export function SortSelector() {
  const [sort, setSort] = useState<SortOption>('popular');

  return (
    <select
      value={sort}
      onChange={(e) => setSort(e.target.value as SortOption)}
      className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
    >
      <option value="popular">Most Popular</option>
      <option value="recent">Recently Updated</option>
      <option value="alphabetical">Alphabetical</option>
    </select>
  );
}

