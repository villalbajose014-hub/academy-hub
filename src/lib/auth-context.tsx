import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";

export type UserRole = "mentor" | "student";

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  role: UserRole | null;
  userName: string;
  user: User | null;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [userName, setUserName] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        setUser(session.user);
        // Fetch profile
        const { data: profile } = await supabase
          .from("profiles")
          .select("full_name, role")
          .eq("user_id", session.user.id)
          .single();
        if (profile) {
          setRole(profile.role as UserRole);
          setUserName(profile.full_name);
        }
      } else {
        setUser(null);
        setRole(null);
        setUserName("");
      }
      setIsLoading(false);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
        supabase
          .from("profiles")
          .select("full_name, role")
          .eq("user_id", session.user.id)
          .single()
          .then(({ data: profile }) => {
            if (profile) {
              setRole(profile.role as UserRole);
              setUserName(profile.full_name);
            }
            setIsLoading(false);
          });
      } else {
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const logout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated: !!user, isLoading, role, userName, user, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
