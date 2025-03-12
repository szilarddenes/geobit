import Link from 'next/link';
import { useState, useEffect } from 'react';
import { FiMenu, FiX } from 'react-icons/fi';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
      scrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-6'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="relative z-10">
            <span className="font-heading text-3xl font-bold text-secondary tracking-tight uppercase">
              Geo<span className="text-primary">Bit</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link 
              href="/newsletters" 
              className="font-heading text-secondary hover:text-primary uppercase text-sm tracking-wide font-bold transition-all duration-300 py-2 relative"
            >
              Newsletters
              <span className="absolute bottom-0 left-0 w-0 h-1 bg-accent transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link 
              href="/archive" 
              className="font-heading text-secondary hover:text-primary uppercase text-sm tracking-wide font-bold transition-all duration-300 py-2 relative"
            >
              Archive
              <span className="absolute bottom-0 left-0 w-0 h-1 bg-accent transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link 
              href="/about" 
              className="font-heading text-secondary hover:text-primary uppercase text-sm tracking-wide font-bold transition-all duration-300 py-2 relative"
            >
              About
              <span className="absolute bottom-0 left-0 w-0 h-1 bg-accent transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link 
              href="/subscribe" 
              className="btn btn-primary"
            >
              Subscribe
            </Link>
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button 
              onClick={toggleMenu}
              className="text-secondary hover:text-primary focus:outline-none transition-all duration-300"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <FiX className="h-7 w-7" />
              ) : (
                <FiMenu className="h-7 w-7" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Overlay */}
        <div className={`fixed inset-0 bg-secondary z-40 transform transition-transform duration-500 ease-in-out ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}>
          <div className="container mx-auto px-4 py-20">
            <nav className="flex flex-col items-center space-y-10 mt-16">
              <Link 
                href="/newsletters" 
                className="text-white hover:text-accent font-heading text-3xl uppercase font-bold transition-all duration-300"
                onClick={() => setIsMenuOpen(false)}
              >
                Newsletters
              </Link>
              <Link 
                href="/archive" 
                className="text-white hover:text-accent font-heading text-3xl uppercase font-bold transition-all duration-300"
                onClick={() => setIsMenuOpen(false)}
              >
                Archive
              </Link>
              <Link 
                href="/about" 
                className="text-white hover:text-accent font-heading text-3xl uppercase font-bold transition-all duration-300"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <Link 
                href="/subscribe" 
                className="mt-8 btn bg-accent text-secondary hover:bg-white uppercase font-bold text-xl px-8 py-4"
                onClick={() => setIsMenuOpen(false)}
              >
                Subscribe
              </Link>
            </nav>
          </div>
        </div>
      </div>
      
      {/* Colorful section divider */}
      <div className="section-divider absolute bottom-0 left-0 w-full"></div>
    </header>
  );
}