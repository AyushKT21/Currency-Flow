// =============================================================================
// PAGE — HistoricalRates.tsx (/historical-rates)
// =============================================================================
//
// 📚 REACT LESSON: Multiple API calls in one component
// -------------------------------------------------------
// This page makes TWO API calls:
//   1. Fetch the list of currencies (on mount)
//   2. Fetch the historical rate + 30-day series (when user clicks "Get Rates")
//
// Each call has its own loading/error state.
// This is a common pattern — track loading/error PER operation.
//
// 📚 REACT LESSON: Recharts integration
// ----------------------------------------
// Recharts is a charting library built for React.
// We import chart components and pass data as props — just like any React component.
//
// =============================================================================

import { useState, useEffect } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer
} from 'recharts';
import Card from '../components/Card';
import CurrencySelect from '../components/CurrencySelect';
import Button from '../components/Button';
import Loader from '../components/Loader';
import ErrorMessage from '../components/ErrorMessage';
import { fetchCurrencies, fetchHistoricalRate, fetchRateSeries } from '../services/exchangeRateApi';
import { buildCurrencyList, DEFAULT_FROM, DEFAULT_TO, POPULAR_PAIRS } from '../data/currencies';
import { formatAmount, formatDate, formatRate, getDaysAgo } from '../utils/formatCurrency';
import type { Currency, ChartDataPoint } from '../types/currency';

