import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`sticky top-0 z-50 transition-all ${
      isScrolled ? 'bg-white shadow-sm' : 'bg-white'
    }`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold text-gray-900">GeoBit</span>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link 
              href="/newsletters" 
              className={`text-base font-medium ${
                router.pathname === '/newsletters' || router.pathname.startsWith('/newsletters/') 
                  ? 'text-blue-600' 
                  : 'text-gray-700 hover:text-gray-900'
              }`}
            >
              Newsletters
            </Link>
            <Link 
              href="/categories" 
              className={`text-base font-medium ${
                router.pathname === '/categories' || router.pathname.startsWith('/categories/') 
                  ? 'text-blue-600' 
                  : 'text-gray-700 hover:text-gray-900'
              }`}
            >
              Categories
            </Link>
            <Link 
              href="/advertise" 
              className={`text-base font-medium ${
                router.pathname === '/advertise' 
                  ? 'text-blue-600' 
                  : 'text-gray-700 hover:text-gray-900'
              }`}
            >
              Advertise
            </Link>
          </nav>

          {/* Subscribe Button */}
          <div className="hidden md:block">
            <Link 
              href="/subscribe"
              className="ml-8 inline-flex items-center justify-center px-6 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              Subscribe
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden -mr-2 flex items-center">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <span className="sr-only">{isMenuOpen ? 'Close menu' : 'Open menu'}</span>
              <svg
                className={`${isMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <svg
                className={`${isMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden`}>
        <div className="pt-2 pb-4 space-y-1 px-4 sm:px-6">
          <Link
            href="/newsletters"
            className={`block py-2 ${
              router.pathname === '/newsletters' || router.pathname.startsWith('/newsletters/') 
                ? 'text-blue-600' 
                : 'text-gray-700 hover:text-gray-900'
            }`}
            onClick={() => setIsMenuOpen(false)}
          >
            Newsletters
          </Link>
          <Link
            href="/categories"
            className={`block py-2 ${
              router.pathname === '/categories' || router.pathname.startsWith('/categories/') 
                ? 'text-blue-600' 
                : 'text-gray-700 hover:text-gray-900'
            }`}
            onClick={() => setIsMenuOpen(false)}
          >
            Categories
          </Link>
          <Link
            href="/advertise"
            className={`block py-2 ${
              router.pathname === '/advertise' 
                ? 'text-blue-600' 
                : 'text-gray-700 hover:text-gray-900'
            }`}
            onClick={() => setIsMenuOpen(false)}
          >
            Advertise
          </Link>
          <Link
            href="/subscribe"
            className="block py-2 mt-4 w-full text-center bg-blue-600 text-white font-medium py-2 px-4 rounded-md hover:bg-blue-700"
            onClick={() => setIsMenuOpen(false)}
          >
            Subscribe
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
