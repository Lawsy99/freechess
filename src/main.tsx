import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// Nunito, bundled with the app so it works offline.
import '@fontsource-variable/nunito'
import './index.css'
import App from './App.tsx'
import { CrashScreen } from './components/CrashScreen'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <CrashScreen>
      <App />
    </CrashScreen>
  </StrictMode>,
)
