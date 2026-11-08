// =============================================================================
// CONTEXT — ThemeContext.tsx
// =============================================================================
//
// 📚 REACT LESSON: useContext (Context API)
// -------------------------------------------
// PROBLEM: Imagine you have this component tree:
//
//   App
//   └── Navbar      ← needs to know: is it dark mode?
//   └── Converter   ← needs to know: is it dark mode?
//       └── Card    ← needs to know: is it dark mode?
//
// You COULD pass the theme as a prop from App → Navbar → Card...
// But that's "prop drilling" — messy and annoying.
//
// SOLUTION: Context!
// Context is like a "global variable" that any component can READ directly,
// without having to pass it through every parent.
//
// HOW IT WORKS:
//   1. Create a Context (this file)
//   2. Wrap your app in a <Provider> (gives the value to all children)
//   3. Any component calls useContext() to READ the value
//
// =============================================================================

import React, { createContext, useContext, useState, useEffect } from 'react';
import { getSavedTheme, saveTheme } from '../utils/storage';

// ---------------------------------------------------------------------------
// STEP 1: Define what the Context contains (TypeScript interface)
// ---------------------------------------------------------------------------
interface ThemeContextValue {
  theme: 'light' | 'dark';
  toggleTheme: () => void;   // Function that switches light ↔ dark
}

// ---------------------------------------------------------------------------
// STEP 2: Create the Context
// We pass a default value, but it'll be overridden by the Provider below
// ---------------------------------------------------------------------------
const ThemeContext = createContext<ThemeContextValue>({
  theme: 'light',
  toggleTheme: () => {},  // empty function as placeholder
});

// ---------------------------------------------------------------------------
// STEP 3: Create the Provider Component
// This wraps your entire app and "provides" the theme to all children
// ---------------------------------------------------------------------------
interface ThemeProviderProps {
  children: React.ReactNode;  // 📚 ReactNode = anything React can render (JSX, string, etc.)
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  // 📚 useState — stores the current theme in React's memory
  // Initial value comes from localStorage (or 'light' if not saved yet)
  const [theme, setTheme] = useState<'light' | 'dark'>(getSavedTheme);
  //                                                    ↑ Note: we pass the FUNCTION, not the result.
  //                                                      useState will call it ONCE on first render.
  //                                                      This is called a "lazy initializer".

  // 📚 useEffect — runs AFTER the component renders
  // When theme changes: update the HTML data-theme attribute + save to localStorage
  useEffect(() => {
    // This sets data-theme="dark" or data-theme="light" on <html>
    // Our CSS uses [data-theme="dark"] to switch colors
    document.documentElement.setAttribute('data-theme', theme);
    
    // Save to localStorage so it persists on page reload
    saveTheme(theme);
  }, [theme]);
  // ↑ [theme] is the "dependency array" — useEffect ONLY re-runs when 'theme' changes

  // Toggle between light and dark
  function toggleTheme() {
    // 📚 setTheme with a function: React gives us the CURRENT value (prev)
    // and we return the NEW value. This avoids stale state bugs.
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  }

  // Provide both the value AND the toggle function to all children
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// ---------------------------------------------------------------------------
// STEP 4: Custom hook — makes it easy to USE the context in any component
// Instead of: const { theme, toggleTheme } = useContext(ThemeContext)
// You write:  const { theme, toggleTheme } = useTheme()
// ---------------------------------------------------------------------------
export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  return context;
}
