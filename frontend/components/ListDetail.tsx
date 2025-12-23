'use client';

import { List } from '@/shared/types';
import { useState } from 'react';
import { format } from 'date-fns';
import Link from 'next/link';

type ListDetailProps = {
  list: List;
  versions: string[];
};

export function ListDetail({ list, versions }: ListDetailProps) {
  const [copied, setCopied] = useState(false);

  const copyJson = async () => {
    await navigator.clipboard.writeText(JSON.stringify(list, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadCsv = () => {
    // CSV generation logic would go here
    console.log('Download CSV');
  };

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
          <button
            onClick={copyJson}
            className="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700"
          >
            {copied ? '✓ Copied' : '📋 Copy JSON'}
          </button>
          <button
            onClick={downloadCsv}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
          >
            📥 Download CSV
          </button>
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
            <div className="space-y-4">
              {list.checks.map((check) => (
                <div key={check.id} className="border-l-4 border-primary-500 pl-4 py-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold">{check.name}</h3>
                      <p className="text-gray-600">{check.description}</p>
                      {check.rationale && (
                        <p className="text-sm text-gray-500 mt-1">{check.rationale}</p>
                      )}
                    </div>
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        check.severity === 'critical'
                          ? 'bg-red-100 text-red-800'
                          : check.severity === 'major'
                          ? 'bg-orange-100 text-orange-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {check.severity}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {list.type === 'values' && 'values' in list && (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Values</h2>
            <pre className="bg-gray-100 p-4 rounded overflow-auto">
              {JSON.stringify(list.values, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}

