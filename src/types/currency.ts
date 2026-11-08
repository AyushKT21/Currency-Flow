// =============================================================================
// TYPES & INTERFACES — currency.ts
// =============================================================================
//
// 📚 REACT LESSON: TypeScript Interfaces
// ----------------------------------------
// An "interface" defines the SHAPE of an object — what properties it has
// and what type each property is. Think of it as a contract.
//
// WHY use TypeScript?
//   - TypeScript catches bugs BEFORE you run the code.
//   - Your editor will autocomplete property names.
//   - If you spell a property wrong, TypeScript tells you immediately.
//
// Example without TypeScript (JavaScript):
//   const currency = { cde: "USD" }; // typo! no warning.
//
// Example WITH TypeScript:
//   const currency: Currency = { cde: "USD" }; // ❌ TypeScript error: 'cde' does not exist
//
// =============================================================================

// Represents a single currency (e.g. USD, INR, EUR)
export interface Currency {
  code: string;       // e.g. "USD"
  name: string;       // e.g. "United States Dollar"
  symbol?: string;    // e.g. "$" — the ? means it's OPTIONAL (not every currency has one)
  flag?: string;      // e.g. "🇺🇸" — optional emoji flag
}

// Represents one conversion the user did — saved to localStorage
export interface ConversionRecord {
  id: string;           // Unique ID for this record (so we can delete it)
  fromCode: string;     // e.g. "USD"
  toCode: string;       // e.g. "INR"
  amount: number;       // How much the user typed, e.g. 100
  result: number;       // The converted amount, e.g. 8354
  rate: number;         // The exchange rate, e.g. 83.54
  rateDate: string;     // The date this rate is from, e.g. "2025-04-26" (from API)
  timestamp: string;    // When the user did this conversion, e.g. "2025-04-26T10:30:00"
}

// =============================================================================
// API RESPONSE TYPES
// These match exactly what the Frankfurter API sends back.
// =============================================================================

// Response from: GET /currencies
// The API returns an object like: { "USD": "United States Dollar", "EUR": "Euro", ... }
export type CurrenciesApiResponse = Record<string, string>;
//                                  ↑ Record<K, V> = an object where keys are K, values are V
//                                    So: Record<string, string> = { "USD": "Dollar", ... }

// Response from: GET /latest?base=USD&symbols=INR
// OR:           GET /2025-04-20?base=USD&symbols=INR
export interface RatesApiResponse {
  amount: number;                   // Always 1 (we always ask for 1 unit)
  base: string;                     // e.g. "USD"
  date: string;                     // e.g. "2025-04-26" — the date this rate is from
  rates: Record<string, number>;    // e.g. { "INR": 83.54 }
}

// Response from: GET /2025-04-01..2025-04-20?base=USD&symbols=INR
// This gives us a RANGE of rates for a chart
export interface HistoricalSeriesResponse {
  amount: number;
  base: string;
  start_date: string;
  end_date: string;
  rates: Record<string, Record<string, number>>;
  // ↑ This is nested: { "2025-04-01": { "INR": 83.50 }, "2025-04-02": { "INR": 83.54 }, ... }
}

// A single data point for the chart
export interface ChartDataPoint {
  date: string;   // x-axis label
  rate: number;   // y-axis value
}
