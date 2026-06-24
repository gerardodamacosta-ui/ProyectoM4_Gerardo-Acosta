import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { AuthProvider } from './features/auth/AuthProvider'

// El AuthProvider envuelve toda la app: hace la única suscripción a onAuthStateChanged
// y deja el estado de sesión disponible para cualquier componente vía useAuth().
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>,
)
