import Head from 'next/head';
import Link from 'next/link';

export default function SubscriptionSuccess() {
  return (
    <>
      <Head>
        <title>Subscription Confirmed - GeoBit</title>
        <meta name="description" content="You've successfully subscribed to GeoBit" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <main className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="container mx-auto px-4 py-12 max-w-md">
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            
            <h1 className="text-2xl font-bold text-slate-800 mb-4">
              Subscription Confirmed!
            </h1>
            
            <p className="text-slate-600 mb-6">
              Thank you for subscribing to GeoBit. You'll now receive our weekly newsletter with the latest geoscience research and news.
            </p>
            
            <Link href="/" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md transition duration-200">
              Return to Home
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}