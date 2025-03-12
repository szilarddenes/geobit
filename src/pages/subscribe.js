import { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { useForm } from 'react-hook-form';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';
import { FiMail, FiCheck, FiUser, FiGlobe, FiInfo } from 'react-icons/fi';

export default function Subscribe() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setIsSubmitting(true);

    try {
      await addDoc(collection(db, 'subscribers'), {
        email: data.email,
        firstName: data.firstName || '',
        lastName: data.lastName || '',
        organization: data.organization || '',
        interests: data.interests || [],
        optIn: data.marketingOptIn || false,
        status: 'active',
        createdAt: new Date()
      });

      toast.success('Thank you for subscribing!');
      router.push('/subscribe/success');
    } catch (error) {
      console.error('Error subscribing:', error);
      toast.error('Subscription failed. Please try again.');
      setIsSubmitting(false);
    }
  };

  const interests = [
    'Oceanography',
    'Volcanology',
    'Climate Science',
    'Planetary Science',
    'Seismology',
    'Economic Geology',
    'Geomagnetism',
    'Paleontology',
    'Geochemistry',
  ];

  return (
    <Layout 
      title="Subscribe" 
      description="Subscribe to the GeoBit Newsletter"
    >
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <header className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
              Subscribe to GeoBit
            </h1>
            <p className="text-xl text-neutral-600">
              Stay informed with the latest geoscience research and developments
            </p>
          </header>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="flex items-center mb-4">
                <div className="rounded-full bg-primary-100 p-2 mr-3">
                  <FiMail className="text-primary-600" size={20} />
                </div>
                <h3 className="font-semibold text-lg">Daily Digest</h3>
              </div>
              <p className="text-neutral-600">
                Concise summaries delivered straight to your inbox every morning
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="flex items-center mb-4">
                <div className="rounded-full bg-primary-100 p-2 mr-3">
                  <FiCheck className="text-primary-600" size={20} />
                </div>
                <h3 className="font-semibold text-lg">Curated Content</h3>
              </div>
              <p className="text-neutral-600">
                Expert-selected research and news from trusted sources
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="flex items-center mb-4">
                <div className="rounded-full bg-primary-100 p-2 mr-3">
                  <FiGlobe className="text-primary-600" size={20} />
                </div>
                <h3 className="font-semibold text-lg">Global Coverage</h3>
              </div>
              <p className="text-neutral-600">
                Research highlights from across the earth sciences
              </p>
            </div>
          </div>

          {/* Subscription Form */}
          <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-6">
                <label className="block text-neutral-800 font-medium mb-2">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  {...register('email', { 
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address'
                    }
                  })}
                  className={`w-full px-4 py-3 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500`}
                  placeholder="your.email@example.com"
                />
                {errors.email && (
                  <p className="mt-1 text-red-500 text-sm">{errors.email.message}</p>
                )}
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-neutral-800 font-medium mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    {...register('firstName')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="First Name"
                  />
                </div>
                <div>
                  <label className="block text-neutral-800 font-medium mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    {...register('lastName')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Last Name"
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-neutral-800 font-medium mb-2">
                  Organization/Institution
                </label>
                <input
                  type="text"
                  {...register('organization')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Your university or company"
                />
              </div>

              <div className="mb-6">
                <label className="block text-neutral-800 font-medium mb-2">
                  Interests (optional)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {interests.map((interest) => (
                    <div key={interest} className="flex items-start">
                      <input
                        type="checkbox"
                        id={interest}
                        value={interest}
                        {...register('interests')}
                        className="mt-1 mr-2"
                      />
                      <label htmlFor={interest} className="text-neutral-600">
                        {interest}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-8">
                <div className="flex items-start">
                  <input
                    type="checkbox"
                    id="marketingOptIn"
                    {...register('marketingOptIn')}
                    className="mt-1 mr-2"
                  />
                  <label htmlFor="marketingOptIn" className="text-neutral-600">
                    I agree to receive occasional marketing updates and special offers from GeoBit. You can unsubscribe at any time.
                  </label>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-md transition duration-200 disabled:opacity-50"
              >
                {isSubmitting ? 'Subscribing...' : 'Subscribe to GeoBit'}
              </button>

              <p className="mt-4 text-center text-neutral-500 text-sm flex justify-center items-center">
                <FiInfo className="mr-1" />
                We respect your privacy. Unsubscribe anytime.
              </p>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
}