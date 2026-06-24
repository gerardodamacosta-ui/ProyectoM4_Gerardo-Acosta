// src/App.tsx
// La app ahora delega todo al router. El AuthProvider (en main.tsx) ya envuelve esto,
// así que los guardias de ruta tienen acceso al estado de sesión.

import { AppRouter } from "./routes/AppRouter";

function App() {
  return <AppRouter />;
}

export default App;
