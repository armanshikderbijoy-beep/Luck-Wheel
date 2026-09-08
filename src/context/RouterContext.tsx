import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { PageRoute } from '../types';

interface RouterContextValue {
  currentPath: PageRoute;
  navigate: (to: PageRoute) => void;
}

const RouterContext = createContext<RouterContextValue | undefined>(undefined);

function normalizePath(pathname: string): PageRoute {
  const clean = pathname.replace(/\/$/, '') || '/';
  if (clean === '/wheel-spinner') return '/wheel-spinner';
  if (clean === '/privacy-policy') return '/privacy-policy';
  if (clean === '/terms') return '/terms';
  if (clean === '/contact') return '/contact';
  return '/';
}

export function RouterProvider({ children }: { children: React.ReactNode }) {
  const [currentPath, setCurrentPath] = useState<PageRoute>(() => {
    if (typeof window === 'undefined') return '/';
    return normalizePath(window.location.pathname);
  });

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(normalizePath(window.location.pathname));
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = useCallback((to: PageRoute) => {
    if (to !== currentPath) {
      window.history.pushState({}, '', to);
      setCurrentPath(to);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentPath]);

  return (
    <RouterContext.Provider value={{ currentPath, navigate }}>
      {children}
    </RouterContext.Provider>
  );
}

export function useRouter(): RouterContextValue {
  const context = useContext(RouterContext);
  if (!context) {
    throw new Error('useRouter must be used within a RouterProvider');
  }
  return context;
}
