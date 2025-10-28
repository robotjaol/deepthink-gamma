import { ScenarioTemplate, ScenarioLevel, LeaderboardUser, Session, AnalysisReport, Badge, UserBadge, Note, DailyQuest, UserLeague, SkillNode } from './types';

export const DUMMY_SCENARIOS: ScenarioTemplate[] = [
  // Teknik Informatika -> Information Technology
  {
    id: 'it-legacy-migration',
    name: 'Legacy System Migration Crisis',
    jobType: 'Information Technology',
    level: ScenarioLevel.Expert,
    description: 'A critical database migration fails on a Friday night, taking production systems down. Lead the rollback strategy and manage stakeholder panic.',
    tags: ['Database', 'Crisis Management', 'System Migration'],
  },
  {
    id: 'it-security-breach',
    name: 'Zero-Day Vulnerability',
    jobType: 'Information Technology',
    level: ScenarioLevel.Specialist,
    description: 'A zero-day exploit is discovered in your main application framework. You have hours to patch before public disclosure. Prioritize actions and coordinate the response.',
    tags: ['Cybersecurity', 'Risk Management', 'Patching'],
  },
  {
    id: 'it-startup-scaling',
    name: 'Unexpected Viral Scaling',
    jobType: 'Information Technology',
    level: ScenarioLevel.Newbie,
    description: 'Your new app went viral overnight. The server is crashing and users are complaining. Decide on immediate scaling solutions without rewriting the whole codebase.',
    tags: ['Cloud', 'Scalability', 'DevOps'],
  },
  // Sistem Informasi -> Information Systems
  {
    id: 'si-erp-failure',
    name: 'ERP Implementation Failure',
    jobType: 'Information Systems',
    level: ScenarioLevel.Expert,
    description: 'A multi-million dollar ERP implementation has failed user acceptance testing. The business is blaming IT. You need to mediate, create a recovery plan, and regain trust.',
    tags: ['ERP', 'Project Management', 'Stakeholder'],
  },
  {
    id: 'si-data-privacy-audit',
    name: 'Surprise Data Privacy Audit',
    jobType: 'Information Systems',
    level: ScenarioLevel.Newbie,
    description: 'Regulators announce a surprise audit of your company\'s data handling processes. You find several potential non-compliance issues. What do you report and fix first?',
    tags: ['Compliance', 'GDPR', 'Data Governance'],
  },
  // Teknik Elektro -> Electrical Engineering
  {
    id: 'te-power-grid-cascade',
    name: 'Power Grid Cascade Failure',
    jobType: 'Electrical Engineering',
    level: ScenarioLevel.Specialist,
    description: 'A substation failure triggers a cascading power outage across the city. As the lead engineer, you must analyze fault data in real-time to isolate the issue and guide restoration.',
    tags: ['Power Systems', 'Control Systems', 'Crisis'],
  },
  {
    id: 'te-chip-defect',
    name: 'Microchip Fabrication Defect',
    jobType: 'Electrical Engineering',
    level: ScenarioLevel.Expert,
    description: 'A batch of critical microchips shows a mysterious, intermittent fault. Yield has dropped 90%. You must diagnose the issue at the silicon level before the production line is halted.',
    tags: ['Microelectronics', 'Semiconductor', 'QC'],
  },
  // Teknik Mesin -> Mechanical Engineering
  {
    id: 'tm-factory-bottleneck',
    name: 'Automated Factory Bottleneck',
    jobType: 'Mechanical Engineering',
    level: ScenarioLevel.Newbie,
    description: 'A new robotic arm on the assembly line is performing 20% slower than specified, creating a massive bottleneck. Diagnose if it\'s a mechanical, software, or integration issue.',
    tags: ['Robotics', 'Manufacturing', 'Automation'],
  },
  {
    id: 'tm-hvac-design-flaw',
    name: 'HVAC Design Flaw in Data Center',
    jobType: 'Mechanical Engineering',
    level: ScenarioLevel.Expert,
    description: 'A newly built data center is experiencing critical overheating issues. Your HVAC design is the likely culprit. Propose a solution without causing server downtime.',
    tags: ['HVAC', 'Thermodynamics', 'Data Center'],
  },
  // Teknik Kimia -> Chemical Engineering
  {
    id: 'tk-reactor-runaway',
    name: 'Chemical Reactor Runaway',
    jobType: 'Chemical Engineering',
    level: ScenarioLevel.Specialist,
    description: 'An exothermic reaction in a large-scale reactor is showing signs of a thermal runaway. You have minutes to interpret the sensor data and initiate emergency procedures.',
    tags: ['Process Safety', 'Reaction Engineering', 'Emergency'],
  },
  {
    id: 'tk-product-impurity',
    name: 'Product Contamination Mystery',
    jobType: 'Chemical Engineering',
    level: ScenarioLevel.Newbie,
    description: 'A batch of high-purity product is failing quality control due to an unknown impurity. Trace the source of the contamination within the complex P&ID.',
    tags: ['Quality Control', 'Separation', 'Troubleshooting'],
  },
  // Teknik Sistem & Industri -> Industrial Engineering
  {
    id: 'ti-supply-chain-disruption',
    name: 'Global Supply Chain Disruption',
    jobType: 'Industrial & Systems Engineering',
    level: ScenarioLevel.Expert,
    description: 'Your key component supplier in another country is shut down due to a natural disaster. Redesign your supply chain and logistics network in real-time to prevent a factory shutdown.',
    tags: ['Supply Chain', 'Logistics', 'Risk Management'],
  },
  {
    id: 'ti-lean-implementation',
    name: 'Lean Manufacturing Resistance',
    jobType: 'Industrial & Systems Engineering',
    level: ScenarioLevel.Newbie,
    description: 'Your proposal to implement Lean principles on the factory floor is met with strong resistance from veteran workers. How do you demonstrate its value and win them over?',
    tags: ['Lean', 'Change Management', 'Ergonomics'],
  },
  // Teknik Sipil -> Civil Engineering
  {
    id: 'ts-bridge-structural-fatigue',
    name: 'Bridge Structural Fatigue',
    jobType: 'Civil Engineering',
    level: ScenarioLevel.Specialist,
    description: 'Routine sensor data from a major bridge shows alarming stress and fatigue patterns after a minor earthquake. You must decide whether to close the bridge immediately for inspection.',
    tags: ['Structural Engineering', 'Public Safety', 'Risk'],
  },
  {
    id: 'ts-construction-delay',
    name: 'High-Rise Construction Delay',
    jobType: 'Civil Engineering',
    level: ScenarioLevel.Expert,
    description: 'Unexpected soil conditions have halted foundation work on a skyscraper project. You are 3 months behind schedule. Re-evaluate the project timeline and budget.',
    tags: ['Construction', 'Project Management', 'Geotechnical'],
  },
  // Arsitektur -> Architecture
  {
    id: 'ar-client-design-conflict',
    name: 'Client Design Conflict',
    jobType: 'Architecture',
    level: ScenarioLevel.Newbie,
    description: 'Your client for a public library project demands a design change that violates fundamental principles of accessibility and sustainability you championed. How do you respond?',
    tags: ['Client Management', 'Ethics', 'Design Principles'],
  },
  {
    id: 'ar-historic-preservation',
    name: 'Historic Preservation vs Modern Code',
    jobType: 'Architecture',
    level: ScenarioLevel.Expert,
    description: 'While renovating a historic building, you uncover structural issues that require a modern intervention, but the preservation committee is strictly against it. Negotiate a compromise.',
    tags: ['Renovation', 'Building Codes', 'Negotiation'],
  },
  // Perencanaan Wilayah dan Kota -> Urban & Regional Planning
  {
    id: 'pwk-gentrification-conflict',
    name: 'Urban Renewal vs. Gentrification',
    jobType: 'Urban & Regional Planning',
    level: ScenarioLevel.Expert,
    description: 'Your urban renewal plan is praised by developers but heavily protested by local residents who fear gentrification and displacement. You must address the community at a town hall meeting.',
    tags: ['Urban Planning', 'Community', 'Social Equity'],
  },
  {
    id: 'pwk-transport-zoning',
    name: 'Transit Hub Zoning Dilemma',
    jobType: 'Urban & Regional Planning',
    level: ScenarioLevel.Newbie,
    description: 'A proposed high-speed rail hub requires rezoning a low-density residential area. Evaluate the economic benefits against the social and environmental impact.',
    tags: ['Zoning', 'Transportation', 'Impact Analysis'],
  },
  // Desain Produk Industri -> Industrial Product Design
  {
    id: 'dpi-manufacturing-defect',
    name: 'Manufacturing Defect Recall',
    jobType: 'Industrial Product Design',
    level: ScenarioLevel.Expert,
    description: 'A flaw in your new ergonomic chair design is causing it to break, leading to a product recall. The flaw is traced back to a material choice you made. Lead the redesign effort.',
    tags: ['Product Design', 'Manufacturing', 'Ergonomics'],
  },
  {
    id: 'dpi-sustainable-material',
    name: 'Sustainable Material Challenge',
    jobType: 'Industrial Product Design',
    level: ScenarioLevel.Newbie,
    description: 'Your company wants to switch to a new, sustainable polymer for its bestselling product, but it has different manufacturing tolerances. Adapt the design for the new material.',
    tags: ['Sustainability', 'Materials', 'DFM'],
  },
  // Desain Komunikasi Visual -> Visual Communication Design
  {
    id: 'dkv-rebranding-backlash',
    name: 'Client Rebranding Backlash',
    jobType: 'Visual Communication Design',
    level: ScenarioLevel.Expert,
    description: 'The new brand identity you designed for a beloved local company is receiving major public backlash on social media. Your client is panicking. What is your strategy?',
    tags: ['Branding', 'PR', 'Client Relations'],
  },
  {
    id: 'dkv-ui-accessibility',
    name: 'UI Accessibility Complaint',
    jobType: 'Visual Communication Design',
    level: ScenarioLevel.Newbie,
    description: 'A major user group files a complaint that your app\'s UI design is not accessible to visually impaired users. Conduct a quick audit and present a redesign plan.',
    tags: ['UI/UX', 'Accessibility', 'Web Design'],
  },
  // Statistika -> Statistics
  {
    id: 'stat-misleading-data',
    name: 'Misleading Marketing Data',
    jobType: 'Statistics',
    level: ScenarioLevel.Expert,
    description: 'The marketing team presents a chart to the CEO that shows huge success, but you realize they\'ve used misleading statistical methods. How do you ethically intervene?',
    tags: ['Data Ethics', 'Statistics', 'Communication'],
  },
  {
    id: 'stat-ab-test-inconclusive',
    name: 'Inconclusive A/B Test',
    jobType: 'Statistics',
    level: ScenarioLevel.Newbie,
    description: 'A critical A/B test for a new website feature comes back with no statistically significant winner. The product manager wants to launch it anyway. What do you advise?',
    tags: ['A/B Testing', 'Hypothesis Testing', 'Data Analysis'],
  },
   // Teknik Kelautan -> Ocean Engineering
  {
    id: 'tkel-offshore-platform-stability',
    name: 'Offshore Platform Stability Alert',
    jobType: 'Ocean Engineering',
    level: ScenarioLevel.Specialist,
    description: 'An offshore oil platform\'s mooring system is showing signs of stress beyond design limits during a storm. You must remotely assess the risk of failure and advise the crew.',
    tags: ['Offshore', 'Hydrodynamics', 'Structural Integrity'],
  },
  {
    id: 'tkel-coastal-erosion-solution',
    name: 'Coastal Erosion Dilemma',
    jobType: 'Ocean Engineering',
    level: ScenarioLevel.Expert,
    description: 'A coastal town wants you to design a sea wall to stop erosion, but environmental groups argue it will destroy local marine ecosystems. Propose an alternative solution.',
    tags: ['Coastal Engineering', 'Environment', 'Breakwater'],
  },
  // Teknik Perkapalan -> Naval Architecture
  {
    id: 'tper-ship-design-instability',
    name: 'New Ship Design Instability',
    jobType: 'Naval Architecture',
    level: ScenarioLevel.Expert,
    description: 'During sea trials, your new cargo ship design exhibits unexpected rolling behavior in moderate seas. Analyze the hydrostatics and propose urgent modifications.',
    tags: ['Naval Architecture', 'Ship Stability', 'Hydrostatics'],
  },
  {
    id: 'tper-propeller-cavitation',
    name: 'Propeller Cavitation Issue',
    jobType: 'Naval Architecture',
    level: ScenarioLevel.Newbie,
    description: 'A ship is reporting excessive vibration and noise. The data suggests propeller cavitation. You need to diagnose the cause and recommend a solution (e.g., new propeller design, operational changes).',
    tags: ['Propulsion', 'Cavitation', 'Fluid Dynamics'],
  },
  // Teknik Geomatika -> Geomatics Engineering
  {
    id: 'tgeo-landslide-prediction-error',
    name: 'Landslide Prediction Discrepancy',
    jobType: 'Geomatics Engineering',
    level: ScenarioLevel.Expert,
    description: 'Your GIS model predicted a low risk of landslide in an area where a minor slip has just occurred. You must re-evaluate your data (LiDAR, satellite imagery) to understand the failure.',
    tags: ['GIS', 'Remote Sensing', 'Natural Hazards'],
  },
  {
    id: 'tgeo-boundary-dispute',
    name: 'Property Boundary Dispute',
    jobType: 'Geomatics Engineering',
    level: ScenarioLevel.Newbie,
    description: 'Two landowners have a dispute, and your survey is the deciding factor. One party is pressuring you to adjust the findings. Uphold your professional ethics.',
    tags: ['Surveying', 'Land Law', 'Ethics'],
  },
  // Teknik Material & Metalurgi -> Material Engineering
  {
    id: 'tmat-turbine-blade-fracture',
    name: 'Wind Turbine Blade Fracture',
    jobType: 'Material & Metallurgy Engineering',
    level: ScenarioLevel.Specialist,
    description: 'A wind turbine blade made from a composite material you helped develop has fractured in the field. Conduct a failure analysis to determine if it was a material defect or design flaw.',
    tags: ['Fracture Analysis', 'Composites', 'Metallurgy'],
  },
  {
    id: 'tmat-biomedical-implant-corrosion',
    name: 'Biomedical Implant Corrosion',
    jobType: 'Material & Metallurgy Engineering',
    level: ScenarioLevel.Expert,
    description: 'A new type of metallic alloy used for biomedical implants is showing early signs of corrosion in some patients. Identify the corrosion mechanism and suggest a surface treatment.',
    tags: ['Biomaterials', 'Corrosion', 'Medical Devices'],
  },
   // Fisika -> Physics
  {
    id: 'fis-quantum-computing-decoherence',
    name: 'Quantum Computer Decoherence',
    jobType: 'Physics',
    level: ScenarioLevel.Specialist,
    description: 'Your experimental quantum computer is suffering from rapid qubit decoherence, rendering calculations useless. Theorize the source of environmental noise and design a shielding experiment.',
    tags: ['Quantum Physics', 'Experiment', 'Computation'],
  },
  // Kimia -> Chemistry
  {
    id: 'kim-spectroscopy-anomaly',
    name: 'Spectroscopy Anomaly',
    jobType: 'Chemistry',
    level: ScenarioLevel.Expert,
    description: 'An NMR spectrum for a newly synthesized compound shows unexpected peaks, suggesting an impurity or an entirely different molecule. Propose a series of experiments to identify the true structure.',
    tags: ['Organic Chemistry', 'Spectroscopy', 'Analysis'],
  },
  // Matematika -> Mathematics
  {
    id: 'mat-financial-model-collapse',
    name: 'Financial Model Collapse',
    jobType: 'Mathematics',
    level: ScenarioLevel.Specialist,
    description: 'A complex financial derivatives model you built is giving wildly inaccurate predictions in a volatile market. You must identify the flawed assumption in your stochastic equations before the company loses millions.',
    tags: ['Financial Math', 'Modeling', 'Stochastics'],
  },
  // Biologi -> Biology
  {
    id: 'bio-gmo-crop-contamination',
    name: 'GMO Crop Contamination',
    jobType: 'Biology',
    level: ScenarioLevel.Expert,
    description: 'An unapproved GMO crop you are developing in a test field has potentially cross-pollinated with a neighboring organic farm. As the lead biologist, you must manage the ecological and legal fallout.',
    tags: ['Genetics', 'Ecology', 'Bioethics'],
  },
  // Kedokteran -> Medicine
  {
    id: 'med-er-dilemma',
    name: 'ER Diagnostic Dilemma',
    jobType: 'Medicine',
    level: ScenarioLevel.Expert,
    description: 'A patient presents in the ER with a complex set of conflicting symptoms pointing towards several possible critical conditions. Prioritize diagnostic tests and initial treatment under extreme time pressure.',
    tags: ['Emergency Medicine', 'Diagnosis', 'Critical Care'],
  },
  {
    id: 'med-surgical-complication',
    name: 'Unexpected Surgical Complication',
    jobType: 'Medical Doctor Profession',
    level: ScenarioLevel.Specialist,
    description: 'During a routine laparoscopic surgery, you encounter an anatomical anomaly not seen on pre-op imaging, leading to a complication. You must adapt your surgical technique immediately.',
    tags: ['Surgery', 'Anatomy', 'Problem Solving'],
  },
  // Teknik Biomedik -> Biomedical Engineering
  {
    id: 'tbm-pacemaker-recall',
    name: 'Pacemaker Firmware Bug',
    jobType: 'Biomedical Engineering',
    level: ScenarioLevel.Expert,
    description: 'A firmware update for your company\'s pacemaker is causing rare but critical battery drain issues. You must analyze post-market surveillance data to identify the root cause and develop a safe patch.',
    tags: ['Medical Devices', 'Firmware', 'Root Cause Analysis'],
  },
  {
    id: 'tbm-prosthetic-design',
    name: 'Prosthetic Design Challenge',
    jobType: 'Biomedical Engineering',
    level: ScenarioLevel.Newbie,
    description: 'A patient requires a custom prosthetic arm. Balance the constraints of material weight, durability, cost, and user comfort to create an optimal design proposal.',
    tags: ['Prosthetics', 'Biomaterials', 'Design'],
  },
  // Teknik Komputer -> Computer Engineering
  {
    id: 'tkomp-iot-security',
    name: 'IoT Device Security Flaw',
    jobType: 'Computer Engineering',
    level: ScenarioLevel.Expert,
    description: 'A major security vulnerability is found in the embedded processor of your best-selling IoT home device. Devise a plan to patch millions of devices in the field without causing a mass bricking event.',
    tags: ['Embedded Systems', 'Cybersecurity', 'Firmware'],
  },
  {
    id: 'tkomp-cpu-architecture',
    name: 'CPU Cache Coherency Bug',
    jobType: 'Computer Engineering',
    level: ScenarioLevel.Specialist,
    description: 'A new multi-core processor design is failing validation due to a subtle cache coherency bug that only appears under specific, complex workloads. You need to debug the issue at the hardware level.',
    tags: ['CPU Design', 'Hardware', 'Debugging'],
  },
  // Manajemen Bisnis -> Business Management
  {
    id: 'mb-hostile-takeover',
    name: 'Hostile Takeover Threat',
    jobType: 'Business Management',
    level: ScenarioLevel.Expert,
    description: 'A rival company has launched a hostile takeover bid. As CEO, you must quickly formulate a defense strategy, communicate with shareholders, and maintain employee morale.',
    tags: ['Corporate Finance', 'Strategy', 'Leadership'],
  },
  {
    id: 'mb-product-launch-strategy',
    name: 'New Product Launch Strategy',
    jobType: 'Business Management',
    level: ScenarioLevel.Newbie,
    description: 'Your team is about to launch a new product into a competitive market. Decide on the final pricing, marketing channels, and launch timing to maximize impact.',
    tags: ['Marketing', 'Product Management', 'Strategy'],
  },
  // Aktuaria -> Actuarial Science
  {
    id: 'act-catastrophe-modeling',
    name: 'Catastrophe Bond Modeling',
    jobType: 'Actuarial Science',
    level: ScenarioLevel.Specialist,
    description: 'A major hurricane is predicted to make landfall in a densely insured area. You must rapidly update your catastrophe models to estimate potential losses and advise the company on its risk exposure.',
    tags: ['Insurance', 'Risk Modeling', 'Catastrophe'],
  },
  {
    id: 'act-premium-calculation',
    name: 'High-Risk Insurance Premium',
    jobType: 'Actuarial Science',
    level: ScenarioLevel.Newbie,
    description: 'A client with a hazardous occupation and a pre-existing medical condition is requesting a life insurance policy. Calculate a fair and sustainable premium based on the available data.',
    tags: ['Life Insurance', 'Underwriting', 'Pricing'],
  },
  // Teknik Lingkungan -> Environmental Engineering
  {
    id: 'tling-contamination-plume',
    name: 'Groundwater Contamination Plume',
    jobType: 'Environmental Engineering',
    level: ScenarioLevel.Expert,
    description: 'A toxic chemical from an old industrial site is found to be leaking into the groundwater and moving towards a residential area. Design an immediate containment and long-term remediation plan.',
    tags: ['Remediation', 'Hydrogeology', 'Public Health'],
  },
  // Desain Interior -> Interior Design
  {
    id: 'di-budget-conflict',
    name: 'Client Budget vs. Vision',
    jobType: 'Interior Design',
    level: ScenarioLevel.Newbie,
    description: 'Your client has a grand vision for their restaurant\'s interior but a very limited budget. Propose creative, cost-effective solutions using alternative materials and layouts without compromising the core design concept.',
    tags: ['Client Management', 'Budgeting', 'Material Sourcing'],
  },
  // Teknik Pangan -> Food Engineering
  {
    id: 'tp-shelf-life-issue',
    name: 'Unexpected Shelf-Life Failure',
    jobType: 'Food Engineering',
    level: ScenarioLevel.Expert,
    description: 'A new healthy snack product is showing signs of spoilage months before its calculated expiration date. Investigate the formulation and packaging process to find the root cause.',
    tags: ['Food Science', 'Quality Control', 'Packaging'],
  },
];


