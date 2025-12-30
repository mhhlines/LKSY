'use client';

import { useState } from 'react';

type SearchBarProps = {
  onSearchChange: (query: string) => void;
};

export function SearchBar({ onSearchChange }: SearchBarProps) {
  const [query, setQuery] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    onSearchChange(value);
  };

  return (
    <div className="flex-1 max-w-md">
      <input
        type="text"
        placeholder="Search lists..."
        value={query}
        onChange={handleChange}
        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
      />
    </div>
  );
}



