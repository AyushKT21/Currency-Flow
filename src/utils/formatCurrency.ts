// =============================================================================
// UTILITY — formatCurrency.ts
// =============================================================================
//
// 📚 REACT LESSON: Utility Functions
// ------------------------------------
// "Utility functions" are small helper functions that do ONE specific job.
// They are NOT React components — just regular JavaScript/TypeScript functions.
// Keep them separate so your components stay clean and focused.
//
// =============================================================================

// Format a number as a localized currency string
// Example: formatAmount(8354.5) => "8,354.50"
export function formatAmount(amount: number, decimals: number = 2): string {
  // Intl.NumberFormat is a built-in JavaScript API for number formatting
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(amount);
}

// Format a date string from "YYYY-MM-DD" to a readable format
// Example: formatDate("2025-04-26") => "Apr 26, 2025"
export function formatDate(dateString: string): string {
  // We add T12:00:00 to avoid timezone issues that shift the date by a day
  const date = new Date(dateString + 'T12:00:00');
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

// Format a timestamp ISO string to a readable date+time
// Example: "2025-04-26T10:30:00" => "Apr 26, 2025 • 10:30 AM"
export function formatTimestamp(isoString: string): string {
  const date = new Date(isoString);
  const datePart = date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
  const timePart = date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
  return `${datePart} • ${timePart}`;
}

// Format the exchange rate for display
// Example: formatRate(83.54, "USD", "INR") => "1 USD = 83.54 INR"
export function formatRate(rate: number, fromCode: string, toCode: string): string {
  return `1 ${fromCode} = ${formatAmount(rate)} ${toCode}`;
}

// Get today's date in "YYYY-MM-DD" format (for default date picker value)
export function getTodayString(): string {
  return new Date().toISOString().split('T')[0];
}

// Get a date N days ago in "YYYY-MM-DD" format
// Example: getDaysAgo(30) => "2025-03-27"
export function getDaysAgo(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString().split('T')[0];
}

// Generate a simple unique ID for conversion records
// Uses timestamp + random number to ensure uniqueness
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}