export const DUMMY_LEADERBOARD: LeaderboardUser[] = [
    { id: 'user-1', rank: 1, name: 'Intuition Master', profilePictureUrl: 'https://picsum.photos/id/1005/100/100', points: 15200, dailyStreak: 120 },
    { id: 'user-2', rank: 2, name: 'Strategist Supreme', profilePictureUrl: 'https://picsum.photos/id/1011/100/100', points: 14800, dailyStreak: 95 },
    { id: 'user-3', rank: 3, name: 'Pro Decision-Maker', profilePictureUrl: 'https://picsum.photos/id/1025/100/100', points: 13500, dailyStreak: 78 },
    { id: 'user-4', rank: 4, name: 'Quick Thinker', profilePictureUrl: 'https://picsum.photos/id/1027/100/100', points: 12100, dailyStreak: 50 },
    { id: 'user-5', rank: 5, name: 'Rising Star', profilePictureUrl: 'https://picsum.photos/id/1028/100/100', points: 11500, dailyStreak: 30 },
];

const dummyAnalysis: AnalysisReport = {
    overallScore: 85,
    strengths: ['Rapid problem identification', 'Calm under pressure', 'Effective stakeholder communication'],
    weaknesses: ['Over-reliance on initial data', 'Slight hesitation in high-stakes decisions'],
    optimizations: ['Incorporate diverse data points before finalizing strategy', 'Practice timed decision-making exercises to build confidence'],
    responseSpeedAnalysis: 'Your response time was quick and decisive, which is excellent for crisis situations.',
    cognitiveBiases: [
        { bias: 'Anchoring Bias', explanation: 'You seemed to focus heavily on the initial alert information without fully considering alternative possibilities.' }
    ],
    questionBreakdown: [
        { questionText: 'What is your first immediate action?', userAnswer: 'Isolate the systems.', aiFeedback: 'Correct. This is the best first step to contain the breach.' },
        { questionText: 'How do you communicate this to the executive team?', userAnswer: 'Send a brief email.', aiFeedback: 'Could be improved. A direct call is faster and conveys urgency more effectively.' }
    ],
    performanceData: [
        { name: 'Speed', value: 90 },
        { name: 'Accuracy', value: 80 },
        { name: 'Creativity', value: 75 },
        { name: 'Communication', value: 95 },
    ],
    decisionMakingData: [
        { name: 'Data-Driven', value: 60 },
        { name: 'Intuitive', value: 40 },
    ],
    suggestedResources: {
        keywords: ["Crisis Communication Plan", "IT Incident Response", "Anchoring Bias Mitigation"],
        references: [
            { title: "Building a Crisis Communication Plan - HubSpot", url: "https://blog.hubspot.com/service/crisis-communication-plan" },
            { title: "What is Anchoring Bias? - YouTube", url: "https://www.youtube.com/watch?v=fuM_w1aA6gQ" }
        ]
    }
};


