import { useState } from 'react';
import { useRouter } from 'next/router';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { toast } from 'react-toastify';
import { FiArrowRight } from 'react-icons/fi';

export default function SubscriptionForm({ buttonText = 'Subscribe', compact = false }) {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [inputFocused, setInputFocused] = useState(false);
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

  // Determine styling based on compact prop
  const containerClasses = compact 
    ? 'relative z-10'
    : 'relative z-10 max-w-lg mx-auto';
    
  const formClasses = compact
    ? 'flex flex-col sm:flex-row items-stretch'
    : 'flex flex-col items-stretch';

  return (
    <div className={containerClasses}>
      <form onSubmit={handleSubscribe} className={formClasses}>
        <div className={`relative flex-grow mb-4 sm:mb-0 ${compact ? 'sm:mr-3' : ''}`}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onFocus={() => setInputFocused(true)}
            onBlur={() => setInputFocused(false)}
            className={`w-full px-6 py-4 bg-white border-2 border-secondary transition-all duration-300 ${
              inputFocused ? 'border-primary' : 'focus:border-primary'
            }`}
            placeholder="Enter your email"
            required
          />
          
          <div className={`absolute bottom-0 left-0 h-1 bg-accent transform origin-left transition-transform duration-500 ${
            inputFocused ? 'w-full scale-x-100' : 'w-full scale-x-0'
          }`}></div>
        </div>
        
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn btn-primary flex items-center justify-center"
        >
          <span className="uppercase font-heading tracking-wide">
            {isSubmitting ? 'Subscribing...' : buttonText}
          </span>
          <FiArrowRight className="ml-2 group-hover:translate-x-1 transition-transform duration-300" />
        </button>
      </form>
      
      {!compact && (
        <div className="mt-3 text-center">
          <p className="text-sm text-secondary">
            No spam. Unsubscribe at any time.
          </p>
        </div>
      )}
    </div>
  );
}