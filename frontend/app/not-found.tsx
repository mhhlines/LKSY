import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <h1 className="text-4xl font-bold mb-4">404</h1>
      <p className="text-xl text-gray-600 mb-8">List not found</p>
      <Link href="/" className="text-primary-600 hover:underline">
        ← Back to all lists
      </Link>
    </div>
  );
}