export const DUMMY_HISTORY: Session[] = [
    { id: 'sess-1', scenarioId: 'dkv-rebranding-backlash', scenarioName: 'Client Rebranding Backlash', job_type: 'Visual Communication Design', level: ScenarioLevel.Expert, userId: '1', startTime: new Date('2023-10-26T10:00:00Z'), endTime: new Date('2023-10-26T10:15:00Z'), answers: [], score: 85, analysis: dummyAnalysis },
    { id: 'sess-2', scenarioId: 'mb-product-launch-strategy', scenarioName: 'New Product Launch Strategy', job_type: 'Business Management', level: ScenarioLevel.Newbie, userId: '1', startTime: new Date('2023-10-25T14:00:00Z'), endTime: new Date('2023-10-25T14:20:00Z'), answers: [], score: 72, analysis: {...dummyAnalysis, overallScore: 72, strengths: ['Good initial response', 'Creative problem solving'], weaknesses: ['Delayed communication with stakeholders']} },
    { id: 'sess-3', scenarioId: 'ti-supply-chain-disruption', scenarioName: 'Global Supply Chain Disruption', job_type: 'Industrial & Systems Engineering', level: ScenarioLevel.Expert, userId: '1', startTime: new Date('2023-10-24T09:30:00Z'), endTime: new Date('2023-10-24T09:48:00Z'), answers: [], score: 91, analysis: {...dummyAnalysis, overallScore: 91, performanceData: [{name: 'Speed', value: 95}, {name: 'Accuracy', value: 88}, {name: 'Creativity', value: 85}, {name: 'Communication', value: 92}]} },
];

