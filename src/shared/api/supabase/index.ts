import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Helper to check if URL is valid
const isValidUrl = (url: string) => {
  try {
    return url.startsWith('http');
  } catch {
    return false;
  }
};

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  isValidUrl(supabaseUrl) && 
  supabaseUrl !== 'your-supabase-url'
);

if (!isSupabaseConfigured) {
  console.warn('Supabase configuration is missing or invalid. App will run with a mock client (local-only mode).');
}

// Export the client only if credentials are valid, otherwise export a proxy
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : createMockSupabase();

function createMockSupabase() {
  const loggedMethods = new Set<string>();
  
  const mock: any = new Proxy(() => mock, {
    get: (_target, prop) => {
      const methodName = String(prop);

      // 1. Promise Support (await supabase...)
      if (prop === 'then') {
        return (resolve: any) => resolve({ data: null, error: null, session: null, user: null });
      }

      // 2. Auth object nested access (supabase.auth.getSession)
      if (prop === 'auth') {
        return mock;
      }

      // 3. Chainable methods (supabase.from().select()...)
      const fn = (..._args: any[]) => {
        if (!loggedMethods.has(methodName) && !['from', 'select', 'eq', 'order', 'in', 'on'].includes(methodName)) {
          console.warn(`[Supabase Mock] "${methodName}" call ignored (Check .env)`);
          loggedMethods.add(methodName);
        }
        return mock;
      };

      // Ensure the function itself can have further properties accessed
      return new Proxy(fn, {
        get: (_t, p) => mock[p]
      });
    },
    apply: () => mock
  });

  return mock;
}
