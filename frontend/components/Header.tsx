'use client';

import Link from 'next/link';

export function Header() {
  return (
    <header className="border-b bg-white">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <img
              src="/logo.png"
              alt="lksy.org logo"
              width={48}
              height={48}
              className="h-12 w-12 object-contain"
              onError={(e) => {
                console.error('Logo failed to load:', e);
                e.currentTarget.style.display = 'none';
              }}
            />
            <span className="text-2xl font-bold text-primary-600">lksy.org</span>
          </Link>
          <nav className="flex gap-6">
            <Link href="/" className="text-gray-700 hover:text-primary-600">
              Browse Lists
            </Link>
            <Link href="/propose" className="text-gray-700 hover:text-primary-600">
              Propose New List
            </Link>
            <Link href="/api/docs" className="text-gray-700 hover:text-primary-600">
              API
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}

