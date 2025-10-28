import React from 'react';
import StaticPageLayout from '../components/layout/StaticPageLayout';

const ContactPage: React.FC = () => {
  return (
    <StaticPageLayout title="Contact Us">
      <p>
        We'd love to hear from you. Whether you have a question about our features, pricing, need a demo, or anything else, our team is ready to answer all your questions.
      </p>
      
      <div className="grid md:grid-cols-2 gap-8 mt-8">
        <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg">
            <h3 className="text-2xl font-bold mb-2">General Inquiries</h3>
            <p className="mb-4">For all general questions about DeepThink.</p>
            <a href="mailto:hello@deepthink.com" className="text-light-accent dark:text-dark-accent font-semibold">hello@deepthink.com</a>
        </div>
        <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg">
            <h3 className="text-2xl font-bold mb-2">Sales & Enterprise</h3>
            <p className="mb-4">Interested in a custom plan for your team?</p>
            <a href="mailto:sales@deepthink.com" className="text-light-accent dark:text-dark-accent font-semibold">sales@deepthink.com</a>
        </div>
        <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg">
            <h3 className="text-2xl font-bold mb-2">Support</h3>
            <p className="mb-4">Get help with our platform.</p>
            <a href="mailto:support@deepthink.com" className="text-light-accent dark:text-dark-accent font-semibold">support@deepthink.com</a>
        </div>
         <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg">
            <h3 className="text-2xl font-bold mb-2">Media & Press</h3>
            <p className="mb-4">For media inquiries and press-related matters.</p>
            <a href="mailto:press@deepthink.com" className="text-light-accent dark:text-dark-accent font-semibold">press@deepthink.com</a>
        </div>
      </div>

    </StaticPageLayout>
  );
};

export default ContactPage;
