import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 py-4">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-sm text-gray-600">
            © {new Date().getFullYear()} Academic Lens. All rights reserved.
          </div>
          <div className="flex space-x-4 mt-2 md:mt-0">
            <Link href="/privacy" className="text-sm text-gray-600 hover:text-gray-900">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-sm text-gray-600 hover:text-gray-900">
              Terms of Service
            </Link>
            <Link href="/contact" className="text-sm text-gray-600 hover:text-gray-900">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
