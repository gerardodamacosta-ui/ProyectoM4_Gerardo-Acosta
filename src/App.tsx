// src/App.tsx
// La app ahora delega todo al router. El AuthProvider (en main.tsx) ya envuelve esto,
// así que los guardias de ruta tienen acceso al estado de sesión.

import { Toaster } from "react-hot-toast";
import { AppRouter } from "./routes/AppRouter";

function App() {
  return (
    <>
      <AppRouter />
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background:    "var(--bg-card)",
            color:         "var(--text)",
            border:        "1px solid var(--accent)",
            fontFamily:    "var(--font)",
            fontSize:      "13px",
            letterSpacing: "0.5px",
          },
        }}
      />
    </>
  );
}

export default App;
