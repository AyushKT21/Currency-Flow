// =============================================================================
// COMPONENT — Card.tsx
// =============================================================================

import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'small' | 'medium' | 'large';
}

export default function Card({ children, className = '', padding = 'medium' }: CardProps) {
  return (
    <div className={`card card--${padding} ${className}`}>
      {children}
    </div>
  );
}
