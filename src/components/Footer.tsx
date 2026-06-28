// src/components/Footer.tsx
// Footer fijo al fondo. Dos líneas: rol y nombre del desarrollador.

import styles from "./Footer.module.css";

export function Footer() {
  return (
    <footer className={styles.footer}>
      <span className={styles.role}>Desarrollador</span>
      <span className={styles.name}>Gerardo Acosta</span>
    </footer>
  );
}
