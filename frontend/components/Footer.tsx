import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t bg-gray-50 mt-12">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold mb-4">lksy.org</h3>
            <p className="text-sm text-gray-600">
              Community-driven QA standards platform
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/lists" className="text-gray-600 hover:text-primary-600">
                  All Lists
                </Link>
              </li>
              <li>
                <Link href="/propose" className="text-gray-600 hover:text-primary-600">
                  Propose List
                </Link>
              </li>
              <li>
                <Link href="/api/docs" className="text-gray-600 hover:text-primary-600">
                  API Documentation
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Community</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="https://github.com/mhhlines/LKSY"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-primary-600"
                >
                  GitHub
                </a>
              </li>
              <li>
                <Link href="/contributors" className="text-gray-600 hover:text-primary-600">
                  Contributors
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/license" className="text-gray-600 hover:text-primary-600">
                  License
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-600 hover:text-primary-600">
                  Privacy
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t text-center text-sm text-gray-600">
          <p>&copy; {new Date().getFullYear()} lksy.org. Apache License 2.0</p>
        </div>
      </div>
    </footer>
  );
}

