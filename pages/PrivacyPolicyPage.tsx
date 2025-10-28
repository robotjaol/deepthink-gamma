import React from 'react';
import StaticPageLayout from '../components/layout/StaticPageLayout';

const PrivacyPolicyPage: React.FC = () => {
  return (
    <StaticPageLayout title="Privacy Policy">
      <p className='text-sm text-gray-500 dark:text-gray-400'>Last Updated: {new Date().toLocaleDateString()}</p>
      <p>
        DeepThink ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform.
      </p>
      <h2 className="text-3xl font-bold pt-4">1. Information We Collect</h2>
      <p>
        We may collect personal information that you provide to us directly, such as your name, email address, and professional details when you register for an account. We also collect performance data generated during your training sessions to provide you with analytics and improve our services.
      </p>
      <h2 className="text-3xl font-bold pt-4">2. How We Use Your Information</h2>
      <p>
        Your information is used to:
        <ul className="list-disc pl-8 mt-2">
          <li>Create and manage your account.</li>
          <li>Provide, personalize, and improve our services.</li>
          <li>Analyze your performance and provide you with detailed feedback.</li>
          <li>Communicate with you about updates and offers.</li>
          <li>Anonymously aggregate data to improve our AI models.</li>
        </ul>
      </p>
      <h2 className="text-3xl font-bold pt-4">3. Data Security</h2>
      <p>
        We implement a variety of security measures to maintain the safety of your personal information. Your individual performance data is private and is not shared with other users.
      </p>
      <h2 className="text-3xl font-bold pt-4">4. Your Rights</h2>
      <p>
        You have the right to access, update, or delete your personal information at any time through your account settings or by contacting us directly.
      </p>
    </StaticPageLayout>
  );
};

export default PrivacyPolicyPage;
