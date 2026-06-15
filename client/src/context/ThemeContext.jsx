import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext(undefined);

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(() => {
    return localStorage.getItem('theme') || 'system';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const resolveAndApplyTheme = () => {
      // Determine final state based on explicit override or device baseline
      const useDark = 
        theme === 'dark' || 
        (theme === 'system' && mediaQuery.matches);

      if (useDark) {
        root.classList.add('dark');
        root.style.backgroundColor = '#0a0a0a';
      } else {
        root.classList.remove('dark');
        root.style.backgroundColor = '#fafafa';
      }
    };

    resolveAndApplyTheme();
    localStorage.setItem('theme', theme);

    // Provide active listeners to shift layouts dynamically if set to system
    const handleSystemChange = () => {
      if (theme === 'system') resolveAndApplyTheme();
    };

    mediaQuery.addEventListener('change', handleSystemChange);
    return () => mediaQuery.removeEventListener('change', handleSystemChange);
  }, [theme]);

  const setTheme = (newTheme) => {
    setThemeState(newTheme);
  };

  // Resolve the actual visible state down to a pure string for third-party scripts
  const resolvedMode = 
    theme === 'system' 
      ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
      : theme;

  return (
    <ThemeContext.Provider value={{ theme, resolvedMode, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be inside a ThemeProvider');
  return context;
}