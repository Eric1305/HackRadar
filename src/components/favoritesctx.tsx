// src/context/FavoritesContext.tsx
import "@/index.css";
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export type Hackathon = {
  hackathon_id?: number;
  id?: number;
  name: string;
  state_region: string;
  start_date: string;
  end_date: string;
};

type FavoritesContextValue = {
  favorites: Hackathon[];
  toggleFavorite: (hackathon: Hackathon) => void;
  isFavorite: (id: number | undefined) => boolean;
};

const FavoritesContext = createContext<FavoritesContextValue | undefined>(
  undefined
);

const STORAGE_KEY = "hackradar:favorites";

export const FavoritesProvider = ({ children }: { children: ReactNode }) => {
  const [favorites, setFavorites] = useState<Hackathon[]>([]);

  // Load from localStorage on first mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Hackathon[];
        setFavorites(parsed);
      }
    } catch (err) {
      console.error("Failed to read favorites from localStorage:", err);
    }
  }, []);

  // Persist to localStorage whenever favorites change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
    } catch (err) {
      console.error("Failed to save favorites to localStorage:", err);
    }
  }, [favorites]);

  const isFavorite = (id: number | undefined) => {
    if (id == null) return false;
    return favorites.some(
      (h) => (h.hackathon_id ?? h.id) === id
    );
  };

  const toggleFavorite = (hackathon: Hackathon) => {
    const id = hackathon.hackathon_id ?? hackathon.id;
    if (id == null) return;

    setFavorites((prev) => {
      const exists = prev.some(
        (h) => (h.hackathon_id ?? h.id) === id
      );
      if (exists) {
        // remove
        return prev.filter((h) => (h.hackathon_id ?? h.id) !== id);
      }
      // add
      return [...prev, hackathon];
    });
  };

  return (
    <FavoritesContext.Provider
      value={{ favorites, toggleFavorite, isFavorite }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = (): FavoritesContextValue => {
  const ctx = useContext(FavoritesContext);
  if (!ctx) {
    throw new Error("useFavorites must be used inside <FavoritesProvider>");
  }
  return ctx;
};
