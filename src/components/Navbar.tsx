// =============================================================================
// COMPONENT — Navbar.tsx
// =============================================================================
//
// 📚 REACT LESSON: React Router — NavLink
// -----------------------------------------
// React Router provides <NavLink> which is like <a> but for React apps.
// It adds an "active" CSS class automatically when you're on that page.
//
// <NavLink to="/"> → clicks don't reload the page, just swap components
// Regular <a href="/"> → reloads the whole page every click
//
// React Router also gives us the useLocation() hook to know which
// page we're currently on.
//
// =============================================================================

import { NavLink } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();   // Get theme + toggle from Context

  return (
    <header className="navbar">
      <div className="navbar__container">
        {/* Brand / Logo */}
        <NavLink to="/" className="navbar__brand">
          <div className="navbar__logo">
            <svg viewBox="0 0 40 40" fill="none" aria-hidden="true" className="navbar__logo-icon">
              <circle cx="20" cy="20" r="20" fill="url(#logo-grad)" />
              <path d="M12 20 L28 20 M22 14 L28 20 L22 26" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M28 20 L12 20 M18 14 L12 20 L18 26" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.5"/>
              <defs>
                <linearGradient id="logo-grad" x1="0" y1="0" x2="40" y2="40">
                  <stop offset="0%" stopColor="#3b6cf8"/>
                  <stop offset="100%" stopColor="#7c3aed"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
          <div className="navbar__brand-text">
            <span className="navbar__name">
              Currency<span className="navbar__name-accent">Flow</span>
            </span>
            <span className="navbar__tagline">Convert Smarter. Travel Further.</span>
          </div>
        </NavLink>

        {/* Desktop Navigation */}
        <nav className="navbar__nav" aria-label="Main navigation">
          <NavLink
            to="/"
            end                            // 'end' means only active on EXACT "/" not on sub-paths
            className={({ isActive }) =>   // NavLink passes isActive boolean to className function
              `navbar__link ${isActive ? 'navbar__link--active' : ''}`
            }
          >
            <span className="navbar__link-icon">⇄</span>
            Converter
          </NavLink>

          <NavLink
            to="/historical-rates"
            className={({ isActive }) =>
              `navbar__link ${isActive ? 'navbar__link--active' : ''}`
            }
          >
            <span className="navbar__link-icon">📈</span>
            Historical Rates
          </NavLink>

          <NavLink
            to="/history"
            className={({ isActive }) =>
              `navbar__link ${isActive ? 'navbar__link--active' : ''}`
            }
          >
            <span className="navbar__link-icon">🕐</span>
            History
          </NavLink>
        </nav>

        {/* Right side actions */}
        <div className="navbar__actions">
          {/* Theme toggle button */}
          <button
            className="navbar__theme-btn"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
        </div>
      </div>

      {/* Mobile bottom nav — shown on small screens via CSS */}
      <nav className="navbar__mobile" aria-label="Mobile navigation">
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `navbar__mobile-link ${isActive ? 'navbar__mobile-link--active' : ''}`
          }
        >
          <span>⇄</span>
          <span>Converter</span>
        </NavLink>
        <NavLink
          to="/historical-rates"
          className={({ isActive }) =>
            `navbar__mobile-link ${isActive ? 'navbar__mobile-link--active' : ''}`
          }
        >
          <span>📈</span>
          <span>Historical</span>
        </NavLink>
        <NavLink
          to="/history"
          className={({ isActive }) =>
            `navbar__mobile-link ${isActive ? 'navbar__mobile-link--active' : ''}`
          }
        >
          <span>🕐</span>
          <span>History</span>
        </NavLink>
        <button className="navbar__mobile-link" onClick={toggleTheme}>
          <span>{theme === 'light' ? '🌙' : '☀️'}</span>
          <span>Theme</span>
        </button>
      </nav>
    </header>
  );
}
