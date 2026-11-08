// =============================================================================
// PAGE — Converter.tsx (Main Page: /)
// =============================================================================
//
// 📚 REACT LESSON: useState + useEffect for API calls
// -----------------------------------------------------
// This is the most important pattern in React:
//
//   1. Declare state with useState (currencies, selected values, results, etc.)
//   2. Fetch data on mount with useEffect (load currency list)
//   3. Trigger more fetches on user action (click "Convert")
//   4. Show loading/error/result based on state
//
// READ THIS CAREFULLY — understanding this pattern = understanding React.
//
// =============================================================================

import { useState, useEffect } from 'react';
import Card from '../components/Card';
import CurrencySelect from '../components/CurrencySelect';
import AmountInput from '../components/AmountInput';
import Button from '../components/Button';
import Loader from '../components/Loader';
import ErrorMessage from '../components/ErrorMessage';
import ConversionItem from '../components/ConversionItem';
import { fetchCurrencies, fetchLatestRate } from '../services/exchangeRateApi';
import { buildCurrencyList, DEFAULT_FROM, DEFAULT_TO, POPULAR_PAIRS } from '../data/currencies';
import { addToHistory, getHistory, removeFromHistory } from '../utils/storage';
import { formatAmount, formatRate, formatDate, generateId } from '../utils/formatCurrency';
import type { Currency, ConversionRecord } from '../types/currency';
import { Link } from 'react-router-dom';

