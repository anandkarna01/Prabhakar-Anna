
import React, { createContext, useState, useContext, ReactNode, useCallback, useEffect } from 'react';
import { Vegetable, User, UserRole } from '../types.ts';
import { api } from '../api.ts';

interface AppContextType {
  vegetables: Vegetable[];
  currentUser: User | null;
  login: (name: string, mobile: string, role: UserRole) => Promise<boolean>;
  logout: () => void;
  addLocalVegetable: (veg: Vegetable) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const USER_SESSION_KEY = 'prabha-vegetables-session';

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [vegetables, setVegetables] = useState<Vegetable[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Effect to load session and initial data on mount
  useEffect(() => {
    const bootstrap = async () => {
      try {
        const savedUserJSON = sessionStorage.getItem(USER_SESSION_KEY);
        if (savedUserJSON) {
          setCurrentUser(JSON.parse(savedUserJSON));
        }
        const fetchedVegetables = await api.getVegetables();
        setVegetables(fetchedVegetables);
      } catch (error) {
        console.error("Failed to bootstrap application", error);
      } finally {
        setIsLoading(false);
      }
    };
    bootstrap();
  }, []);

  const login = useCallback(async (name: string, mobile: string, role: UserRole): Promise<boolean> => {
    const user = await api.login(name, mobile, role);
    if (user) {
      setCurrentUser(user);
      sessionStorage.setItem(USER_SESSION_KEY, JSON.stringify(user));
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    setCurrentUser(null);
    sessionStorage.removeItem(USER_SESSION_KEY);
  }, []);
  
  const addLocalVegetable = useCallback((veg: Vegetable) => {
    setVegetables(prev => [...prev, veg]);
  }, []);


  const value = { vegetables, currentUser, login, logout, addLocalVegetable };

  // Render a loading state while fetching initial data
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-green-50">
        <p className="text-xl text-green-700 font-semibold animate-pulse">Loading Prabha Vegetables...</p>
      </div>
    );
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