export const DUMMY_WEEKLY_PROGRESS = [
    { day: 'Mon', score: 78 },
    { day: 'Tue', score: 85 },
    { day: 'Wed', score: 82 },
    { day: 'Thu', score: 91 },
    { day: 'Fri', score: 88 },
    { day: 'Sat', score: 0 },
    { day: 'Sun', score: 0 },
];

export const DUMMY_STREAK_INFO = {
    currentStreak: 5,
    longestStreak: 12,
};

export const DUMMY_NOTES: Note[] = [
    {
        id: 'note-1',
        content: 'Key takeaway from the "Zero-Day Vulnerability" scenario: Prioritize patching public-facing servers first. Communication plan is secondary but must be initiated within the first hour.',
        createdAt: new Date('2023-10-28T11:00:00Z'),
    },
    {
        id: 'note-2',
        content: 'Idea for a custom scenario: A key team member suddenly resigns mid-project. How to handle morale, knowledge transfer, and stakeholder expectations?',
        createdAt: new Date('2023-10-27T15:30:00Z'),
    },
    {
        id: 'note-3',
        content: 'Analysis of my own weakness: Tendency to over-gather data in time-sensitive situations. Need to practice making decisions with 70% of the information.',
        createdAt: new Date('2023-10-26T09:00:00Z'),
    },
];

