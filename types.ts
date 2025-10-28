

export interface User {
  id: string;
  name: string;
  email: string;
  profilePictureUrl: string;
  hobbies: string[];
  contacts: {
    instagram?: string;
    twitter?: string;
  };
}

export enum ScenarioLevel {
  Newbie = 'Newbie',
  Expert = 'Expert',
  Specialist = 'Specialist',
}

export interface ScenarioTemplate {
  id: string;
  name: string;
  jobType: string;
  level: ScenarioLevel;
  description: string;
  tags: string[];
  authorId?: string;
  authorName?: string;
  isPublished?: boolean;
  createdAt?: Date;
  authorProfilePictureUrl?: string;
  questions?: Question[];
}

export enum QuestionType {
  MultipleChoice = 'multiple-choice',
  Situation = 'situation-based',
  // OpenEnded is no longer used, all questions will have options + a text field.
  OpenEnded = 'open-ended', 
}

export interface Question {
  id: number;
  type: QuestionType;
  text: string;
  options?: string[];
}

export interface Session {
  id: string;
  scenarioId: string;
  scenarioName: string;
  // Denormalized fields for performance and custom scenarios
  job_type: string;
  level: ScenarioLevel;
  userId: string;
  startTime: Date;
  endTime: Date;
  answers: { questionId: number; answer: string }[];
  score: number;
  analysis: AnalysisReport;
}

export interface AnalysisReport {
  overallScore: number; // 0-100
  strengths: string[];
  weaknesses: string[];
  optimizations: string[];
  responseSpeedAnalysis: string;
  cognitiveBiases: {
    bias: string;
    explanation: string;
  }[];
  questionBreakdown: {
    questionText: string;
    userAnswer: string;
    aiFeedback: string;
  }[];
  performanceData: {
    name: string;
    value: number;
  }[]; // For bar chart
  decisionMakingData: {
    name: string;
    value: number;
  }[]; // For pie chart
  suggestedResources: {
    keywords: string[];
    references: {
      title: string;
      url: string;
    }[];
  };
}

export interface LeaderboardUser {
    id: string;
    rank: number;
    name: string;
    profilePictureUrl: string;
    points: number;
    dailyStreak: number;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  iconName: 'Award' | 'Star' | 'Flame' | 'BrainCircuit' | 'Trophy';
}

export interface UserBadge {
  userId: string;
  badgeId: string;
  earnedAt: Date;
}

export interface Note {
  id: string;
  content: string;
  createdAt: Date;
  reminderAt?: Date | null;
}

export enum TaskPriority {
  Low = 'Low',
  Medium = 'Medium',
  High = 'High',
}

export enum TaskStatus {
  ToDo = 'To Do',
  InProgress = 'In Progress',
  Done = 'Done',
}

export interface Task {
  id: string;
  title: string;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate: string | null;
  xp: number;
}

// FIX: Added FlowNode interface to define the structure for nodes in the development flowchart feature.
export interface FlowNode {
  id: string;
  position: { x: number; y: number };
  content: string;
}

// --- New Types for Retention Features ---

export interface DailyQuest {
  id: string;
  title: string;
  description: string;
  xp: number;
  progress: number;
  target: number;
}

export interface UserLeague {
  id: string;
  rank: number;
  name: string;
  profilePictureUrl: string;
  points: number;
  league: 'Bronze' | 'Silver' | 'Gold' | 'Diamond';
}

export interface SkillNode {
  id: string;
  name: string;
  description: string;
  level: number; // 0 for locked, 1 for Bronze, 2 for Silver, 3 for Gold
  xp: number;
  xpToNextLevel: number;
  position: { x: number; y: number };
  dependencies: string[];
}