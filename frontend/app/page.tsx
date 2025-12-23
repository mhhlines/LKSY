import { ListsGrid } from '@/components/ListsGrid';
import { SearchBar } from '@/components/SearchBar';
import { TagFilter } from '@/components/TagFilter';
import { SortSelector } from '@/components/SortSelector';
import { getLists } from '@/lib/github';

export default async function HomePage() {
  const lists = await getLists();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">lksy.org</h1>
        <p className="text-xl text-gray-600 mb-2">
          Community QA Standards Platform
        </p>
        <p className="text-gray-500">
          Open source, version-controlled, community-maintained lists of QA values and checks
        </p>
      </div>

      <div className="mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
        <SearchBar />
        <div className="flex gap-4 items-center">
          <TagFilter lists={lists} />
          <SortSelector />
        </div>
      </div>

      <ListsGrid lists={lists} />
    </div>
  );
}

