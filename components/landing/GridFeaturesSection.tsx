import React from "react";
import { cn } from "../../lib/utils";
import createGlobe from "cobe";
import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
// FIX: Added Tooltip, XAxis, YAxis to the import from recharts.
import { PieChart, Pie, BarChart, Bar, ResponsiveContainer, Cell, Tooltip, XAxis, YAxis } from 'recharts';
import { Anchor, BrainCircuit, Scale, Users, TrendingUp, Globe as GlobeIcon } from 'lucide-react';


const FeatureDescription = ({ children, className }: { children?: React.ReactNode, className?: string }) => {
  return (
    <p
      className={cn(
        "text-sm md:text-base  max-w-4xl text-left mx-auto",
        "text-neutral-500 text-center font-normal dark:text-neutral-400",
        "text-left max-w-sm mx-0 md:text-sm my-2",
        className
      )}
    >
      {children}
    </p>
  );
};

export const Globe = ({ className }: { className?: string }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let phi = 0;

    if (!canvasRef.current) return;

    const globe = createGlobe(canvasRef.current, {
      devicePixelRatio: 2,
      width: 600 * 2,
      height: 600 * 2,
      phi: 0,
      theta: 0.2,
      dark: 1,
      diffuse: 1.2,
      mapSamples: 16000,
      mapBrightness: 6,
      baseColor: [0.2, 0.4, 0.7],
      markerColor: [0.9, 0.7, 0.2], // Dark Gold
      glowColor: [0.8, 0.8, 0.8],
      markers: [
        { location: [37.7749, -122.4194], size: 0.03 }, // San Francisco
        { location: [40.7128, -74.0060], size: 0.05 },  // New York
        { location: [51.5072, -0.1276], size: 0.05 },  // London
        { location: [35.6762, 139.6503], size: 0.05 }, // Tokyo
        { location: [-33.8688, 151.2093], size: 0.04 }, // Sydney
      ],
      onRender: (state) => {
        state.phi = phi;
        phi += 0.005;
      },
    });

    return () => {
      globe.destroy();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: 600, height: 600, maxWidth: "100%", aspectRatio: 1 }}
      className={className}
    />
  );
};

export const SkeletonOne = () => {
    return (
      <div className="relative flex flex-col items-center justify-center py-8 px-2 gap-10 h-full w-full">
        <div className="w-full max-w-lg p-5 mx-auto h-full flex items-center justify-center">
          <svg width="100%" viewBox="0 0 258 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-light-text dark:text-dark-text">
            <motion.path d="M2 59.5H35.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" initial={{pathLength: 0}} animate={{pathLength: 1}} transition={{duration: 0.5}}/>
            <motion.path d="M57.5 31H35.5V88H57.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" initial={{pathLength: 0}} animate={{pathLength: 1}} transition={{duration: 0.7, delay: 0.3}}/>
            <motion.path d="M58 31L84 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" initial={{pathLength: 0}} animate={{pathLength: 1}} transition={{duration: 0.5, delay: 0.8}}/>
            <motion.path d="M58 31L84 50" stroke="currentColor" strokeWidth="2" strokeLinecap="round" initial={{pathLength: 0}} animate={{pathLength: 1}} transition={{duration: 0.5, delay: 0.9}}/>
            <motion.path d="M58 88L84 69" stroke="currentColor" strokeWidth="2" strokeLinecap="round" initial={{pathLength: 0}} animate={{pathLength: 1}} transition={{duration: 0.5, delay: 1.0}}/>
            <motion.path d="M58 88L84 107" stroke="currentColor" strokeWidth="2" strokeLinecap="round" initial={{pathLength: 0}} animate={{pathLength: 1}} transition={{duration: 0.5, delay: 1.1}}/>
            <motion.circle cx="103" cy="12" r="10" stroke="currentColor" strokeWidth="2" initial={{opacity:0, scale:0.5}} animate={{opacity:1, scale:1}} transition={{delay: 1.2}}/>
            <motion.circle cx="103" cy="50" r="10" stroke="currentColor" strokeWidth="2" initial={{opacity:0, scale:0.5}} animate={{opacity:1, scale:1}} transition={{delay: 1.3}}/>
            <motion.circle cx="103" cy="69" r="10" stroke="currentColor" strokeWidth="2" initial={{opacity:0, scale:0.5}} animate={{opacity:1, scale:1}} transition={{delay: 1.4}}/>
            <motion.circle cx="103" cy="107" r="10" stroke="currentColor" strokeWidth="2" initial={{opacity:0, scale:0.5}} animate={{opacity:1, scale:1}} transition={{delay: 1.5}}/>
            <motion.rect x="128" y="40" width="128" height="20" rx="10" className="fill-current text-light-accent dark:text-dark-accent/50" initial={{opacity:0}} animate={{opacity:1}} transition={{delay: 1.6}}/>
            <motion.rect x="128" y="1" width="80" height="20" rx="10" className="fill-current text-light-accent dark:text-dark-accent/50" initial={{opacity:0}} animate={{opacity:1}} transition={{delay: 1.7}}/>
            <motion.rect x="128" y="97" width="100" height="20" rx="10" className="fill-current text-light-accent dark:text-dark-accent/50" initial={{opacity:0}} animate={{opacity:1}} transition={{delay: 1.8}}/>
          </svg>
        </div>
      </div>
    );
  };
  

