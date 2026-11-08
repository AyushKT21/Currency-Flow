// =============================================================================
// MAIN.TSX — Entry Point
// =============================================================================
//
// 📚 REACT LESSON: How React Starts
// ------------------------------------
// Every React app has ONE entry point file.
//
// HOW IT WORKS:
//   1. index.html has a <div id="root"></div>
//   2. main.tsx finds that div and "mounts" your React app into it
//   3. React takes over — everything inside #root is managed by React
//
// You almost NEVER need to modify this file.
//
// StrictMode:
//   React.StrictMode is a development tool. In development mode ONLY,
//   it intentionally calls your components TWICE to help you find bugs.
//   This disappears in production builds.
//
// =============================================================================

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'    // Global styles — imported once here, applies everywhere
import App from './App.tsx'

// Find the #root div in index.html and mount React into it
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
