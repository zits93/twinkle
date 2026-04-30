/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from 'zustand';
import { type User, type Session, type AuthChangeEvent } from '@supabase/supabase-js';
import { supabase } from '@shared/api/supabase';

interface SessionState {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  setSession: (session: Session | null) => void;
  initialize: () => Promise<void>;
  signOut: () => Promise<void>;
}

export const useSessionStore = create<SessionState>((set) => ({
  user: null,
  session: null,
  isLoading: true,

  setSession: (session) => {
    set({ 
      session, 
      user: session?.user ?? null, 
      isLoading: false 
    });
  },

  initialize: async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      set({ 
        session, 
        user: session?.user ?? null, 
        isLoading: false 
      });

      // Listen for auth changes
      supabase.auth.onAuthStateChange((_event: any, session: any /* eslint-disable-line @typescript-eslint/no-explicit-any */) => {
        set({ 
          session, 
          user: session?.user ?? null,
          isLoading: false
        });
      });
    } catch (error) {
      console.error('Failed to initialize auth session:', error);
      set({ isLoading: false });
    }
  },

  signOut: async () => {
    await supabase.auth.signOut();
    set({ user: null, session: null });
  }
}));
