import { useState } from 'react';
import { useRouter } from 'next/router';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { toast } from 'react-toastify';

export default function SubscriptionForm({ buttonText = 'Subscribe', compact = false }) {
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

  // Determine styling based on compact prop
  const containerClasses = compact 
    ? 'flex flex-col sm:flex-row max-w-lg gap-3'
    : 'flex flex-col sm:flex-row max-w-lg mx-auto gap-3';

  return (
    <form onSubmit={handleSubscribe} className={containerClasses}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="flex-grow px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        placeholder="Enter your email"
        required
      />
      <button
        type="submit"
        disabled={isSubmitting}
        className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-md transition duration-200 disabled:opacity-50 whitespace-nowrap"
      >
        {isSubmitting ? 'Subscribing...' : buttonText}
      </button>
    </form>
  );
}