export const DUMMY_BADGES: Badge[] = [
    { id: 'badge-1', name: 'First Session', description: 'Complete your first training scenario.', iconName: 'Award' },
    { id: 'badge-2', name: 'Five Day Streak', description: 'Maintain a training streak for 5 consecutive days.', iconName: 'Flame' },
    { id: 'badge-3', name: 'High Scorer', description: 'Achieve a score of 90 or higher in any scenario.', iconName: 'Trophy' },
    { id: 'badge-4', name: 'Specialist', description: 'Complete a "Specialist" level scenario.', iconName: 'BrainCircuit' },
    { id: 'badge-5', name: 'Marathon Runner', description: 'Complete 10 scenarios in total.', iconName: 'Star' },
    { id: 'badge-6', name: 'Perfectionist', description: 'Achieve a perfect score of 100 in any scenario.', iconName: 'Trophy' },
    { id: 'badge-7', name: 'Weekend Warrior', description: 'Complete a session on a Saturday or Sunday.', iconName: 'Star' },
    { id: 'badge-8', name: 'Night Owl', description: 'Complete a session between 10 PM and 4 AM.', iconName: 'Award' },
    { id: 'badge-9', name: 'AI Collaborator', description: 'Create your first custom scenario using AI.', iconName: 'BrainCircuit' },
    { id: 'badge-10', name: 'Strategic Thinker', description: 'Complete 5 "Expert" level scenarios.', iconName: 'Flame' },
];