export default function Converter() {
  // ---------------------------------------------------------------------------
  // STATE DECLARATIONS
  // 📚 Each useState call creates ONE piece of state.
  // React re-renders the component whenever any state changes.
  // ---------------------------------------------------------------------------

  // Currency list (fetched from API on page load)
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [currenciesLoading, setCurrenciesLoading] = useState(true);
  const [currenciesError, setCurrenciesError] = useState<string | null>(null);

  // The two selected currencies
  const [fromCode, setFromCode] = useState<string>(DEFAULT_FROM);    // e.g. "USD"
  const [toCode, setToCode] = useState<string>(DEFAULT_TO);          // e.g. "INR"

  // The amount the user typed
  const [amount, setAmount] = useState<string>('100');
  const [amountError, setAmountError] = useState<string | null>(null);

  // Conversion result
  const [result, setResult] = useState<number | null>(null);
  const [rate, setRate] = useState<number | null>(null);
  const [rateDate, setRateDate] = useState<string | null>(null);
  const [converting, setConverting] = useState(false);
  const [conversionError, setConversionError] = useState<string | null>(null);

  // History (loaded from localStorage)
  const [history, setHistory] = useState<ConversionRecord[]>([]);

  // ---------------------------------------------------------------------------
  // EFFECT 1: Load currencies on first render
  // 📚 useEffect with [] dependency = runs ONCE when component first mounts
  // ---------------------------------------------------------------------------
  useEffect(() => {
    loadCurrencies();
  }, []);   // ← Empty array [] means "run this effect ONLY on first render"
  //          If you put [fromCode] here, it would re-run whenever fromCode changes.

  // ---------------------------------------------------------------------------
  // EFFECT 2: Load history from localStorage on first render
  // ---------------------------------------------------------------------------
  useEffect(() => {
    setHistory(getHistory());
  }, []);

  // ---------------------------------------------------------------------------
  // FUNCTIONS
  // ---------------------------------------------------------------------------

  async function loadCurrencies() {
    try {
      setCurrenciesLoading(true);
      setCurrenciesError(null);

      const apiData = await fetchCurrencies();        // Wait for API
      const list = buildCurrencyList(apiData);        // Enrich with flags
      setCurrencies(list);                            // Update state → re-render

    } catch (err) {
      // If anything goes wrong, show an error
      setCurrenciesError(err instanceof Error ? err.message : 'Failed to load currencies');
    } finally {
      // 'finally' runs whether try succeeded or catch ran
      // Always turn off loading spinner
      setCurrenciesLoading(false);
    }
  }

  async function handleConvert() {
    // Validate amount
    const numericAmount = parseFloat(amount);
    if (!amount || isNaN(numericAmount) || numericAmount <= 0) {
      setAmountError('Please enter a valid amount greater than 0');
      return;
    }
    setAmountError(null);

    if (fromCode === toCode) {
      setConversionError('Please select two different currencies');
      return;
    }

    try {
      setConverting(true);
      setConversionError(null);
      setResult(null);

      // Fetch the rate from API
      const data = await fetchLatestRate(fromCode, toCode);
      
      // data.rates is like: { "INR": 83.54 }
      const fetchedRate = data.rates[toCode];
      if (!fetchedRate) {
        throw new Error(`Rate for ${toCode} not found in response`);
      }

      // Calculate converted amount
      const convertedAmount = numericAmount * fetchedRate;

      // Update state with results
      setResult(convertedAmount);
      setRate(fetchedRate);
      setRateDate(data.date);

      // Save to history
      const record: ConversionRecord = {
        id: generateId(),
        fromCode,
        toCode,
        amount: numericAmount,
        result: convertedAmount,
        rate: fetchedRate,
        rateDate: data.date,
        timestamp: new Date().toISOString(),
      };
      addToHistory(record);
      setHistory(getHistory());    // Refresh history state from localStorage

    } catch (err) {
      setConversionError(err instanceof Error ? err.message : 'Conversion failed. Please try again.');
    } finally {
      setConverting(false);
    }
  }

  function handleSwap() {
    // Swap the two currencies and clear the result
    setFromCode(toCode);
    setToCode(fromCode);
    setResult(null);
    setRate(null);
    setRateDate(null);
    setConversionError(null);
  }

  function handleDeleteHistory(id: string) {
    removeFromHistory(id);
    setHistory(getHistory());    // Refresh from localStorage after delete
  }

  function handleQuickPair(from: string, to: string) {
    setFromCode(from);
    setToCode(to);
    setResult(null);
    setRate(null);
  }

  // ---------------------------------------------------------------------------
  // RENDER
  // 📚 This is what React displays. It re-runs every time state changes.
  // ---------------------------------------------------------------------------

  if (currenciesLoading) {
    return (
      <div className="page-loading">
        <Loader message="Loading currencies..." size="large" />
      </div>
    );
  }

  if (currenciesError) {
    return (
      <div className="page-error">
        <ErrorMessage message={currenciesError} onRetry={loadCurrencies} />
      </div>
    );
  }

  const recentHistory = history.slice(0, 5);   // Show last 5 conversions

  return (
    <main className="converter-page">
      <div className="converter-page__container">

        {/* Page Header */}
        <div className="converter-page__header">
          <h1 className="converter-page__title">Currency Converter</h1>
          <p className="converter-page__subtitle">
            Convert between {currencies.length}+ currencies with daily and historical rates.
          </p>

          {/* 📚 These pills read from STATE, so they update automatically */}
          <div className="header-stats">
            <span className="header-stat">
              <span className="header-stat__icon">🌍</span>
              <strong>{currencies.length}</strong> currencies
            </span>
            <span className="header-stat">
              <span className="header-stat__icon">🕐</span>
              <strong>{history.length}</strong> saved conversions
            </span>
            <span className="header-stat">
              <span className="header-stat__dot" />
              {rateDate ? <>Rates as of <strong>{formatDate(rateDate)}</strong></> : 'Rates updated daily'}
            </span>
          </div>
        </div>

        <div className="converter-page__layout">

          {/* Left: Main converter card */}
          <div className="converter-page__main">
            <Card className="converter-card">
              {/* ROW 1: From dropdown | Swap | To dropdown */}
              <div className="converter-row">
                <CurrencySelect
                  currencies={currencies}
                  value={fromCode}
                  onChange={setFromCode}
                  label="From"
                  id="from-currency"
                />

                <button
                  className="swap-btn converter-row__middle"
                  onClick={handleSwap}
                  title="Swap currencies"
                  aria-label="Swap from and to currencies"
                >
                  ⇄
                </button>

                <CurrencySelect
                  currencies={currencies}
                  value={toCode}
                  onChange={setToCode}
                  label="To"
                  id="to-currency"
                />
              </div>

              {/* ROW 2: Amount input | (empty spacer) | Converted amount */}
              <div className="converter-row">
                <AmountInput
                  value={amount}
                  onChange={setAmount}
                  label="Amount"
                  error={amountError || undefined}
                />

                {/* Empty spacer so both columns line up with row 1 */}
                <div className="converter-row__middle" aria-hidden="true" />

                {/* 📚 readOnly input: looks like an input, but only React sets its value */}
                <div className="amount-input">
                  <label className="amount-input__label" htmlFor="converted-field">
                    Converted Amount
                  </label>
                  <input
                    id="converted-field"
                    type="text"
                    readOnly
                    className="amount-input__field amount-input__field--readonly"
                    value={result !== null ? formatAmount(result) : ''}
                    placeholder="0.00"
                  />
                </div>
              </div>

              {/* Rate info below the inputs */}
              {rate !== null && rateDate && (
                <div className="converter-card__rate-info">
                  <span className="converter-card__rate">
                    {formatRate(rate, fromCode, toCode)}
                  </span>
                  <span className="converter-card__rate-date">
                    Last updated: {formatDate(rateDate)}
                  </span>
                </div>
              )}

              {/* Error message */}
              {conversionError && (
                <ErrorMessage message={conversionError} />
              )}

              {/* Convert button */}
              <Button
                variant="primary"
                fullWidth
                onClick={handleConvert}
                loading={converting}
                disabled={currencies.length === 0}
              >
                Convert →
              </Button>
            </Card>

            {/* Quick links */}
            <div className="quick-links">
              <Link to="/historical-rates" className="quick-link">
                <span className="quick-link__icon">📈</span>
                <div>
                  <div className="quick-link__title">View Historical Rates</div>
                  <div className="quick-link__desc">Check past exchange rates for any date</div>
                </div>
                <span className="quick-link__arrow">›</span>
              </Link>
              <Link to="/history" className="quick-link">
                <span className="quick-link__icon">🕐</span>
                <div>
                  <div className="quick-link__title">Conversion History</div>
                  <div className="quick-link__desc">View all your past conversions</div>
                </div>
                <span className="quick-link__arrow">›</span>
              </Link>
            </div>
          </div>

          {/* Right: Recent conversions + popular pairs */}
          <div className="converter-page__sidebar">

            {/* Recent conversions */}
            <Card>
              <div className="section-header">
                <h2 className="section-title">Recent Conversions</h2>
                {history.length > 5 && (
                  <Link to="/history" className="section-link">View all</Link>
                )}
              </div>
              {recentHistory.length === 0 ? (
                <div className="empty-state">
                  <p>No conversions yet. Make your first conversion above!</p>
                </div>
              ) : (
                <div className="conversion-list">
                  {recentHistory.map(record => (
                    <ConversionItem
                      key={record.id}
                      record={record}
                      onDelete={handleDeleteHistory}
                    />
                  ))}
                </div>
              )}
            </Card>

            {/* Popular pairs */}
            <Card>
              <h2 className="section-title">Popular Pairs</h2>
              <div className="popular-pairs">
                {POPULAR_PAIRS.map(pair => (
                  <button
                    key={`${pair.from}-${pair.to}`}
                    className="popular-pair"
                    onClick={() => handleQuickPair(pair.from, pair.to)}
                  >
                    <span>{pair.from}</span>
                    <span className="popular-pair__arrow">→</span>
                    <span>{pair.to}</span>
                  </button>
                ))}
              </div>
            </Card>

          </div>
        </div>
      </div>
    </main>
  );
}
