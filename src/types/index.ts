// User types
export interface User {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
  language_preferences?: string[];
  learning_goals?: string;
}

export interface Session {
  user: User;
  access_token: string;
  refresh_token: string;
}

// Course types
export interface Language {
  id: string;
  code: string;
  name: string;
  flag: string;
}

export interface Course {
  id: string;
  language_id: string;
  language: string;
  level: string;
  title: string;
  description: string;
  image_url?: string;
  lessons?: Lesson[];
}

export interface Lesson {
  id: string;
  course_id: string;
  title: string;
  description: string;
  order_number: number;
  modules?: Module[];
}

export interface Module {
  id: string;
  lesson_id: string;
  type: 'vocabulary' | 'grammar' | 'oral' | 'listening';
  title: string;
  content: any;
  order_number: number;
}

// Progress types
export interface Progress {
  id: string;
  user_id: string;
  module_id: string;
  completed: boolean;
  score: number;
  last_accessed: string;
}

export interface Statistics {
  user_id: string;
  total_time_spent: number;
  completed_modules: number;
  streak: number;
  achievements: Achievement[];
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked_at?: string;
}

// Community types
export interface Post {
  id: string;
  user_id: string;
  title: string;
  content: string;
  created_at: string;
  likes: number;
  comments?: Comment[];
  user?: User;
}

export interface Comment {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  created_at: string;
  user?: User;
}

export interface LeaderboardEntry {
  id: string;
  user_id: string;
  name: string;
  points: number;
  rank: number;
}
