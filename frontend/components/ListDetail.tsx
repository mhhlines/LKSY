'use client';

import { List } from '@/shared/types';
import { format } from 'date-fns';
import Link from 'next/link';

type ListDetailProps = {
  list: List;
  versions: string[];
};

export function ListDetail({ list, versions }: ListDetailProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/" className="text-primary-600 hover:underline">
          ← Back to all lists
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow p-8">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">{list.name}</h1>
            <p className="text-gray-600 mb-4">{list.description}</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {list.tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/?tag=${tag}`}
                  className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm hover:bg-primary-200"
                >
                  {tag}
                </Link>
              ))}
            </div>
            <div className="text-sm text-gray-500">
              <span>Version {list.version}</span>
              {list.last_updated && (
                <span className="ml-4">
                  Updated {format(new Date(list.last_updated), 'MMM d, yyyy')}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex gap-4 mb-8">
          <Link
            href={`/lists/${list.id}/propose`}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
          >
            📝 Suggest Change
          </Link>
        </div>

        {list.type === 'checks' && 'checks' in list && (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Checks</h2>
            <ul className="space-y-3 list-disc list-inside">
              {list.checks.map((check) => (
                <li key={check.id} className="pl-2">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <span className="font-semibold">{check.name}</span>
                      {check.description && (
                        <span className="text-gray-600"> - {check.description}</span>
                      )}
                      {check.rationale && (
                        <p className="text-sm text-gray-500 mt-1 ml-6">{check.rationale}</p>
                      )}
                    </div>
                    <span
                      className={`px-2 py-1 rounded text-xs whitespace-nowrap ${
                        check.severity === 'critical'
                          ? 'bg-red-100 text-red-800'
                          : check.severity === 'major'
                          ? 'bg-orange-100 text-orange-800'
                          : check.severity === 'minor'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {check.severity}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {list.type === 'values' && 'values' in list && (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Values</h2>
            {Array.isArray(list.values.items) ? (
              <ul className="space-y-2 list-disc list-inside">
                {list.values.items.map((item: any, index: number) => (
                  <li key={item.id || index} className="pl-2">
                    {typeof item === 'object' ? (
                      <div>
                        {Object.entries(item)
                          .filter(([key]) => key !== 'id')
                          .map(([key, value]) => (
                            <div key={key} className="ml-4">
                              <span className="font-semibold">{key}:</span>{' '}
                              <span className="text-gray-700">{String(value)}</span>
                            </div>
                          ))}
                      </div>
                    ) : (
                      <span>{String(item)}</span>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <ul className="space-y-2 list-disc list-inside">
                {Object.entries(list.values).map(([key, value]) => (
                  <li key={key} className="pl-2">
                    <span className="font-semibold">{key}:</span>{' '}
                    <span className="text-gray-700">
                      {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
}



