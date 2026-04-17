import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext(null);

export const useTheme = () => useContext(ThemeContext);

export function ThemeProvider({ children }) {
  // Mixed theme doesn't use a global toggle
  const dark = false;

  useEffect(() => {
    document.documentElement.classList.remove('dark');
  }, []);

  const toggle = () => {
    // Theme toggle disabled
  };

  return (
    <ThemeContext.Provider value={{ dark, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}
