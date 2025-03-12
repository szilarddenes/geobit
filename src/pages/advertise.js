import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { FiCheck, FiArrowRight } from 'react-icons/fi';

export default function Advertise() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real implementation, you would handle the form submission
    alert('Thanks for your inquiry! We will be in touch soon.');
  };

  return (
    <div className="min-h-screen bg-white">
      <Head>
        <title>Advertise with GeoBit | Reach Geoscience Professionals</title>
        <meta name="description" content="Get your brand in front of thousands of geoscience professionals. Sponsorship opportunities with GeoBit newsletter." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Header/Navigation */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold">
              <span className="text-[#001F3F]">Geo<span className="text-[#FF4D00]">Bit</span></span>
            </Link>
            <nav className="hidden md:flex space-x-6">
              <Link href="/newsletters" className="text-gray-600 hover:text-gray-900">Newsletters</Link>
              <Link href="/archive" className="text-gray-600 hover:text-gray-900">Archive</Link>
              <Link href="/about" className="text-gray-600 hover:text-gray-900">About</Link>
              <Link href="/subscribe" className="btn-primary btn">Subscribe</Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Section divider - TLDR.tech style */}
      <div className="section-divider w-full"></div>

      {/* Hero Section */}
      <section className="py-16 md:py-20 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Advertise with GeoBit
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Reach over 50,000 geoscience professionals. Get your brand in front of researchers, engineers, executives, and decision-makers.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a href="#contact" className="btn-primary btn">
              Get in Touch
            </a>
            <a href="#pricing" className="border border-gray-300 bg-white text-gray-700 px-6 py-3 rounded font-medium hover:bg-gray-50">
              View Pricing
            </a>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="p-8 bg-white rounded-lg shadow-sm">
              <div className="text-4xl font-bold text-[#FF4D00] mb-2">50,000+</div>
              <div className="text-gray-700">Subscribers</div>
            </div>
            <div className="p-8 bg-white rounded-lg shadow-sm">
              <div className="text-4xl font-bold text-[#FF4D00] mb-2">42%</div>
              <div className="text-gray-700">Open Rate</div>
            </div>
            <div className="p-8 bg-white rounded-lg shadow-sm">
              <div className="text-4xl font-bold text-[#FF4D00] mb-2">12%</div>
              <div className="text-gray-700">Click Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* Audience */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Our Audience</h2>
          <div className="grid md:grid-cols-2 gap-12">
            <div className="bg-gray-50 p-8 rounded-lg">
              <h3 className="text-xl font-bold mb-4">Who reads GeoBit?</h3>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <div className="bg-[#FF4D00] p-1 rounded-full mr-3">
                    <FiCheck className="text-white" />
                  </div>
                  <span>Researchers & Scientists</span>
                </li>
                <li className="flex items-center">
                  <div className="bg-[#FF4D00] p-1 rounded-full mr-3">
                    <FiCheck className="text-white" />
                  </div>
                  <span>Academic Faculty & Students</span>
                </li>
                <li className="flex items-center">
                  <div className="bg-[#FF4D00] p-1 rounded-full mr-3">
                    <FiCheck className="text-white" />
                  </div>
                  <span>Industry Professionals</span>
                </li>
                <li className="flex items-center">
                  <div className="bg-[#FF4D00] p-1 rounded-full mr-3">
                    <FiCheck className="text-white" />
                  </div>
                  <span>Environmental Consultants</span>
                </li>
                <li className="flex items-center">
                  <div className="bg-[#FF4D00] p-1 rounded-full mr-3">
                    <FiCheck className="text-white" />
                  </div>
                  <span>Government Agencies</span>
                </li>
              </ul>
            </div>
            <div className="bg-gray-50 p-8 rounded-lg">
              <h3 className="text-xl font-bold mb-4">Industry Breakdown</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span>Academic/Research</span>
                    <span>45%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-[#FF4D00] h-2 rounded-full" style={{ width: '45%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span>Industry</span>
                    <span>30%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-[#FF4D00] h-2 rounded-full" style={{ width: '30%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span>Government</span>
                    <span>15%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-[#FF4D00] h-2 rounded-full" style={{ width: '15%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span>Other</span>
                    <span>10%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-[#FF4D00] h-2 rounded-full" style={{ width: '10%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Sponsorship Options</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
              <div className="bg-gray-50 p-6 text-center border-b border-gray-200">
                <h3 className="text-xl font-bold mb-2">Single Issue</h3>
                <div className="text-3xl font-bold text-[#FF4D00]">$500</div>
              </div>
              <div className="p-6">
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <span className="text-[#FF4D00] mr-2">•</span>
                    <span>One-time sponsor mention</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#FF4D00] mr-2">•</span>
                    <span>150-word description with link</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#FF4D00] mr-2">•</span>
                    <span>Performance report</span>
                  </li>
                </ul>
                <a href="#contact" className="block text-center mt-6 bg-gray-50 border border-gray-300 text-gray-700 px-6 py-3 rounded font-medium hover:bg-gray-100">
                  Contact Us
                </a>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-lg overflow-hidden border-2 border-[#FF4D00] transform scale-105">
              <div className="bg-[#FF4D00] p-6 text-center border-b border-[#E64500] text-white">
                <div className="text-sm font-bold uppercase mb-2">Most Popular</div>
                <h3 className="text-xl font-bold mb-2">Monthly</h3>
                <div className="text-3xl font-bold">$1,500</div>
              </div>
              <div className="p-6">
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <span className="text-[#FF4D00] mr-2">•</span>
                    <span>4 sponsor mentions per month</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#FF4D00] mr-2">•</span>
                    <span>150-word description with link</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#FF4D00] mr-2">•</span>
                    <span>Performance reports</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#FF4D00] mr-2">•</span>
                    <span>20% discount on rate card</span>
                  </li>
                </ul>
                <a href="#contact" className="block text-center mt-6 bg-[#FF4D00] text-white px-6 py-3 rounded font-medium hover:bg-[#E64500]">
                  Contact Us
                </a>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
              <div className="bg-gray-50 p-6 text-center border-b border-gray-200">
                <h3 className="text-xl font-bold mb-2">Quarterly</h3>
                <div className="text-3xl font-bold text-[#FF4D00]">$4,000</div>
              </div>
              <div className="p-6">
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <span className="text-[#FF4D00] mr-2">•</span>
                    <span>12 sponsor mentions (1 per week)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#FF4D00] mr-2">•</span>
                    <span>150-word description with link</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#FF4D00] mr-2">•</span>
                    <span>Detailed performance reports</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#FF4D00] mr-2">•</span>
                    <span>30% discount on rate card</span>
                  </li>
                </ul>
                <a href="#contact" className="block text-center mt-6 bg-gray-50 border border-gray-300 text-gray-700 px-6 py-3 rounded font-medium hover:bg-gray-100">
                  Contact Us
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">What Our Sponsors Say</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gray-50 p-8 rounded-lg shadow-sm">
              <div className="text-[#FF4D00] text-3xl mb-4">"</div>
              <p className="text-gray-700 mb-6">
                Our campaign with GeoBit generated a 2.8x ROI. The quality of leads we received was excellent, as these were highly engaged professionals in our target market.
              </p>
              <div className="flex items-center">
                <div className="rounded-full bg-gray-200 w-12 h-12 mr-4"></div>
                <div>
                  <div className="font-bold">Sarah Johnson</div>
                  <div className="text-sm text-gray-500">Marketing Director, GeoTech Solutions</div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 p-8 rounded-lg shadow-sm">
              <div className="text-[#FF4D00] text-3xl mb-4">"</div>
              <p className="text-gray-700 mb-6">
                GeoBit's audience is exactly who we wanted to reach. The team was helpful in crafting our message, and we saw a significant increase in website traffic during our campaign.
              </p>
              <div className="flex items-center">
                <div className="rounded-full bg-gray-200 w-12 h-12 mr-4"></div>
                <div>
                  <div className="font-bold">Michael Chen</div>
                  <div className="text-sm text-gray-500">CEO, EarthData Inc.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section id="contact" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Get in Touch</h2>
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-sm">
              <div className="mb-6">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FF4D00] focus:border-[#FF4D00]"
                  required
                />
              </div>
              <div className="mb-6">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FF4D00] focus:border-[#FF4D00]"
                  required
                />
              </div>
              <div className="mb-6">
                <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FF4D00] focus:border-[#FF4D00]"
                  required
                />
              </div>
              <div className="mb-6">
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="4"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FF4D00] focus:border-[#FF4D00]"
                  required
                ></textarea>
              </div>
              <div>
                <button
                  type="submit"
                  className="w-full bg-[#FF4D00] text-white px-6 py-3 rounded-md font-medium hover:bg-[#E64500]"
                >
                  Submit
                </button>
              </div>
            </form>
            <div className="mt-8 text-center">
              <p className="text-gray-700">
                For immediate assistance, email us at:{' '}
                <a href="mailto:advertise@geobit.com" className="text-[#FF4D00] font-bold">
                  advertise@geobit.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section divider */}
      <div className="section-divider w-full"></div>

      {/* Footer */}
      <footer className="bg-[#001F3F] text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="text-2xl font-bold mb-4">GeoBit</div>
              <p className="text-gray-400 mb-6">
                A TLDR-style newsletter for geoscientists with the latest research and industry news.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Newsletters</h3>
              <ul className="space-y-2">
                <li><Link href="/newsletters/research" className="text-gray-400 hover:text-white">Research Highlights</Link></li>
                <li><Link href="/newsletters/industry" className="text-gray-400 hover:text-white">Industry News</Link></li>
                <li><Link href="/newsletters/tools" className="text-gray-400 hover:text-white">Tools & Technology</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Company</h3>
              <ul className="space-y-2">
                <li><Link href="/about" className="text-gray-400 hover:text-white">About Us</Link></li>
                <li><Link href="/advertise" className="text-gray-400 hover:text-white">Advertise</Link></li>
                <li><Link href="/contact" className="text-gray-400 hover:text-white">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><Link href="/privacy" className="text-gray-400 hover:text-white">Privacy Policy</Link></li>
                <li><Link href="/terms" className="text-gray-400 hover:text-white">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-500 text-sm">
            <p>&copy; {new Date().getFullYear()} GeoBit. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}