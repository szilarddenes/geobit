import Link from 'next/link';
import { FiTwitter, FiInstagram, FiLinkedin, FiArrowRight } from 'react-icons/fi';
import SubscriptionForm from '@/components/newsletter/SubscriptionForm';

export default function Footer() {
  return (
    <footer className="bg-secondary text-white relative">
      {/* Geometric accent shapes */}
      <div className="absolute top-0 left-0 w-1/4 h-1/4 bg-primary opacity-10 transform -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-1/5 h-1/5 bg-accent opacity-20 rounded-full transform translate-x-1/3 translate-y-1/3"></div>
      
      {/* Top footer section with subscription */}
      <div className="relative z-10 container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="font-heading text-3xl font-bold uppercase mb-4">
              Stay Updated
            </h2>
            <p className="text-neutral-200 mb-6 text-lg">
              Subscribe to our newsletter and never miss important geoscience news and discoveries
            </p>
            <SubscriptionForm buttonText="Subscribe" compact={true} />
          </div>
          
          <div className="flex flex-col md:items-end">
            <Link href="/" className="inline-block mb-6">
              <span className="font-heading text-3xl font-bold text-white">
                Geo<span className="text-primary">Bit</span>
              </span>
            </Link>
            <p className="text-neutral-200 md:text-right mb-6">
              A TLDR-style newsletter for geoscientists with the latest research and industry news.
            </p>
            <div className="flex space-x-6">
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-neutral-200 hover:text-primary transition-colors duration-300"
                aria-label="Twitter"
              >
                <FiTwitter size={24} />
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-neutral-200 hover:text-primary transition-colors duration-300"
                aria-label="Instagram"
              >
                <FiInstagram size={24} />
              </a>
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-neutral-200 hover:text-primary transition-colors duration-300"
                aria-label="LinkedIn"
              >
                <FiLinkedin size={24} />
              </a>
            </div>
          </div>
        </div>
      </div>
      
      {/* Section divider */}
      <div className="section-divider w-full h-2"></div>
      
      {/* Bottom footer with links */}
      <div className="container mx-auto px-4 pt-12 pb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Newsletters */}
          <div className="col-span-1">
            <h3 className="font-heading text-lg font-bold uppercase mb-4 text-accent">Newsletters</h3>
            <ul className="space-y-3">
              <li>
                <Link 
                  href="/newsletters/research" 
                  className="text-neutral-200 hover:text-primary flex items-center group"
                >
                  <FiArrowRight className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300" size={14} />
                  <span>Research Highlights</span>
                </Link>
              </li>
              <li>
                <Link 
                  href="/newsletters/industry" 
                  className="text-neutral-200 hover:text-primary flex items-center group"
                >
                  <FiArrowRight className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300" size={14} />
                  <span>Industry News</span>
                </Link>
              </li>
              <li>
                <Link 
                  href="/newsletters/tools" 
                  className="text-neutral-200 hover:text-primary flex items-center group"
                >
                  <FiArrowRight className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300" size={14} />
                  <span>Tools & Technology</span>
                </Link>
              </li>
              <li>
                <Link 
                  href="/newsletters/careers" 
                  className="text-neutral-200 hover:text-primary flex items-center group"
                >
                  <FiArrowRight className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300" size={14} />
                  <span>Career Opportunities</span>
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Resources */}
          <div className="col-span-1">
            <h3 className="font-heading text-lg font-bold uppercase mb-4 text-accent">Resources</h3>
            <ul className="space-y-3">
              <li>
                <Link 
                  href="/archive" 
                  className="text-neutral-200 hover:text-primary flex items-center group"
                >
                  <FiArrowRight className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300" size={14} />
                  <span>Archive</span>
                </Link>
              </li>
              <li>
                <Link 
                  href="/about" 
                  className="text-neutral-200 hover:text-primary flex items-center group"
                >
                  <FiArrowRight className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300" size={14} />
                  <span>About Us</span>
                </Link>
              </li>
              <li>
                <Link 
                  href="/advertise" 
                  className="text-neutral-200 hover:text-primary flex items-center group"
                >
                  <FiArrowRight className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300" size={14} />
                  <span>Advertise</span>
                </Link>
              </li>
              <li>
                <Link 
                  href="/contact" 
                  className="text-neutral-200 hover:text-primary flex items-center group"
                >
                  <FiArrowRight className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300" size={14} />
                  <span>Contact</span>
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Legal */}
          <div className="col-span-1">
            <h3 className="font-heading text-lg font-bold uppercase mb-4 text-accent">Legal</h3>
            <ul className="space-y-3">
              <li>
                <Link 
                  href="/privacy" 
                  className="text-neutral-200 hover:text-primary flex items-center group"
                >
                  <FiArrowRight className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300" size={14} />
                  <span>Privacy Policy</span>
                </Link>
              </li>
              <li>
                <Link 
                  href="/terms" 
                  className="text-neutral-200 hover:text-primary flex items-center group"
                >
                  <FiArrowRight className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300" size={14} />
                  <span>Terms of Service</span>
                </Link>
              </li>
              <li>
                <Link 
                  href="/cookies" 
                  className="text-neutral-200 hover:text-primary flex items-center group"
                >
                  <FiArrowRight className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300" size={14} />
                  <span>Cookie Policy</span>
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Info Block */}
          <div className="col-span-1 md:text-right">
            <h3 className="font-heading text-lg font-bold uppercase mb-4 text-accent">Reach Us</h3>
            <p className="text-neutral-200 mb-2">hello@geobit.com</p>
            <p className="text-neutral-200">123 Science Avenue<br />Research District, EI 54321</p>
          </div>
        </div>
        
        <div className="border-t border-neutral-700 mt-12 pt-6 text-center text-sm text-neutral-400">
          <p>&copy; {new Date().getFullYear()} GeoBit. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}