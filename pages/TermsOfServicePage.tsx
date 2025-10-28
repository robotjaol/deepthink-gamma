import React from 'react';
import StaticPageLayout from '../components/layout/StaticPageLayout';

const TermsOfServicePage: React.FC = () => {
  return (
    <StaticPageLayout title="Terms of Service">
      <p className='text-sm text-gray-500 dark:text-gray-400'>Last Updated: {new Date().toLocaleDateString()}</p>
      <p>
        Please read these Terms of Service ("Terms") carefully before using the DeepThink platform operated by us. Your access to and use of the service is conditioned upon your acceptance of and compliance with these Terms.
      </p>
      <h2 className="text-3xl font-bold pt-4">1. Accounts</h2>
      <p>
        When you create an account with us, you guarantee that you are above the age of 18 and that the information you provide is accurate, complete, and current. You are responsible for safeguarding the password that you use to access the service.
      </p>
      <h2 className="text-3xl font-bold pt-4">2. Use of Service</h2>
      <p>
        You agree not to use the service for any purpose that is illegal or prohibited by these Terms. You may not use the platform in any manner that could damage, disable, or impair the service.
      </p>
      <h2 className="text-3xl font-bold pt-4">3. Intellectual Property</h2>
      <p>
        The service and its original content, features, and functionality are and will remain the exclusive property of DeepThink and its licensors. Our trademarks may not be used in connection with any product or service without our prior written consent.
      </p>
      <h2 className="text-3xl font-bold pt-4">4. Termination</h2>
      <p>
        We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
      </p>
       <h2 className="text-3xl font-bold pt-4">5. Changes to Terms</h2>
      <p>
        We reserve the right, at our sole discretion, to modify or replace these Terms at any time. We will provide at least 30 days' notice prior to any new terms taking effect.
      </p>
    </StaticPageLayout>
  );
};

export default TermsOfServicePage;