export const DUMMY_USER_BADGES: UserBadge[] = [
    { userId: 'user-1', badgeId: 'badge-1', earnedAt: new Date() },
    { userId: 'user-1', badgeId: 'badge-2', earnedAt: new Date() },
    { userId: 'user-1', badgeId: 'badge-3', earnedAt: new Date() },
    { userId: 'user-1', badgeId: 'badge-6', earnedAt: new Date() },
    { userId: 'user-1', badgeId: 'badge-10', earnedAt: new Date() },
    { userId: 'user-2', badgeId: 'badge-1', earnedAt: new Date() },
    { userId: 'user-4', badgeId: 'badge-1', earnedAt: new Date() },
    { userId: 'user-4', badgeId: 'badge-5', earnedAt: new Date() },
    { userId: 'user-4', badgeId: 'badge-7', earnedAt: new Date() },
];

// --- New Dummy Data for Retention Features ---

export const DUMMY_DAILY_QUESTS: DailyQuest[] = [
  { id: 'quest-1', title: 'Complete a Session', description: 'Finish any training scenario.', xp: 20, progress: 1, target: 1 },
  { id: 'quest-2', title: 'Score 85+ Points', description: 'Achieve a score of 85 or higher.', xp: 30, progress: 0, target: 1 },
  { id: 'quest-3', title: 'Use AI Note Suggestion', description: 'Get a suggestion for one of your notes.', xp: 10, progress: 0, target: 1 },
];

