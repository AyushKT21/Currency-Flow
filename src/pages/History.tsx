// =============================================================================
// PAGE — History.tsx (/history)
// =============================================================================
//
// 📚 REACT LESSON: Reading & Writing localStorage in a Component
// ---------------------------------------------------------------
// This page reads from localStorage when it first loads, and updates
// the displayed list whenever the user deletes an item or clears all.
//
// The pattern:
//   1. Load data from localStorage on mount (useEffect + [])
//   2. When user deletes → update localStorage → refresh state
//   3. The component re-renders with the new list
//
// =============================================================================

import { useState, useEffect } from 'react';
import ConversionItem from '../components/ConversionItem';
import Button from '../components/Button';
import Card from '../components/Card';
import { getHistory, removeFromHistory, clearHistory } from '../utils/storage';
import type { ConversionRecord } from '../types/currency';
import { Link } from 'react-router-dom';

export default function History() {
  const [history, setHistory] = useState<ConversionRecord[]>([]);
  const [showConfirm, setShowConfirm] = useState(false);  // Controls the "Are you sure?" dialog

  // Load history from localStorage when page first loads
  useEffect(() => {
    setHistory(getHistory());
  }, []);

  function handleDelete(id: string) {
    removeFromHistory(id);
    setHistory(getHistory());    // Refresh after delete
  }

  function handleClearAll() {
    clearHistory();
    setHistory([]);
    setShowConfirm(false);
  }

  return (
    <main className="history-page">
      <div className="history-page__container">

        <div className="history-page__header">
          <div>
            <h1 className="history-page__title">Conversion History</h1>
            <p className="history-page__subtitle">
              Your recent conversions (stored locally in your browser).
            </p>
          </div>
          {history.length > 0 && (
            <Button
              variant="danger"
              onClick={() => setShowConfirm(true)}
            >
              Clear All
            </Button>
          )}
        </div>

        {/* Confirmation dialog */}
        {showConfirm && (
          <Card className="confirm-dialog">
            <p className="confirm-dialog__text">
              Are you sure you want to delete all {history.length} conversions?
            </p>
            <div className="confirm-dialog__actions">
              <Button variant="secondary" onClick={() => setShowConfirm(false)}>
                Cancel
              </Button>
              <Button variant="danger" onClick={handleClearAll}>
                Yes, Delete All
              </Button>
            </div>
          </Card>
        )}

        {/* History list or empty state */}
        {history.length === 0 ? (
          <Card>
            <div className="empty-state empty-state--large">
              <div className="empty-state__icon">📋</div>
              <h2 className="empty-state__title">No conversions yet</h2>
              <p className="empty-state__desc">
                Your conversions will appear here after you use the converter.
                History is saved in your browser and persists across page refreshes.
              </p>
              <Link to="/">
                <Button variant="primary">Go to Converter</Button>
              </Link>
            </div>
          </Card>
        ) : (
          <Card>
            <div className="section-header">
              <h2 className="section-title">{history.length} Conversions</h2>
            </div>
            <div className="conversion-list">
              {/* 📚 Rendering a list with .map() — each item MUST have a unique key */}
              {history.map(record => (
                <ConversionItem
                  key={record.id}           // ← unique key for React's reconciliation
                  record={record}
                  onDelete={handleDelete}
                />
              ))}
            </div>
            <p className="history-page__note">
              ℹ️ History is stored locally in your browser. Clearing browser data will erase it.
            </p>
          </Card>
        )}
      </div>
    </main>
  );
}
