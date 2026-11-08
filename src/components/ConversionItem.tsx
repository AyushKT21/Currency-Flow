// =============================================================================
// COMPONENT — ConversionItem.tsx
// =============================================================================
//
// 📚 REACT LESSON: Rendering Lists
// ----------------------------------
// When you render a LIST of items in React, you use .map() to convert
// an array of data into an array of JSX elements.
//
// ALWAYS provide a unique `key` prop when rendering lists!
// React uses the key to track which items changed, were added, or removed.
// Without it, React re-renders the ENTIRE list even for tiny changes.
//
// Example:
//   {records.map(record => (
//     <ConversionItem key={record.id} record={record} onDelete={handleDelete} />
//   ))}
//
// =============================================================================

import type { ConversionRecord } from '../types/currency';
import { formatAmount, formatTimestamp, formatRate } from '../utils/formatCurrency';
import { getCurrencyMeta } from '../data/currencies';

interface ConversionItemProps {
  record: ConversionRecord;
  onDelete: (id: string) => void;  // Called when user clicks the delete button
}

export default function ConversionItem({ record, onDelete }: ConversionItemProps) {
  const fromMeta = getCurrencyMeta(record.fromCode);
  const toMeta = getCurrencyMeta(record.toCode);

  return (
    <div className="conversion-item">
      <div className="conversion-item__currencies">
        <span className="conversion-item__flag">{fromMeta.flag || '🌐'}</span>
        <span className="conversion-item__pair">
          {record.fromCode} → {record.toCode}
        </span>
        <span className="conversion-item__flag">{toMeta.flag || '🌐'}</span>
      </div>

      <div className="conversion-item__amounts">
        <span className="conversion-item__from">
          {formatAmount(record.amount)} {record.fromCode}
        </span>
        <span className="conversion-item__arrow">→</span>
        <span className="conversion-item__to">
          {formatAmount(record.result)} {record.toCode}
        </span>
      </div>

      <div className="conversion-item__meta">
        <span className="conversion-item__rate">
          {formatRate(record.rate, record.fromCode, record.toCode)}
        </span>
        <span className="conversion-item__time">
          {formatTimestamp(record.timestamp)}
        </span>
      </div>

      {/* Delete button — calls onDelete with this record's ID */}
      <button
        className="conversion-item__delete"
        onClick={() => onDelete(record.id)}
        aria-label={`Delete conversion from ${record.fromCode} to ${record.toCode}`}
        title="Delete this conversion"
      >
        🗑
      </button>
    </div>
  );
}