export const DUMMY_WEEKLY_LEAGUE: UserLeague[] = [
  { id: 'user-12', rank: 1, name: 'Data Dynamo', profilePictureUrl: 'https://picsum.photos/id/201/100/100', points: 1250, league: 'Silver' },
  { id: 'user-15', rank: 2, name: 'Logic Lord', profilePictureUrl: 'https://picsum.photos/id/202/100/100', points: 1180, league: 'Silver' },
  { id: 'user-4', rank: 3, name: 'Quick Thinker', profilePictureUrl: 'https://picsum.photos/id/1027/100/100', points: 1150, league: 'Silver' }, // Current user
  { id: 'user-18', rank: 4, name: 'Analyst Ace', profilePictureUrl: 'https://picsum.photos/id/203/100/100', points: 1120, league: 'Silver' },
  { id: 'user-22', rank: 5, name: 'Mind Mapper', profilePictureUrl: 'https://picsum.photos/id/204/100/100', points: 980, league: 'Silver' },
];

export const DUMMY_SKILL_TREE: SkillNode[] = [
  // Core
  { id: 'core-1', name: 'Problem Identification', description: 'Ability to quickly and accurately identify the core issue in a complex situation.', level: 2, xp: 50, xpToNextLevel: 150, position: { x: 50, y: 10 }, dependencies: [] },
  // Branch 1: Communication
  { id: 'comm-1', name: 'Crisis Communication', description: 'Effectively communicating under pressure to stakeholders, teams, and the public.', level: 1, xp: 80, xpToNextLevel: 100, position: { x: 20, y: 30 }, dependencies: ['core-1'] },
  { id: 'comm-2', name: 'Stakeholder Mgt.', description: 'Managing expectations and aligning diverse groups of stakeholders.', level: 1, xp: 20, xpToNextLevel: 100, position: { x: 20, y: 50 }, dependencies: ['comm-1'] },
  { id: 'comm-3', name: 'Negotiation', description: 'Finding compromises and achieving favorable outcomes in difficult conversations.', level: 0, xp: 0, xpToNextLevel: 100, position: { x: 20, y: 70 }, dependencies: ['comm-2'] },
  // Branch 2: Strategy
  { id: 'strat-1', name: 'Risk Assessment', description: 'Evaluating potential risks and their impact to make informed decisions.', level: 2, xp: 110, xpToNextLevel: 150, position: { x: 80, y: 30 }, dependencies: ['core-1'] },
  { id: 'strat-2', name: 'Data-Driven Prioritization', description: 'Using data to effectively prioritize tasks and resources.', level: 1, xp: 45, xpToNextLevel: 100, position: { x: 80, y: 50 }, dependencies: ['strat-1'] },
  { id: 'strat-3', name: 'Creative Problem Solving', description: 'Developing innovative solutions to non-standard problems.', level: 0, xp: 0, xpToNextLevel: 100, position: { x: 80, y: 70 }, dependencies: ['strat-2'] },
];
