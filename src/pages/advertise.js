import Layout from '@/components/layout/Layout';
import { FiMail } from 'react-icons/fi';

export default function Advertise() {
  return (
    <Layout
      title="Advertise - GeoBit"
      description="Reach thousands of geoscience professionals through GeoBit newsletter"
    >
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            Coming Soon
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            We're preparing our advertising platform to help you reach thousands of geoscience professionals.
          </p>
          <p className="text-lg text-gray-600 mb-12">
            To be notified when advertising opportunities become available, please contact us at the email below.
          </p>
          
          <div className="inline-flex items-center bg-gray-100 rounded-full px-6 py-3 text-gray-800">
            <FiMail className="mr-2 text-blue-600" />
            <span>advertising@geobit.tech</span>
          </div>
        </div>
        
        <div className="max-w-4xl mx-auto mt-24">
          <div className="border-t border-gray-200 pt-12 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Why Advertise with GeoBit?
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8 mt-12">
              <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="text-4xl text-blue-600 mb-4">📊</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Targeted Audience</h3>
                <p className="text-gray-600">
                  Reach thousands of geoscience professionals, researchers, and industry experts.
                </p>
              </div>
              
              <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="text-4xl text-blue-600 mb-4">🔍</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">High Engagement</h3>
                <p className="text-gray-600">
                  Our readers are highly engaged professionals who open and read our content daily.
                </p>
              </div>
              
              <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="text-4xl text-blue-600 mb-4">✨</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Premium Placements</h3>
                <p className="text-gray-600">
                  Native advertising formats that integrate seamlessly with our high-quality content.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