export const SkeletonTwo = () => {
    const variants = {
        initial: {
          y: 20,
          opacity: 0,
        },
        animate: (i: number) => ({
          y: 0,
          opacity: 1,
          transition: {
            delay: i * 0.1,
            duration: 0.3,
          },
        }),
      };
      
    const biasCards = [
        { icon: <Anchor className="w-8 h-8"/>, name: "Anchoring Bias" },
        { icon: <Users className="w-8 h-8"/>, name: "Groupthink" },
        { icon: <Scale className="w-8 h-8"/>, name: "Confirmation Bias" },
    ];
  return (
    <div className="relative flex flex-col items-center p-8 gap-4 h-full w-full">
      {biasCards.map((card, i) => (
        <motion.div
          key={card.name}
          variants={variants}
          initial="initial"
          whileInView="animate"
          custom={i}
          viewport={{once: true}}
          className="w-full p-4 flex items-center space-x-4 bg-light-secondary dark:bg-dark-secondary rounded-lg"
        >
          <div className="p-3 bg-light-accent/50 dark:bg-dark-accent/20 rounded-md text-light-text dark:text-dark-gold">
            {card.icon}
          </div>
          <div>
            <p className="font-semibold text-light-text dark:text-dark-text">{card.name}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export const SkeletonThree = () => {
    const pieData = [{name: 'Intuitive', value: 60}, {name: 'Data-Driven', value: 40}];
    const barData = [{name: 'Speed', value: 90}, {name: 'Accuracy', value: 75}, {name: 'Creativity', value: 85}];
    const COLORS = ['#D4AF37', '#AED6F1'];

    return (
        <div className="relative flex items-center justify-around gap-4 h-full w-full p-4">
             <div className="w-1/2 h-48">
                <ResponsiveContainer>
                    <PieChart>
                        <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={60} label>
                             {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                        </Pie>
                        <Tooltip contentStyle={{ backgroundColor: '#1E1E1E', border: 'none', borderRadius: '0.5rem' }}/>
                    </PieChart>
                </ResponsiveContainer>
             </div>
             <div className="w-1/2 h-48">
                <ResponsiveContainer>
                    <BarChart data={barData} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                        <XAxis type="number" hide />
                        <YAxis type="category" dataKey="name" hide />
                        <Bar dataKey="value" barSize={20}>
                            {barData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
      );
};


export const SkeletonFour = () => {
  return (
    <div className="relative h-full w-full flex flex-col items-center justify-center">
        <div className="absolute inset-0 z-0 flex items-center justify-center">
             <Globe className="opacity-30 dark:opacity-40" />
        </div>
        <div className="relative z-10 p-4 text-center">
            <FeatureDescription className="text-center !max-w-lg text-base text-light-text/80 dark:text-dark-text/80">
                See how your skills stack up against professionals in your field worldwide. Climb the ranks and become a leader.
            </FeatureDescription>
        </div>
    </div>
  );
};


export function GridFeaturesSection() {
  const features = [
    {
      title: "Dynamic Scenario Engine",
      description: "Our AI generates hyper-realistic scenarios that adapt to your choices, ensuring no two sessions are ever the same.",
      skeleton: <SkeletonOne />,
      className: "col-span-1 lg:col-span-4 border-b lg:border-r dark:border-neutral-800",
    },
    {
      title: "Cognitive Bias Detection",
      description: "Uncover hidden biases like confirmation bias, groupthink, and more through targeted AI feedback.",
      skeleton: <SkeletonTwo />,
      className: "border-b col-span-1 lg:col-span-2 dark:border-neutral-800",
    },
    {
      title: "In-Depth Performance Analytics",
      description: "Visualize your progress with detailed reports. Track your speed, accuracy, and decision-making style over time.",
      skeleton: <SkeletonThree />,
      className: "col-span-1 lg:col-span-3 lg:border-r  dark:border-neutral-800",
    },
    {
      title: "Global Industry Benchmarks",
      description: "",
      skeleton: <SkeletonFour />,
      className: "col-span-1 lg:col-span-3 border-b lg:border-none",
    },
  ];
  return (
    <div className="relative z-20 py-10 lg:py-20 bg-light-secondary dark:bg-dark-secondary">
        <div className="container mx-auto">
            <div className="px-8">
                <h4 className="text-3xl lg:text-5xl lg:leading-tight max-w-5xl mx-auto text-center tracking-tight font-medium text-light-text dark:text-white">
                A Powerful Toolkit for Intuitive Mastery
                </h4>

                <p className="text-sm lg:text-base  max-w-2xl  my-4 mx-auto text-neutral-500 text-center font-normal dark:text-neutral-400">
                DeepThink goes beyond simple quizzes. We provide a suite of advanced tools designed to analyze, track, and improve your decision-making instincts.
                </p>
            </div>

            <div className="relative ">
                <div className="grid grid-cols-1 lg:grid-cols-6 mt-12 xl:border rounded-md dark:border-neutral-800 bg-light-primary dark:bg-dark-primary">
                {features.map((feature) => (
                    // FIX: Replaced custom FeatureCard component with a standard div and inlined styles to resolve TypeScript error with the 'key' prop.
                    <div key={feature.title} className={cn("p-4 sm:p-8 relative overflow-hidden", feature.className)}>
                      <FeatureTitle>{feature.title}</FeatureTitle>
                      <FeatureDescription>{feature.description}</FeatureDescription>
                      <div className=" h-full w-full">{feature.skeleton}</div>
                    </div>
                ))}
                </div>
            </div>
      </div>
    </div>
  );
}

const FeatureTitle = ({ children }: { children?: React.ReactNode }) => {
  return (
    <p className=" max-w-5xl mx-auto text-left tracking-tight text-light-text dark:text-white text-xl md:text-2xl md:leading-snug">
      {children}
    </p>
  );
};
