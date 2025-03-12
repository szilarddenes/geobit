import { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { toast } from 'react-toastify';

export default function Home() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubscribe = async (e) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await addDoc(collection(db, 'subscribers'), {
        email,
        status: 'active',
        createdAt: new Date()
      });
      
      toast.success('Thank you for subscribing!');
      setEmail('');
      router.push('/subscribe/success');
    } catch (error) {
      console.error('Error subscribing:', error);
      toast.error('Subscription failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Head>
        <title>GeoBit - TLDR for Geoscientists</title>
        <meta name="description" content="A TLDR-style newsletter for geoscientists with the latest research news" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <main className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
        <div className="container mx-auto px-4 py-12">
          <header className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold text-slate-800 mb-4">
              GeoBit
            </h1>
            <p className="text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto">
              The essential TLDR newsletter for geoscientists. 
              Stay updated on the latest research without information overload.
            </p>
          </header>
          
          <section className="max-w-lg mx-auto bg-white rounded-lg shadow-md p-8 mb-12">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">
              Subscribe to GeoBit
            </h2>
            <p className="text-slate-600 mb-6">
              Get the latest geoscience research delivered to your inbox every week.
              No spam, just concise summaries of what matters most.
            </p>
            
            <form onSubmit={handleSubscribe} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
                  Email address
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="you@example.com"
                  required
                />
              </div>
              
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-200 disabled:opacity-50"
              >
                {isSubmitting ? 'Subscribing...' : 'Subscribe for Free'}
              </button>
            </form>
          </section>
          
          <section className="max-w-4xl mx-auto mb-12">
            <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">
              Why GeoBit?
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-bold text-slate-800 mb-2">Curated Content</h3>
                <p className="text-slate-600">
                  We aggregate the most important geoscience research from leading journals and institutions.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-bold text-slate-800 mb-2">AI-Powered Summaries</h3>
                <p className="text-slate-600">
                  Complex research distilled into concise, readable summaries that respect your time.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-bold text-slate-800 mb-2">Stay Informed</h3>
                <p className="text-slate-600">
                  Keep up with the latest developments in earth sciences without information overload.
                </p>
              </div>
            </div>
          </section>
          
          <footer className="text-center text-slate-600 text-sm">
            <p>&copy; {new Date().getFullYear()} GeoBit. All rights reserved.</p>
          </footer>
        </div>
      </main>
    </>
  );
}