import { useState } from 'react';

const SubscriptionForm = ({ className, buttonText = "Subscribe", theme = "light" }) => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Simple client-side validation
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }
    
    setError('');
    setIsSubmitting(true);
    
    try {
      // Simulating API call for subscription
      // In production, this would post to your API endpoint
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Success
      setSubscribed(true);
      setEmail('');
    } catch (err) {
      setError('There was a problem with your subscription. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Different styles based on theme
  const styles = {
    light: {
      container: 'bg-white',
      input: 'border border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-gray-900',
      button: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 text-white',
      text: 'text-gray-500'
    },
    dark: {
      container: 'bg-gray-800',
      input: 'border border-gray-600 focus:border-blue-400 focus:ring-blue-400 text-white bg-gray-700',
      button: 'bg-blue-500 hover:bg-blue-600 focus:ring-blue-400 text-white',
      text: 'text-gray-300'
    }
  };
  
  const currentStyle = styles[theme] || styles.light;

  return (
    <div className={`${className} ${currentStyle.container} rounded-lg`}>
      {subscribed ? (
        <div className="text-center py-4">
          <h3 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-2`}>
            Thank you for subscribing!
          </h3>
          <p className={currentStyle.text}>
            Keep an eye on your inbox for the latest geoscience updates.
          </p>
          <button 
            className="mt-4 text-blue-600 hover:text-blue-500 font-medium"
            onClick={() => setSubscribed(false)}
          >
            Subscribe another email
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="w-full">
          <div className="flex flex-col space-y-4">
            <div className="w-full">
              <label htmlFor="email" className="sr-only">Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full px-4 py-3 rounded-md ${currentStyle.input}`}
                placeholder="Enter your email"
                disabled={isSubmitting}
                required
              />
            </div>
            
            {error && (
              <p className="text-red-500 text-sm">{error}</p>
            )}
            
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full px-4 py-3 rounded-md font-medium transition-colors ${currentStyle.button} disabled:opacity-50`}
            >
              {isSubmitting ? 'Subscribing...' : buttonText}
            </button>
            
            <p className={`text-xs ${currentStyle.text} text-center`}>
              No spam, unsubscribe at any time. We value your privacy.
            </p>
          </div>
        </form>
      )}
    </div>
  );
};

export default SubscriptionForm;
