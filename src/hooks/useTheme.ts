// src/hooks/useTheme.ts
// Gestiona el tema visual (dark/light). Persiste en localStorage y aplica
// la clase "light" en <html> para activar el override de variables CSS.

import { useState, useEffect } from "react";

type Theme = "dark" | "light";

const STORAGE_KEY = "matecode-theme";
const ROOT = document.documentElement;

function getInitialTheme(): Theme {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored === "light" ? "light" : "dark";
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  useEffect(() => {
    if (theme === "light") {
      ROOT.classList.add("light");
    } else {
      ROOT.classList.remove("light");
    }
    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  function toggleTheme() {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  }

  return { theme, toggleTheme };
}
