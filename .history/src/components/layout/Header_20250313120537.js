import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
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
    <header className={`sticky top-0 z-50 transition-all ${isScrolled ? 'bg-dark-lighter shadow-dark-sm' : 'bg-dark'
      }`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-3">
          {/* Logo */}
          <div className="flex-shrink-0 -ml-3">
            <Link href="/" className="flex items-center">
              <Image
                src="/logo3.svg"
                alt="GeoBit Logo"
                width={280}
                height={90}
                className="h-24 w-auto"
                priority
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8 justify-start ml-4">
            <Link
              href="/newsletters"
              className={`text-lg font-bold ${router.pathname === '/newsletters' || router.pathname.startsWith('/newsletters/')
                ? 'text-primary'
                : 'text-light-muted hover:text-primary'
                }`}
            >
              Newsletters
            </Link>
            <Link
              href="/advertise"
              className={`text-lg font-bold ${router.pathname === '/advertise'
                ? 'text-primary'
                : 'text-light-muted hover:text-primary'
                }`}
            >
              Advertise
            </Link>
          </nav>

          {/* Subscribe Button */}
          <div className="hidden md:block">
            <Link
              href="/subscribe"
              className="ml-8 inline-flex items-center justify-center px-6 py-2 border border-transparent rounded-md shadow-sm text-base font-bold text-dark bg-primary hover:bg-primary-light"
            >
              Subscribe
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden -mr-2 flex items-center">
            <button
              type="button"
              className="inline-flex items-center justify-center p-3 rounded-md text-light-muted hover:text-primary hover:bg-dark-light focus:outline-none"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <span className="sr-only">{isMenuOpen ? 'Close menu' : 'Open menu'}</span>
              <svg
                className={`${isMenuOpen ? 'hidden' : 'block'} h-8 w-8`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <svg
                className={`${isMenuOpen ? 'block' : 'hidden'} h-8 w-8`}
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
        <div className="pt-2 pb-4 space-y-1 px-4 sm:px-6 bg-dark-lighter text-right">
          <Link
            href="/newsletters"
            className={`block py-2 font-bold text-lg ${router.pathname === '/newsletters' || router.pathname.startsWith('/newsletters/')
              ? 'text-primary'
              : 'text-light-muted hover:text-primary'
              }`}
            onClick={() => setIsMenuOpen(false)}
          >
            Newsletters
          </Link>
          <Link
            href="/advertise"
            className={`block py-2 font-bold text-lg ${router.pathname === '/advertise'
              ? 'text-primary'
              : 'text-light-muted hover:text-primary'
              }`}
            onClick={() => setIsMenuOpen(false)}
          >
            Advertise
          </Link>
          <Link
            href="/subscribe"
            className="block mt-4 w-64 text-center bg-primary text-dark font-bold py-2 px-4 rounded-md hover:bg-primary-light"
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