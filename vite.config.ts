import react from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  plugins: [
    react(),
    // LocatorJS: adds source-file info to JSX so Alt+Click opens the right file.
    // Only in dev (`npm run dev`), never in the production build.
    command === 'serve' &&
      babel({
        include: /\.tsx$/, // only JSX files (plain .ts files broke with Windows paths)
        plugins: [['@locator/babel-jsx/dist', { env: 'development' }]],
      }),
  ],
}))
