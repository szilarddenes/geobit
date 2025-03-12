import Link from 'next/link';
import { useState } from 'react';
import { FiMenu, FiX } from 'react-icons/fi';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center">
            <span className="font-bold text-2xl text-primary-600">GeoBit</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link 
              href="/newsletters" 
              className="text-neutral-600 hover:text-primary-600 font-medium transition duration-150"
            >
              Newsletters
            </Link>
            <Link 
              href="/archive" 
              className="text-neutral-600 hover:text-primary-600 font-medium transition duration-150"
            >
              Archive
            </Link>
            <Link 
              href="/about" 
              className="text-neutral-600 hover:text-primary-600 font-medium transition duration-150"
            >
              About
            </Link>
            <Link 
              href="/subscribe" 
              className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md font-medium transition duration-150"
            >
              Subscribe
            </Link>
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button 
              onClick={toggleMenu}
              className="text-neutral-600 hover:text-primary-600 focus:outline-none"
            >
              {isMenuOpen ? (
                <FiX className="h-6 w-6" />
              ) : (
                <FiMenu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 py-2 space-y-4">
            <Link 
              href="/newsletters" 
              className="block text-neutral-600 hover:text-primary-600 font-medium py-2 transition duration-150"
            >
              Newsletters
            </Link>
            <Link 
              href="/archive" 
              className="block text-neutral-600 hover:text-primary-600 font-medium py-2 transition duration-150"
            >
              Archive
            </Link>
            <Link 
              href="/about" 
              className="block text-neutral-600 hover:text-primary-600 font-medium py-2 transition duration-150"
            >
              About
            </Link>
            <Link 
              href="/subscribe" 
              className="block bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md font-medium text-center transition duration-150"
            >
              Subscribe
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}