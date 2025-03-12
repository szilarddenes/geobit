import Layout from '@/components/layout/Layout';

export default function Privacy() {
  return (
    <Layout
      title="Privacy Policy - GeoBit"
      description="Privacy policy and data handling practices for GeoBit newsletter"
    >
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            Privacy Policy
          </h1>
          
          <div className="prose prose-lg max-w-none text-gray-600">
            <p className="lead">
              Last updated: March 12, 2025
            </p>
            
            <h2>Introduction</h2>
            <p>
              At GeoBit, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or subscribe to our newsletter.
            </p>
            
            <h2>Information We Collect</h2>
            <p>
              We collect information that you voluntarily provide to us when you register for our newsletter, including:
            </p>
            <ul>
              <li>Email address</li>
              <li>Name (optional)</li>
              <li>Professional information (optional)</li>
            </ul>
            
            <h2>How We Use Your Information</h2>
            <p>
              We may use the information we collect for various purposes, including:
            </p>
            <ul>
              <li>To provide and maintain our newsletter service</li>
              <li>To notify you about changes to our service</li>
              <li>To provide customer support</li>
              <li>To gather analysis or valuable information so that we can improve our service</li>
              <li>To monitor the usage of our service</li>
            </ul>
            
            <h2>Cookies and Tracking</h2>
            <p>
              We use cookies and similar tracking technologies to track activity on our website and hold certain information. Cookies are files with a small amount of data which may include an anonymous unique identifier.
            </p>
            
            <h2>Third-Party Services</h2>
            <p>
              We may employ third-party companies and individuals to facilitate our newsletter service, provide the service on our behalf, perform service-related services, or assist us in analyzing how our service is used.
            </p>
            
            <h2>Data Retention</h2>
            <p>
              We will retain your personal information only for as long as is necessary for the purposes set out in this Privacy Policy. We will retain and use your information to the extent necessary to comply with our legal obligations, resolve disputes, and enforce our policies.
            </p>
            
            <h2>Your Rights</h2>
            <p>
              You have the right to:
            </p>
            <ul>
              <li>Access the personal information we hold about you</li>
              <li>Request that your personal information be corrected or deleted</li>
              <li>Object to processing of your personal information</li>
              <li>Request restriction of processing your personal information</li>
              <li>Request transfer of your personal information</li>
              <li>Withdraw consent</li>
            </ul>
            
            <h2>Changes to This Privacy Policy</h2>
            <p>
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
            </p>
            
            <h2>Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us at privacy@geobit.tech
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
