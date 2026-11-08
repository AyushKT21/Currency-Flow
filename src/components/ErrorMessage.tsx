// =============================================================================
// COMPONENT — ErrorMessage.tsx
// =============================================================================

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;   // Optional retry button
}

export default function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  return (
    <div className="error-message" role="alert">
      <span className="error-message__icon">⚠️</span>
      <p className="error-message__text">{message}</p>
      {onRetry && (
        <button className="error-message__retry" onClick={onRetry}>
          Try again
        </button>
      )}
    </div>
  );
}
