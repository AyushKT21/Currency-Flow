// =============================================================================
// UTILITY — storage.ts
// =============================================================================
//
// 📚 REACT LESSON: localStorage
// --------------------------------
// localStorage is a browser feature that lets you SAVE data permanently
// in the user's browser. It survives page refreshes and browser restarts.
//
// KEY FACTS:
//   - localStorage only stores STRINGS (no objects, numbers, arrays directly)
//   - JSON.stringify() converts an object → string  (to SAVE)
//   - JSON.parse()     converts a string → object  (to READ)
//
// EXAMPLE (basic localStorage):
//   localStorage.setItem("name", "Rahul");         // save
//   const name = localStorage.getItem("name");      // read → "Rahul"
//   localStorage.removeItem("name");               // delete
//
// WHY a separate storage.ts file?
//   - Because we always want to read/write history the SAME way.
//   - If we change the format later, we change it here, not everywhere.
//
// =============================================================================

import type { ConversionRecord } from '../types/currency';

// The key we use to store history in localStorage
// Using a constant prevents typos like "converstionHistory" vs "conversionHistory"
const HISTORY_KEY = 'currencyflow_history';
const THEME_KEY = 'currencyflow_theme';

// Maximum number of conversions to keep in history
const MAX_HISTORY = 50;

// ---------------------------------------------------------------------------
// CONVERSION HISTORY
// ---------------------------------------------------------------------------

// Read all saved conversions from localStorage
// Returns an empty array [] if nothing is saved yet
export function getHistory(): ConversionRecord[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    // If nothing saved yet, raw will be null → return []
    if (!raw) return [];
    
    // Parse the JSON string back into an array of ConversionRecord objects
    return JSON.parse(raw) as ConversionRecord[];
  } catch {
    // If JSON.parse fails (corrupted data), return empty array
    console.error('Failed to read history from localStorage');
    return [];
  }
}

// Save a new conversion to the beginning of history
export function addToHistory(record: ConversionRecord): void {
  const existing = getHistory();
  
  // Add the new record at the START of the array (newest first)
  // The spread operator [...arr] creates a new array copy
  const updated = [record, ...existing].slice(0, MAX_HISTORY);
  //                                    ↑ .slice(0, 50) keeps only the newest 50 items
  
  // Convert to JSON string and save
  localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
}

// Delete a single conversion by its ID
export function removeFromHistory(id: string): void {
  const existing = getHistory();
  
  // .filter() creates a new array keeping only items where the condition is TRUE
  // So we keep everything EXCEPT the item with the matching id
  const updated = existing.filter(record => record.id !== id);
  
  localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
}

// Delete ALL conversions
export function clearHistory(): void {
  localStorage.removeItem(HISTORY_KEY);
}

// ---------------------------------------------------------------------------
// THEME PREFERENCE
// ---------------------------------------------------------------------------

// Read the saved theme ('light' or 'dark')
// If nothing saved, defaults to 'light'
export function getSavedTheme(): 'light' | 'dark' {
  const saved = localStorage.getItem(THEME_KEY);
  // The 'as' tells TypeScript "trust me, I know this is this type"
  return (saved === 'dark' ? 'dark' : 'light');
}

// Save the current theme preference
export function saveTheme(theme: 'light' | 'dark'): void {
  localStorage.setItem(THEME_KEY, theme);
}