export default function HistoricalRates() {
  // Currency list state
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [currenciesLoading, setCurrenciesLoading] = useState(true);

  // User selections
  const [fromCode, setFromCode] = useState(DEFAULT_FROM);
  const [toCode, setToCode] = useState(DEFAULT_TO);
  const [selectedDate, setSelectedDate] = useState(getDaysAgo(1));   // Yesterday by default

  // Historical rate result
  const [historicalRate, setHistoricalRate] = useState<number | null>(null);
  const [historicalDate, setHistoricalDate] = useState<string | null>(null);
  const [rateLoading, setRateLoading] = useState(false);
  const [rateError, setRateError] = useState<string | null>(null);

  // Chart data (30-day series)
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [chartLoading, setChartLoading] = useState(false);

  // Historical rates table data (last 5 days)
  const [tableData, setTableData] = useState<ChartDataPoint[]>([]);

  // Load currencies on mount
  useEffect(() => {
    async function load() {
      try {
        const apiData = await fetchCurrencies();
        setCurrencies(buildCurrencyList(apiData));
      } catch {
        // Silently fail — user can still manually type currencies
      } finally {
        setCurrenciesLoading(false);
      }
    }
    load();
  }, []);

  async function handleGetRates() {
    if (!selectedDate) return;
    if (fromCode === toCode) {
      setRateError('Please select two different currencies');
      return;
    }

    setRateError(null);
    setRateLoading(true);
    setChartLoading(true);

    try {
      // --------------------------------
      // Fetch the rate for selected date
      // --------------------------------
      const rateData = await fetchHistoricalRate(selectedDate, fromCode, toCode);
      const fetchedRate = rateData.rates[toCode];
      if (!fetchedRate) throw new Error(`Rate for ${toCode} not available on this date`);
      
      setHistoricalRate(fetchedRate);
      setHistoricalDate(rateData.date);

    } catch (err) {
      setRateError(err instanceof Error ? err.message : 'Failed to fetch historical rate');
      setRateLoading(false);
      setChartLoading(false);
      return;
    } finally {
      setRateLoading(false);
    }

    try {
      // --------------------------------
      // Fetch 30-day series for the chart
      // Frankfurter date range: /startDate..endDate
      // --------------------------------
      const endDate = selectedDate;
      const startDate = getDaysAgo(30);
      
      const seriesData = await fetchRateSeries(startDate, endDate, fromCode, toCode);
      
      // Convert nested object to flat array for Recharts
      // seriesData.rates = { "2025-04-01": { "INR": 83.50 }, ... }
      const points: ChartDataPoint[] = Object.entries(seriesData.rates)
        .map(([date, rateObj]) => ({
          date,
          rate: rateObj[toCode] ?? 0,
        }))
        .sort((a, b) => a.date.localeCompare(b.date));

      setChartData(points);

      // Last 5 for the table
      setTableData(points.slice(-5).reverse());

    } catch {
      // Chart is optional — don't block the rate display if it fails
      setChartData([]);
    } finally {
      setChartLoading(false);
    }
  }

  function handleQuickPair(from: string, to: string) {
    setFromCode(from);
    setToCode(to);
    setHistoricalRate(null);
    setChartData([]);
  }

  if (currenciesLoading) {
    return <div className="page-loading"><Loader message="Loading currencies..." size="large" /></div>;
  }

  return (
    <main className="historical-page">
      <div className="historical-page__container">

        <div className="historical-page__header">
          <h1 className="historical-page__title">Historical Exchange Rates</h1>
          <p className="historical-page__subtitle">View exchange rates for any date in the past.</p>
        </div>

        <div className="historical-page__layout">
          <div className="historical-page__main">

            {/* Controls Card */}
            <Card>
              <div className="historical-controls">
                <div className="historical-controls__date">
                  <label className="field-label" htmlFor="rate-date">Date</label>
                  <input
                    id="rate-date"
                    type="date"
                    className="date-input"
                    value={selectedDate}
                    onChange={e => setSelectedDate(e.target.value)}
                    max={getDaysAgo(0)}    // Can't pick future dates
                    min="1999-01-01"       // Frankfurter starts from 1999
                  />
                </div>
                <div className="historical-controls__from">
                  <CurrencySelect
                    currencies={currencies}
                    value={fromCode}
                    onChange={setFromCode}
                    label="From"
                    id="hist-from"
                  />
                </div>
                <div className="historical-controls__to">
                  <CurrencySelect
                    currencies={currencies}
                    value={toCode}
                    onChange={setToCode}
                    label="To"
                    id="hist-to"
                  />
                </div>
                <div className="historical-controls__btn">
                  <Button
                    variant="primary"
                    onClick={handleGetRates}
                    loading={rateLoading}
                  >
                    Get Rates
                  </Button>
                </div>
              </div>
            </Card>

            {/* Rate result */}
            {rateError && <ErrorMessage message={rateError} />}

            {historicalRate !== null && historicalDate && (
              <Card className="historical-result">
                <div className="historical-result__date">
                  {formatDate(historicalDate)}
                </div>
                <div className="historical-result__rate">
                  {formatRate(historicalRate, fromCode, toCode)}
                </div>
                <div className="historical-result__note">
                  Historical rate — not live market price
                </div>
              </Card>
            )}

            {/* Chart */}
            {chartLoading && <Loader message="Loading chart data..." />}
            {chartData.length > 0 && (
              <Card>
                <h2 className="section-title">30-Day Trend: {fromCode} → {toCode}</h2>
                <div className="chart-container">
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                      <XAxis
                        dataKey="date"
                        tick={{ fontSize: 11, fill: 'var(--text-secondary)' }}
                        tickFormatter={d => d.slice(5)}    // Show "MM-DD" instead of full date
                        interval={4}
                      />
                      <YAxis
                        tick={{ fontSize: 11, fill: 'var(--text-secondary)' }}
                        domain={['auto', 'auto']}
                        width={60}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'var(--bg-card)',
                          border: '1px solid var(--border-color)',
                          borderRadius: '8px',
                          color: 'var(--text-primary)',
                        }}
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        formatter={(value: any) => [formatAmount(Number(value)), `${fromCode}→${toCode}`]}
                      />
                      <Line
                        type="monotone"
                        dataKey="rate"
                        stroke="var(--accent-blue)"
                        strokeWidth={2}
                        dot={false}
                        activeDot={{ r: 5 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            )}

            {/* Historical table */}
            {tableData.length > 0 && (
              <Card>
                <h2 className="section-title">Historical Rates Table</h2>
                <div className="table-wrapper">
                  <table className="rates-table">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Rate ({fromCode} → {toCode})</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tableData.map(row => (
                        <tr key={row.date}>
                          <td>{formatDate(row.date)}</td>
                          <td>{formatAmount(row.rate)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            )}
          </div>

          {/* Sidebar: popular pairs */}
          <div className="historical-page__sidebar">
            <Card>
              <h2 className="section-title">Other Popular Pairs</h2>
              <div className="popular-pair-list">
                {POPULAR_PAIRS.map(pair => (
                  <button
                    key={`${pair.from}-${pair.to}`}
                    className="popular-pair-item"
                    onClick={() => handleQuickPair(pair.from, pair.to)}
                  >
                    <span className="popular-pair-item__codes">{pair.from} → {pair.to}</span>
                    <span className="popular-pair-item__arrow">›</span>
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
