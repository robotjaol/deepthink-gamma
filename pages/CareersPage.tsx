import React from 'react';
import StaticPageLayout from '../components/layout/StaticPageLayout';
import { Button } from '../components/ui/Button';

const JobOpening: React.FC<{title: string, location: string, description: string}> = ({ title, location, description}) => (
    <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg">
        <div className="flex justify-between items-start">
            <div>
                <h3 className="text-2xl font-bold">{title}</h3>
                <p className="text-gray-500 dark:text-gray-400">{location}</p>
            </div>
            <Button variant='secondary'>Apply Now</Button>
        </div>
        <p className="mt-4">{description}</p>
    </div>
);

const CareersPage: React.FC = () => {
  return (
    <StaticPageLayout title="Careers at DeepThink">
      <p>
        Join us in our mission to redefine professional development. We are looking for passionate, innovative individuals who are excited about building the future of cognitive training. At DeepThink, you'll work on challenging problems, collaborate with a world-class team, and make a real impact on how professionals hone their skills.
      </p>
      <h2 className="text-3xl font-bold pt-8 pb-4">Our Culture</h2>
      <p>
        We foster a culture of curiosity, ownership, and continuous learning. We believe that the best ideas can come from anywhere, and we encourage every team member to think like a founder. If you're driven by intellectual challenges and a desire to build something meaningful, you'll feel right at home.
      </p>
      <h2 className="text-3xl font-bold pt-8 pb-4">Open Positions</h2>
      <div className="space-y-6">
        <JobOpening 
            title="Senior AI Engineer" 
            location="Remote" 
            description="Lead the development of our core scenario-generation and analysis AI. Experience with large language models and cognitive modeling is a plus."
        />
        <JobOpening 
            title="Frontend Developer (React)" 
            location="Remote" 
            description="Build intuitive and performant user interfaces that bring our complex simulations to life. Expertise in React, TypeScript, and data visualization is required."
        />
        <JobOpening 
            title="Product Manager, Enterprise" 
            location="New York, NY" 
            description="Drive the strategy and roadmap for our B2B offerings. Work closely with customers to build custom solutions and scale our enterprise platform."
        />
      </div>
    </StaticPageLayout>
  );
};

export default CareersPage;
