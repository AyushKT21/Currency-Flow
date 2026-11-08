// =============================================================================
// COMPONENT — Button.tsx
// =============================================================================
//
// 📚 REACT LESSON: Props and Reusable Components
// -------------------------------------------------
// A PROP is data passed FROM a parent component TO a child component.
// Think of props like function arguments for components.
//
// Example usage:
//   <Button variant="primary" onClick={handleConvert}>Convert</Button>
//   <Button variant="danger" onClick={handleDelete}>Delete</Button>
//
// WHY have a Button component?
//   - Write the button ONCE, use it EVERYWHERE with consistent styling.
//   - If you want to change how all buttons look, change it here.
//   - "DRY" = Don't Repeat Yourself
//
// =============================================================================

import React from 'react';

// Define what props this component accepts (TypeScript interface)
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  // ↑ ? = optional. If not passed, we use the default value below.
  
  onClick?: () => void;    // Optional click handler
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  loading?: boolean;       // Show spinner instead of text
  fullWidth?: boolean;     // Make button 100% wide
  children: React.ReactNode;  // The content inside the button (text, icon, etc.)
  className?: string;      // Allow extra CSS classes from parent
}

// The component function — receives props as its argument
export default function Button({
  variant = 'primary',    // Default value: if no variant passed, use 'primary'
  onClick,
  type = 'button',
  disabled = false,
  loading = false,
  fullWidth = false,
  children,
  className = '',
}: ButtonProps) {
  
  // Build the CSS class string based on props
  const classes = [
    'btn',
    `btn--${variant}`,               // btn--primary, btn--secondary, etc.
    fullWidth ? 'btn--full' : '',
    loading ? 'btn--loading' : '',
    className,
  ].filter(Boolean).join(' ');      // .filter(Boolean) removes empty strings
  //                                   .join(' ') combines with spaces

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}   // Also disable during loading
      className={classes}
    >
      {loading ? (
        // Show a spinner if loading is true
        <span className="btn__spinner" aria-label="Loading..." />
      ) : (
        children
      )}
    </button>
  );
}
