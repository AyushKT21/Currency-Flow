// =============================================================================
// COMPONENT — AmountInput.tsx
// =============================================================================
//
// 📚 REACT LESSON: Controlled Components
// ----------------------------------------
// In React, an INPUT is "controlled" when React is in charge of its value.
//
// UNCONTROLLED input (not recommended):
//   <input type="number" />
//   ↑ The browser manages the value. React doesn't know what's in it.
//
// CONTROLLED input (React way):
//   <input type="number" value={amount} onChange={e => setAmount(e.target.value)} />
//   ↑ React controls the value via state. Every keystroke updates state → re-render.
//
// WHY controlled?
//   - You can validate immediately as the user types
//   - You can reset the input by just setting state
//   - React always knows the current value
//
// =============================================================================

interface AmountInputProps {
  value: string;                      // Current value (from parent's state)
  onChange: (value: string) => void;  // Called when user types (updates parent's state)
  label?: string;
  placeholder?: string;
  error?: string;                     // Validation error to show
  disabled?: boolean;
}

export default function AmountInput({
  value,
  onChange,
  label = 'Amount',
  placeholder = 'Enter amount',
  error,
  disabled = false,
}: AmountInputProps) {
  
  // Validate and call parent's onChange
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    // e.target.value is what the user typed
    const raw = e.target.value;
    
    // Only allow digits and one decimal point
    // This prevents letters but allows "100.50"
    if (raw === '' || /^\d*\.?\d*$/.test(raw)) {
      onChange(raw);
    }
  }

  return (
    <div className={`amount-input ${error ? 'amount-input--error' : ''}`}>
      {label && (
        <label className="amount-input__label" htmlFor="amount-field">
          {label}
        </label>
      )}
      <input
        id="amount-field"
        type="text"                     // text (not number) so we control format ourselves
        inputMode="decimal"             // Shows numeric keyboard on mobile
        value={value}                   // ← Controlled: React sets the value
        onChange={handleChange}         // ← Controlled: React handles every change
        placeholder={placeholder}
        disabled={disabled}
        className="amount-input__field"
        autoComplete="off"
      />
      {error && (
        <span className="amount-input__error" role="alert">
          {error}
        </span>
      )}
    </div>
  );
}
