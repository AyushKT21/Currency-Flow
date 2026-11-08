// =============================================================================
// CURRENCY METADATA — currencies.ts
// =============================================================================
//
// 📚 REACT LESSON: Separating static data from components
// ---------------------------------------------------------
// This file has NO React in it — it's just a data lookup table.
// Keeping data separate from components makes both easier to maintain.
//
// The API gives us: { "USD": "United States Dollar", "EUR": "Euro", ... }
// We enrich that with flags and symbols from this local table.
//
// =============================================================================

import type { Currency } from '../types/currency';

// Local metadata: flags and symbols for common currencies
// The flag is a Unicode emoji — works on all modern browsers
const CURRENCY_META: Record<string, { flag: string; symbol?: string }> = {
  AUD: { flag: '🇦🇺', symbol: 'A$' },
  BGN: { flag: '🇧🇬' },
  BRL: { flag: '🇧🇷', symbol: 'R$' },
  CAD: { flag: '🇨🇦', symbol: 'C$' },
  CHF: { flag: '🇨🇭', symbol: 'Fr' },
  CNY: { flag: '🇨🇳', symbol: '¥' },
  CZK: { flag: '🇨🇿' },
  DKK: { flag: '🇩🇰' },
  EUR: { flag: '🇪🇺', symbol: '€' },
  GBP: { flag: '🇬🇧', symbol: '£' },
  HKD: { flag: '🇭🇰', symbol: 'HK$' },
  HUF: { flag: '🇭🇺' },
  IDR: { flag: '🇮🇩', symbol: 'Rp' },
  ILS: { flag: '🇮🇱', symbol: '₪' },
  INR: { flag: '🇮🇳', symbol: '₹' },
  ISK: { flag: '🇮🇸' },
  JPY: { flag: '🇯🇵', symbol: '¥' },
  KRW: { flag: '🇰🇷', symbol: '₩' },
  MXN: { flag: '🇲🇽', symbol: 'MX$' },
  MYR: { flag: '🇲🇾', symbol: 'RM' },
  NOK: { flag: '🇳🇴' },
  NZD: { flag: '🇳🇿', symbol: 'NZ$' },
  PHP: { flag: '🇵🇭', symbol: '₱' },
  PLN: { flag: '🇵🇱' },
  RON: { flag: '🇷🇴' },
  SEK: { flag: '🇸🇪' },
  SGD: { flag: '🇸🇬', symbol: 'S$' },
  THB: { flag: '🇹🇭', symbol: '฿' },
  TRY: { flag: '🇹🇷', symbol: '₺' },
  USD: { flag: '🇺🇸', symbol: '$' },
  ZAR: { flag: '🇿🇦', symbol: 'R' },
};

// Popular currency pairs shown as quick-select options
export const POPULAR_PAIRS = [
  { from: 'USD', to: 'EUR' },
  { from: 'USD', to: 'GBP' },
  { from: 'USD', to: 'INR' },
  { from: 'EUR', to: 'USD' },
  { from: 'GBP', to: 'USD' },
  { from: 'USD', to: 'JPY' },
];

// Default currencies shown on first load
export const DEFAULT_FROM = 'USD';
export const DEFAULT_TO = 'INR';

// Merge API currency names with our local metadata
// Called in the Converter page after fetching /currencies
export function buildCurrencyList(
  apiData: Record<string, string>  // { "USD": "United States Dollar", ... }
): Currency[] {
  return Object.entries(apiData)
    // Object.entries converts { "USD": "Dollar" } → [["USD", "Dollar"], ...]
    .map(([code, name]) => ({
      code,
      name,
      flag: CURRENCY_META[code]?.flag,      // ?.  = optional chaining: safe access if key missing
      symbol: CURRENCY_META[code]?.symbol,
    }))
    .sort((a, b) => a.code.localeCompare(b.code));  // Sort alphabetically by code
}

// Get metadata for a single currency code
export function getCurrencyMeta(code: string): { flag?: string; symbol?: string } {
  return CURRENCY_META[code] ?? {};  // ?? = "if left side is null/undefined, use right side"
}
