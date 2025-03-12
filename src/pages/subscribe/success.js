import Link from 'next/link';
import Layout from '@/components/layout/Layout';
import { FiCheck, FiArrowRight } from 'react-icons/fi';

export default function SubscriptionSuccess() {
  return (
    <Layout 
      title="Subscription Confirmed" 
      description="Thank you for subscribing to GeoBit"
    >
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-2xl mx-auto text-center">
          <div className="flex justify-center mb-8">
            <div className="rounded-full bg-green-100 p-4">
              <FiCheck className="text-green-600" size={40} />
            </div>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-6">
            You're subscribed!
          </h1>
          
          <p className="text-xl text-neutral-600 mb-8">
            Thank you for subscribing to GeoBit. You'll start receiving the latest geoscience updates in your inbox soon.
          </p>

          <div className="bg-gray-50 p-6 rounded-lg mb-10">
            <h3 className="font-semibold text-lg mb-3">What's next?</h3>
            <p className="text-neutral-600 mb-4">
              Check your inbox for a confirmation email. To ensure you receive our emails, please add <span className="font-medium">hello@geobit.com</span> to your contacts.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              href="/"
              className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-md transition duration-200"
            >
              Go to homepage
            </Link>
            
            <Link 
              href="/archive"
              className="px-6 py-3 border border-gray-300 hover:border-primary-600 text-neutral-800 hover:text-primary-600 font-medium rounded-md transition duration-200 flex items-center justify-center"
            >
              Browse articles <FiArrowRight className="ml-2" />
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}