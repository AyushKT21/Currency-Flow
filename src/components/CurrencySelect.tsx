// =============================================================================
// COMPONENT — CurrencySelect.tsx
// =============================================================================
//
// 📚 REACT LESSON: Derived State & Filtering
// --------------------------------------------
// "Derived state" = values you CALCULATE from existing state.
// You DON'T need to store them in useState.
//
// Example:
//   const [search, setSearch] = useState('');           ← stored in state
//   const filtered = currencies.filter(c => ...);      ← DERIVED (calculated)
//
// Never store derived values in state! Just compute them on every render.
// React re-renders are fast — don't try to optimize prematurely.
//
// 📚 REACT LESSON: useState with events
// ----------------------------------------
// Every time the user types in the search box:
//   1. onChange fires → calls setSearch(newValue)
//   2. React updates state
//   3. Component re-renders with new state
//   4. The filtered list is recalculated automatically
//
// =============================================================================

import { useState, useRef, useEffect } from 'react';
import type { Currency } from '../types/currency';

interface CurrencySelectProps {
  currencies: Currency[];       // Full list of currencies to choose from
  value: string;                // Currently selected currency code (e.g. "USD")
  onChange: (code: string) => void;  // Called when user picks a new currency
  label?: string;
  disabled?: boolean;
  id?: string;
}

export default function CurrencySelect({
  currencies,
  value,
  onChange,
  label,
  disabled = false,
  id = 'currency-select',
}: CurrencySelectProps) {
  const [isOpen, setIsOpen] = useState(false);      // Is the dropdown visible?
  const [search, setSearch] = useState('');          // What user typed in search box
  const dropdownRef = useRef<HTMLDivElement>(null);  // Ref to the dropdown div (for click-outside)
  
  // 📚 DERIVED STATE: calculate filtered list from search input
  // No useState needed! This is computed fresh on every render.
  const filtered = currencies.filter(currency => {
    if (!search) return true;  // No search = show everything
    const q = search.toLowerCase();
    return (
      currency.code.toLowerCase().includes(q) ||
      currency.name.toLowerCase().includes(q)
    );
  });

  // The currently selected currency object (for display)
  const selected = currencies.find(c => c.code === value);

  // Close dropdown when user clicks outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      // dropdownRef.current is the actual DOM element
      // .contains() checks if the click was inside the dropdown
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setSearch('');
      }
    }

    // Add the listener when dropdown is open
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    // 📚 Cleanup function: remove the listener when dropdown closes or component unmounts
    // Without this, you'd have memory leaks and multiple listeners piling up!
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);  // Re-run this effect whenever isOpen changes

  function handleSelect(code: string) {
    onChange(code);     // Tell parent about new selection
    setIsOpen(false);   // Close dropdown
    setSearch('');      // Clear search
  }

  return (
    <div className={`currency-select ${disabled ? 'currency-select--disabled' : ''}`} ref={dropdownRef}>
      {label && (
        <label className="currency-select__label" htmlFor={id}>
          {label}
        </label>
      )}
      
      {/* The trigger button that shows the selected currency */}
      <button
        id={id}
        type="button"
        className={`currency-select__trigger ${isOpen ? 'currency-select__trigger--open' : ''}`}
        onClick={() => !disabled && setIsOpen(prev => !prev)}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        {selected ? (
          <>
            <span className="currency-select__flag">{selected.flag || '🌐'}</span>
            <span className="currency-select__code">{selected.code}</span>
            <span className="currency-select__name">{selected.name}</span>
          </>
        ) : (
          <span className="currency-select__placeholder">Select currency</span>
        )}
        <span className={`currency-select__arrow ${isOpen ? 'currency-select__arrow--up' : ''}`}>
          ▾
        </span>
      </button>

      {/* The dropdown panel */}
      {isOpen && (
        <div className="currency-select__dropdown" role="listbox">
          {/* Search input */}
          <div className="currency-select__search-wrap">
            <input
              type="text"
              className="currency-select__search"
              placeholder="Search currency..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              autoFocus   // Auto-focus the search box when dropdown opens
            />
          </div>

          {/* Currency list */}
          <ul className="currency-select__list">
            {filtered.length === 0 ? (
              <li className="currency-select__empty">No currencies found</li>
            ) : (
              filtered.map(currency => (
                <li
                  key={currency.code}         // 📚 key= is REQUIRED when rendering lists in React
                  className={`currency-select__item ${currency.code === value ? 'currency-select__item--selected' : ''}`}
                  onClick={() => handleSelect(currency.code)}
                  role="option"
                  aria-selected={currency.code === value}
                >
                  <span className="currency-select__item-flag">{currency.flag || '🌐'}</span>
                  <span className="currency-select__item-code">{currency.code}</span>
                  <span className="currency-select__item-name">{currency.name}</span>
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
