// src/components/Header.tsx
// Barra superior fija. Grid 3 columnas: logo | email | acciones.

import styles from "./Header.module.css";

interface HeaderProps {
  userEmail: string;
  theme: "dark" | "light";
  onToggleTheme: () => void;
  onLogout: () => void;
}

export function Header({ userEmail, theme, onToggleTheme, onLogout }: HeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        Mate<span className={styles.logoAccent}>Code</span>
      </div>

      <span className={styles.email}>{userEmail}</span>

      <div className={styles.actions}>
        <button
          type="button"
          onClick={onToggleTheme}
          className={styles.themeBtn}
          aria-label="Cambiar tema"
        >
          {theme === "dark" ? "☀" : "🌙"}
        </button>
        <button type="button" onClick={onLogout} className={styles.logoutBtn}>
          Cerrar sesión
        </button>
      </div>
    </header>
  );
}
