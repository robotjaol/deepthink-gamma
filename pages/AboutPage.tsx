import React from 'react';
import StaticPageLayout from '../components/layout/StaticPageLayout';

const AboutPage: React.FC = () => {
  return (
    <StaticPageLayout title="About DeepThink">
      <p>
        Founded on the principle that intuition is not just a gift but a skill that can be honed, DeepThink is a pioneering platform designed to train the next generation of leaders and decision-makers. We believe that the most critical moments in any career are defined by judgment calls made under pressure—moments where data is incomplete and instinct takes over.
      </p>
      <h2 className="text-3xl font-bold pt-4">Our Mission</h2>
      <p>
        Our mission is to quantify and cultivate professional intuition. We provide a safe, high-fidelity "cognitive gym" where professionals can practice high-stakes decision-making without real-world consequences. By leveraging cutting-edge AI, we simulate complex scenarios that challenge, measure, and refine our users' innate decision-making abilities.
      </p>
      <h2 className="text-3xl font-bold pt-4">The Team</h2>
      <p>
        We are a diverse team of cognitive scientists, AI engineers, and industry veterans united by a passion for human potential. Our backgrounds span from leading tech firms to academic research institutions, giving us a unique perspective on the intersection of technology and professional development. We're dedicated to building a tool that doesn't just impart knowledge, but forges expertise.
      </p>
    </StaticPageLayout>
  );
};

export default AboutPage;
