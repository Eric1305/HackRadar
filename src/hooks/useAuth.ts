import { useEffect, useState } from "react";

type HackRadarUser = {
  user_id: number;
  email: string;
};

const STORAGE_KEY = "hackradar_user";

export default function useAuth() {
  const [user, setUser] = useState<HackRadarUser | null>(null);

  // Load user from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as HackRadarUser;
        setUser(parsed);
      } catch {
        setUser(null);
      }
    }
  }, []);

  const login = (u: HackRadarUser) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
    setUser(u);
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
  };

  return { user, login, logout };
}
