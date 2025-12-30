'use client';

type SortOption = 'popular' | 'recent' | 'alphabetical';

type SortSelectorProps = {
  value: SortOption;
  onChange: (value: SortOption) => void;
};

export function SortSelector({ value, onChange }: SortSelectorProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as SortOption)}
      className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
    >
      <option value="popular">Most Popular</option>
      <option value="recent">Recently Updated</option>
      <option value="alphabetical">Alphabetical</option>
    </select>
  );
}



