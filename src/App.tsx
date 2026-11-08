// =============================================================================
// APP.TSX — Root Component
// =============================================================================
//
// 📚 REACT LESSON: React Router Setup
// --------------------------------------
// React Router lets you build a "Single Page Application" (SPA).
// This means:
//   - Navigating between pages does NOT reload the browser
//   - The URL changes but it's all handled by JavaScript
//   - Much faster than traditional multi-page websites
//
// KEY COMPONENTS:
//   <BrowserRouter> — Provides routing context to everything inside it
//   <Routes>        — Container for all your route definitions
//   <Route>         — Maps a URL path to a component
//   <NavLink>       — A link that knows if it's the "active" route
//
// EXAMPLE:
//   <Route path="/" element={<Converter />} />
//   ↑ When URL is "/", render the Converter component
//
//   <Route path="/history" element={<History />} />
//   ↑ When URL is "/history", render the History component
//
// =============================================================================

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import Converter from './pages/Converter';
import HistoricalRates from './pages/HistoricalRates';
import History from './pages/History';

export default function App() {
  return (
    // ThemeProvider wraps everything so ALL components can access the theme
    <ThemeProvider>
      {/*
        BrowserRouter enables React Router for all children.
        It reads the browser's URL and decides which Route to show.
      */}
      <BrowserRouter>
        {/* Navbar appears on ALL pages (outside of Routes) */}
        <Navbar />

        {/* 
          Routes decides which page to show based on the URL.
          Only ONE Route matches at a time.
        */}
        <Routes>
          <Route path="/" element={<Converter />} />
          <Route path="/historical-rates" element={<HistoricalRates />} />
          <Route path="/history" element={<History />} />
          
          {/* 404 fallback */}
          <Route path="*" element={
            <div style={{ textAlign: 'center', padding: '4rem' }}>
              <h1>404 — Page Not Found</h1>
            </div>
          } />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
