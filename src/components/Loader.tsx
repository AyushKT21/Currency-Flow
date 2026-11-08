// =============================================================================
// COMPONENT — Loader.tsx
// =============================================================================

interface LoaderProps {
  message?: string;   // Optional text below the spinner
  size?: 'small' | 'medium' | 'large';
}

export default function Loader({ message = 'Loading...', size = 'medium' }: LoaderProps) {
  return (
    <div className={`loader loader--${size}`} role="status" aria-live="polite">
      <div className="loader__spinner" aria-hidden="true" />
      {message && <p className="loader__message">{message}</p>}
    </div>
  );
}
