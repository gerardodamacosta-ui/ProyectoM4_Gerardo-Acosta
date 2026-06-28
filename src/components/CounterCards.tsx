// src/components/CounterCards.tsx
// Tres cards de resumen siempre visibles: total, pendientes, completadas.

import styles from "./CounterCards.module.css";

interface CounterCardsProps {
  total: number;
  pending: number;
  completed: number;
}

export function CounterCards({ total, pending, completed }: CounterCardsProps) {
  return (
    <div className={styles.grid}>
      <div className={styles.card}>
        <span className={`${styles.number} ${styles.total}`}>{total}</span>
        <span className={styles.label}>Total</span>
      </div>
      <div className={styles.card}>
        <span className={`${styles.number} ${styles.pending}`}>{pending}</span>
        <span className={styles.label}>Pendientes</span>
      </div>
      <div className={styles.card}>
        <span className={`${styles.number} ${styles.completed}`}>{completed}</span>
        <span className={styles.label}>Completadas</span>
      </div>
    </div>
  );
}
