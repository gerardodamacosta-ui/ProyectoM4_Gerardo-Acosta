// src/components/Header.tsx
// Barra superior fija. Grid 3 columnas: logo | email | acciones.
// El menú hamburguesa despliega avatar, instrucciones y cierre de sesión.

import { useState, useEffect, useRef } from "react";
import { InstructionsModal } from "./InstructionsModal";
import { SendSummaryButton } from "./SendSummaryButton";
import styles from "./Header.module.css";

interface HeaderProps {
  userEmail: string;
  photoURL?: string | null;
  theme: "dark" | "light";
  onToggleTheme: () => void;
  onLogout: () => void;
  to: string;
  pending: number;
  completed: number;
}

export function Header({
  userEmail,
  photoURL,
  theme,
  onToggleTheme,
  onLogout,
  to,
  pending,
  completed,
}: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Cierra el menú al hacer click fuera de él
  useEffect(() => {
    if (!menuOpen) return;
    function handleOutsideClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [menuOpen]);

  const initial = userEmail.charAt(0).toUpperCase();

  return (
    <>
      <header className={styles.header}>
        <div className={styles.logo}>
          Mate<span className={styles.logoAccent}>Code</span>
        </div>

        <span className={styles.email}>Agenda tus tareas!</span>

        <div className={styles.actions}>
          <button
            type="button"
            onClick={onToggleTheme}
            className={styles.themeBtn}
            aria-label="Cambiar tema"
          >
            {theme === "dark" ? "☀" : "🌙"}
          </button>

          <SendSummaryButton to={to} pending={pending} completed={completed} />

          <div className={styles.menuContainer} ref={menuRef}>
            <button
              type="button"
              onClick={() => setMenuOpen((prev) => !prev)}
              className={styles.hamburgerBtn}
              aria-label="Menú de usuario"
              aria-expanded={menuOpen}
            >
              ☰
            </button>

            {menuOpen && (
              <div className={styles.dropdown}>
                <div className={styles.avatarRow}>
                  {photoURL ? (
                    <img
                      src={photoURL}
                      alt={userEmail}
                      className={styles.avatarImg}
                    />
                  ) : (
                    <div className={styles.avatarInitial}>{initial}</div>
                  )}
                  <span className={styles.dropdownEmail}>{userEmail}</span>
                </div>

                <div className={styles.divider} />

                <button
                  type="button"
                  className={styles.dropdownBtn}
                  onClick={() => {
                    setShowInstructions(true);
                    setMenuOpen(false);
                  }}
                >
                  Instrucciones de uso
                </button>

                <button
                  type="button"
                  className={`${styles.dropdownBtn} ${styles.dropdownBtnLogout}`}
                  onClick={onLogout}
                >
                  Cerrar sesión
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {showInstructions && (
        <InstructionsModal onClose={() => setShowInstructions(false)} />
      )}
    </>
  );
}
