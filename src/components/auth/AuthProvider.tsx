import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { User } from '@supabase/supabase-js';
import { useToast } from "@/components/ui/use-toast";

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  isLoading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAdmin: false,
  isLoading: true,
  signOut: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const checkAdminRole = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) {
        console.error('Error checking admin role:', error);
        return false;
      }

      return data?.role === 'admin';
    } catch (error) {
      console.error('Error checking admin role:', error);
      return false;
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setIsAdmin(false);
    } catch (error) {
      toast({
        title: "Error signing out",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    console.log('AuthProvider mounted');
    let mounted = true;

    const initAuth = async () => {
      try {
        console.log('Initializing auth...');
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          return;
        }

        if (!mounted) return;

        if (session?.user) {
          console.log('Session found:', session.user);
          setUser(session.user);
          const isUserAdmin = await checkAdminRole(session.user.id);
          if (mounted) {
            setIsAdmin(isUserAdmin);
            console.log('Admin status:', isUserAdmin);
          }
        } else {
          console.log('No session found');
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        if (mounted) {
          setIsLoading(false);
          console.log('Auth initialization complete');
        }
      }
    };

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session);
      
      if (!mounted) return;

      if (event === 'SIGNED_OUT') {
        setUser(null);
        setIsAdmin(false);
        setIsLoading(false);
        console.log('User signed out');
        return;
      }

      if (session?.user) {
        setUser(session.user);
        const isUserAdmin = await checkAdminRole(session.user.id);
        if (mounted) {
          setIsAdmin(isUserAdmin);
          console.log('User signed in:', session.user, 'Admin:', isUserAdmin);
        }
      } else {
        setUser(null);
        setIsAdmin(false);
        console.log('No user in session');
      }
      
      setIsLoading(false);
    });

    return () => {
      console.log('AuthProvider unmounting');
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const value = {
    user,
    isAdmin,
    isLoading,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);