import { create } from 'zustand';
import { supabase } from './supabase';
import { User, Course, Progress, Achievement, Post, Language } from '../types';

interface StoreState {
  // User state
  user: User | null;
  isLoading: boolean;
  error: string | null;
  
  // Course state
  languages: Language[];
  courses: Course[];
  selectedLanguage: string | null;
  selectedCourse: Course | null;
  
  // Progress state
  progress: Progress[];
  achievements: Achievement[];
  
  // Community state
  posts: Post[];
  
  // Actions
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  loadUser: () => Promise<void>;
  loadLanguages: () => Promise<void>;
  loadCourses: (languageId: string) => Promise<void>;
  selectCourse: (course: Course) => void;
  updateProgress: (moduleId: string, completed: boolean, score: number) => Promise<void>;
  loadProgress: () => Promise<void>;
  loadAchievements: () => Promise<void>;
  loadPosts: () => Promise<void>;
  createPost: (title: string, content: string) => Promise<void>;
}

export const useStore = create<StoreState>((set, get) => ({
  // Initial state
  user: null,
  isLoading: false,
  error: null,
  languages: [],
  courses: [],
  selectedLanguage: null,
  selectedCourse: null,
  progress: [],
  achievements: [],
  posts: [],
  
  // Authentication actions
  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      if (data.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();
        
        set({ 
          user: {
            id: data.user.id,
            email: data.user.email || '',
            name: profile?.name || data.user.email || '',
            avatar_url: profile?.avatar_url,
            language_preferences: profile?.language_preferences,
            learning_goals: profile?.learning_goals
          }
        });
      }
    } catch (error: any) {
      set({ error: error.message });
    } finally {
      set({ isLoading: false });
    }
  },
  
  register: async (email, password, name) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;
      if (data.user) {
        // Create profile
        await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            name,
            language_preferences: [],
            learning_goals: ''
          });
        
        set({ 
          user: {
            id: data.user.id,
            email: data.user.email || '',
            name,
            language_preferences: [],
            learning_goals: ''
          }
        });
      }
    } catch (error: any) {
      set({ error: error.message });
    } finally {
      set({ isLoading: false });
    }
  },
  
  logout: async () => {
    set({ isLoading: true });
    try {
      await supabase.auth.signOut();
      set({ user: null });
    } catch (error: any) {
      set({ error: error.message });
    } finally {
      set({ isLoading: false });
    }
  },
  
  loadUser: async () => {
    set({ isLoading: true });
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        
        set({ 
          user: {
            id: user.id,
            email: user.email || '',
            name: profile?.name || user.email || '',
            avatar_url: profile?.avatar_url,
            language_preferences: profile?.language_preferences,
            learning_goals: profile?.learning_goals
          }
        });
      }
    } catch (error: any) {
      set({ error: error.message });
    } finally {
      set({ isLoading: false });
    }
  },
  
  // Course actions
  loadLanguages: async () => {
    set({ isLoading: true });
    try {
      const { data, error } = await supabase.from('languages').select('*');
      if (error) throw error;
      set({ languages: data || [] });
    } catch (error: any) {
      set({ error: error.message });
    } finally {
      set({ isLoading: false });
    }
  },
  
  loadCourses: async (languageId) => {
    set({ isLoading: true, selectedLanguage: languageId });
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('language_id', languageId);
      if (error) throw error;
      set({ courses: data || [] });
    } catch (error: any) {
      set({ error: error.message });
    } finally {
      set({ isLoading: false });
    }
  },
  
  selectCourse: (course) => {
    set({ selectedCourse: course });
  },
  
  // Progress actions
  updateProgress: async (moduleId, completed, score) => {
    const user = get().user;
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('progress')
        .upsert({
          user_id: user.id,
          module_id: moduleId,
          completed,
          score,
          last_accessed: new Date().toISOString()
        });
      if (error) throw error;
      await get().loadProgress();
    } catch (error: any) {
      set({ error: error.message });
    }
  },
  
  loadProgress: async () => {
    const user = get().user;
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('progress')
        .select('*')
        .eq('user_id', user.id);
      if (error) throw error;
      set({ progress: data || [] });
    } catch (error: any) {
      set({ error: error.message });
    }
  },
  
  loadAchievements: async () => {
    const user = get().user;
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('user_achievements')
        .select('achievements(*)')
        .eq('user_id', user.id);
      if (error) throw error;
      const achievements = data?.map(ua => ua.achievements) || [];
      set({ achievements });
    } catch (error: any) {
      set({ error: error.message });
    }
  },
  
  // Community actions
  loadPosts: async () => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*, users(*)')
        .order('created_at', { ascending: false });
      if (error) throw error;
      set({ posts: data || [] });
    } catch (error: any) {
      set({ error: error.message });
    }
  },
  
  createPost: async (title, content) => {
    const user = get().user;
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('posts')
        .insert({
          user_id: user.id,
          title,
          content
        });
      if (error) throw error;
      await get().loadPosts();
    } catch (error: any) {
      set({ error: error.message });
    }
  }
}));
