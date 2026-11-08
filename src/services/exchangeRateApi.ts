// =============================================================================
// API SERVICE — exchangeRateApi.ts
// =============================================================================
//
// 📚 API: Fawaz Ahmed's free Currency API (200+ currencies, no key, no limits)
//   Docs: https://github.com/fawazahmed0/exchange-api
//
//   All currencies : {BASE}@latest/v1/currencies.json
//   Latest rates   : {BASE}@latest/v1/currencies/usd.json
//   Rates on a date: {BASE}@2025-04-20/v1/currencies/usd.json
//
// 📚 LESSON: The "Adapter" pattern
// -----------------------------------------------
// This API returns data in a DIFFERENT shape than our old API (Frankfurter):
//   - codes are lowercase ("usd" instead of "USD")
//   - rates look like { date, usd: { inr: 85.4, eur: 0.88, ... } }
//
// Instead of changing every page, we CONVERT the response here into the same
// shape our app already uses (RatesApiResponse etc.). The pages don't even
// know the API changed. This is why we keep API code in one service file!
//
// 📚 LESSON: async/await
//   const res = await fetch(url);   // wait for the server
//   const data = await res.json();  // wait for the body to be parsed
//
// =============================================================================

import type {
  CurrenciesApiResponse,
  RatesApiResponse,
  HistoricalSeriesResponse,
} from '../types/currency';

// Main CDN + a backup mirror (the docs recommend a fallback)
const PRIMARY = 'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api';
const FALLBACK = 'https://{tag}.currency-api.pages.dev';

// -----------------------------------------------------------------------------
// Helper: fetch JSON for a "tag" (either "latest" or a date like "2025-04-20")
// and a path like "/v1/currencies.json". Tries the main URL, then the backup.
// -----------------------------------------------------------------------------
async function getJson<T>(tag: string, path: string): Promise<T> {
  const urls = [
    `${PRIMARY}@${tag}${path}`,
    `${FALLBACK.replace('{tag}', tag)}${path}`,
  ];

  for (const url of urls) {
    try {
      const response = await fetch(url);
      if (response.ok) {
        return (await response.json()) as T;
      }
      // 📚 Not ok (e.g. 404) → loop continues and tries the next URL
    } catch {
      // Network error → try the next URL
    }
  }
  throw new Error(`Failed to load exchange data (${tag})`);
}

// Shape of the raw response from /currencies/{base}.json
// e.g. { "date": "2025-04-20", "usd": { "inr": 85.4, "eur": 0.88 } }
type RawRatesResponse = { date: string } & Record<string, Record<string, number> | string>;

// -----------------------------------------------------------------------------
// Helper: turn a raw response into our app's RatesApiResponse for ONE pair
// -----------------------------------------------------------------------------
function toRatesResponse(raw: RawRatesResponse, from: string, to: string): RatesApiResponse {
  const table = raw[from.toLowerCase()] as Record<string, number> | undefined;
  const rate = table?.[to.toLowerCase()];
  if (rate === undefined) {
    throw new Error(`Rate for ${from} → ${to} not available`);
  }
  return {
    amount: 1,
    base: from,
    date: raw.date,
    rates: { [to]: rate }, // 📚 [to] = computed key, e.g. { "INR": 85.4 }
  };
}

// =============================================================================
// FETCH ALL CURRENCIES
// Returns: { "USD": "US Dollar", "INR": "Indian Rupee", ... }
// =============================================================================
export async function fetchCurrencies(): Promise<CurrenciesApiResponse> {
  const raw = await getJson<Record<string, string>>('latest', '/v1/currencies.json');

  // The API also includes crypto/odd codes and some without names.
  // Keep only normal 3-letter codes that have a name, and UPPERCASE them.
  const result: CurrenciesApiResponse = {};
  for (const [code, name] of Object.entries(raw)) {
    if (/^[a-z]{3}$/.test(code) && name) {
      result[code.toUpperCase()] = name;
    }
  }
  return result;
}

// =============================================================================
// FETCH LATEST EXCHANGE RATE (e.g. USD → INR)
// =============================================================================
export async function fetchLatestRate(
  fromCurrency: string,
  toCurrency: string
): Promise<RatesApiResponse> {
  const raw = await getJson<RawRatesResponse>(
    'latest',
    `/v1/currencies/${fromCurrency.toLowerCase()}.json`
  );
  return toRatesResponse(raw, fromCurrency, toCurrency);
}

// =============================================================================
// FETCH HISTORICAL RATE FOR A SPECIFIC DATE ("YYYY-MM-DD")
// =============================================================================
export async function fetchHistoricalRate(
  date: string,
  fromCurrency: string,
  toCurrency: string
): Promise<RatesApiResponse> {
  const raw = await getJson<RawRatesResponse>(
    date,
    `/v1/currencies/${fromCurrency.toLowerCase()}.json`
  );
  return toRatesResponse(raw, fromCurrency, toCurrency);
}

// =============================================================================
// FETCH HISTORICAL RATE SERIES (for the chart)
//
// 📚 LESSON: Promise.allSettled — many API calls in PARALLEL
// This API has no "date range" endpoint, so we request each day separately.
// Instead of awaiting them one by one (slow), we start them ALL at once and
// wait for all of them together. allSettled (vs Promise.all) means one failed
// day doesn't break the whole chart — we just skip that day.
// =============================================================================
export async function fetchRateSeries(
  fromDate: string,
  toDate: string,
  fromCurrency: string,
  toCurrency: string
): Promise<HistoricalSeriesResponse> {
  // Build the list of dates between fromDate and toDate
  const dates: string[] = [];
  const cursor = new Date(fromDate);
  const end = new Date(toDate);
  while (cursor <= end) {
    dates.push(cursor.toISOString().slice(0, 10));
    cursor.setDate(cursor.getDate() + 1);
  }

  // Start all requests at the same time
  const results = await Promise.allSettled(
    dates.map(d => fetchHistoricalRate(d, fromCurrency, toCurrency))
  );

  // Convert into the nested shape the chart code expects:
  // { "2025-04-01": { "INR": 83.5 }, ... }
  const rates: Record<string, Record<string, number>> = {};
  results.forEach((r, i) => {
    if (r.status === 'fulfilled') {
      rates[dates[i]] = r.value.rates;
    }
  });

  if (Object.keys(rates).length === 0) {
    throw new Error('Failed to fetch rate series');
  }

  return {
    amount: 1,
    base: fromCurrency,
    start_date: fromDate,
    end_date: toDate,
    rates,
  };
}
