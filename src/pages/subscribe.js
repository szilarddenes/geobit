import Layout from '@/components/layout/Layout';
import SubscriptionForm from '@/components/newsletter/SubscriptionForm';

export default function Subscribe() {
  // Sample benefits of subscribing
  const benefits = [
    {
      title: 'Daily Research Updates',
      description: 'Get the most important geoscience research findings delivered directly to your inbox daily.',
      icon: '📚'
    },
    {
      title: 'Time-Saving Summaries',
      description: 'Each article is summarized in a concise, easy-to-read format that takes just minutes to consume.',
      icon: '⏱️'
    },
    {
      title: 'Diverse Coverage',
      description: 'We cover all major geoscience disciplines from oceanography to planetary science.',
      icon: '🌎'
    },
    {
      title: 'Expert Curation',
      description: 'Our team of geoscientists selects only the most relevant and impactful research.',
      icon: '🧠'
    }
  ];

  // Sample newsletter example
  const sampleContent = [
    {
      id: 1,
      title: "New Study Reveals Ancient Sea Levels Were Higher Than Previously Thought",
      category: "Oceanography",
      emoji: "🌊",
      summary: "Researchers found evidence suggesting sea levels during the last interglacial period were up to 3 meters higher than current estimates."
    },
    {
      id: 2,
      title: "Discovery of Rare Mineral Formation Challenges Current Volcanic Theories",
      category: "Volcanology",
      emoji: "🌋",
      summary: "Unusual mineral deposits found in Indonesian volcano may require revisions to our understanding of magma chamber dynamics."
    }
  ];

  return (
    <Layout
      title="Subscribe - GeoBit"
      description="Subscribe to GeoBit for daily geoscience updates and research summaries"
    >
      <div className="bg-white">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Stay Updated on Geoscience Research
            </h1>
            <p className="text-xl text-gray-600">
              Join thousands of geoscientists who get the latest research delivered to their inbox daily, for free.
            </p>
          </div>
          
          <div className="max-w-md mx-auto mb-16">
            <SubscriptionForm buttonText="Subscribe for Free" />
          </div>
          
          {/* Benefits Section */}
          <div className="max-w-4xl mx-auto mb-16">
            <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">
              Why Subscribe to GeoBit?
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex space-x-4">
                  <div className="text-4xl">{benefit.icon}</div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{benefit.title}</h3>
                    <p className="text-gray-600">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Sample Newsletter */}
          <div className="max-w-3xl mx-auto bg-gray-50 rounded-lg p-8 mb-16">
            <h2 className="text-2xl font-bold text-center text-gray-900 mb-4">
              Here's What You'll Get
            </h2>
            <p className="text-center text-gray-600 mb-8">
              A sample of our newsletter content
            </p>
            
            <div className="space-y-6">
              {sampleContent.map((item) => (
                <div key={item.id} className="bg-white p-6 rounded-lg border border-gray-200">
                  <div className="flex items-center mb-2">
                    <span className="text-2xl mr-2">{item.emoji}</span>
                    <span className="text-sm font-medium text-gray-600">{item.category}</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-600">{item.summary}</p>
                </div>
              ))}
            </div>
            
            <div className="text-center mt-8 text-gray-500">
              <p>... and much more, delivered daily!</p>
            </div>
          </div>
          
          {/* Testimonials */}
          <div className="max-w-3xl mx-auto mb-16">
            <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">
              What Our Subscribers Say
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <p className="italic text-gray-600 mb-4">
                  "GeoBit is my go-to source for keeping up with geoscience research. The summaries are concise and well-written, saving me hours of reading time."
                </p>
                <div className="font-medium">
                  <p className="text-gray-900">Dr. Sarah Johnson</p>
                  <p className="text-gray-500">Marine Geologist</p>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <p className="italic text-gray-600 mb-4">
                  "As a busy professional, I rely on GeoBit to keep me informed of the latest developments across multiple geoscience disciplines. Highly recommended!"
                </p>
                <div className="font-medium">
                  <p className="text-gray-900">Michael Chen</p>
                  <p className="text-gray-500">Environmental Consultant</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Final CTA */}
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Ready to Stay Informed?
            </h2>
            <p className="text-gray-600 mb-8">
              Join our growing community of geoscience professionals and enthusiasts.
            </p>
            
            <div className="max-w-md mx-auto">
              <SubscriptionForm buttonText="Subscribe Now" />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
