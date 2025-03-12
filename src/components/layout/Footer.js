import Link from 'next/link';
import { FiTwitter, FiInstagram, FiLinkedin } from 'react-icons/fi';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand / About */}
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="inline-block">
              <span className="font-bold text-2xl text-primary-600">GeoBit</span>
            </Link>
            <p className="mt-4 text-neutral-600">
              A TLDR-style newsletter for geoscientists with the latest research and industry news.
            </p>
            <div className="flex space-x-4 mt-4">
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-neutral-500 hover:text-primary-600"
              >
                <FiTwitter size={20} />
                <span className="sr-only">Twitter</span>
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-neutral-500 hover:text-primary-600"
              >
                <FiInstagram size={20} />
                <span className="sr-only">Instagram</span>
              </a>
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-neutral-500 hover:text-primary-600"
              >
                <FiLinkedin size={20} />
                <span className="sr-only">LinkedIn</span>
              </a>
            </div>
          </div>
          
          {/* Newsletters */}
          <div className="col-span-1">
            <h3 className="font-semibold text-neutral-900 mb-4">Newsletters</h3>
            <ul className="space-y-3">
              <li>
                <Link 
                  href="/newsletters/research" 
                  className="text-neutral-600 hover:text-primary-600"
                >
                  Research Highlights
                </Link>
              </li>
              <li>
                <Link 
                  href="/newsletters/industry" 
                  className="text-neutral-600 hover:text-primary-600"
                >
                  Industry News
                </Link>
              </li>
              <li>
                <Link 
                  href="/newsletters/tools" 
                  className="text-neutral-600 hover:text-primary-600"
                >
                  Tools & Technology
                </Link>
              </li>
              <li>
                <Link 
                  href="/newsletters/careers" 
                  className="text-neutral-600 hover:text-primary-600"
                >
                  Career Opportunities
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Resources */}
          <div className="col-span-1">
            <h3 className="font-semibold text-neutral-900 mb-4">Resources</h3>
            <ul className="space-y-3">
              <li>
                <Link 
                  href="/archive" 
                  className="text-neutral-600 hover:text-primary-600"
                >
                  Archive
                </Link>
              </li>
              <li>
                <Link 
                  href="/about" 
                  className="text-neutral-600 hover:text-primary-600"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link 
                  href="/advertise" 
                  className="text-neutral-600 hover:text-primary-600"
                >
                  Advertise
                </Link>
              </li>
              <li>
                <Link 
                  href="/contact" 
                  className="text-neutral-600 hover:text-primary-600"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Legal */}
          <div className="col-span-1">
            <h3 className="font-semibold text-neutral-900 mb-4">Legal</h3>
            <ul className="space-y-3">
              <li>
                <Link 
                  href="/privacy" 
                  className="text-neutral-600 hover:text-primary-600"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link 
                  href="/terms" 
                  className="text-neutral-600 hover:text-primary-600"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link 
                  href="/cookies" 
                  className="text-neutral-600 hover:text-primary-600"
                >
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 mt-12 pt-8 text-center text-neutral-500 text-sm">
          <p>&copy; {new Date().getFullYear()} GeoBit. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}