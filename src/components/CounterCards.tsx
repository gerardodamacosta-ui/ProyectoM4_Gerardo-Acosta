// src/components/CounterCards.tsx
// Tres cards de resumen siempre visibles: total, pendientes, completadas.
// En mobile actúan como filtros tappables (filter/onFilterChange opcionales).

import type { TaskFilter } from "../types";
import styles from "./CounterCards.module.css";

interface CounterCardsProps {
  total: number;
  pending: number;
  completed: number;
  filter?: TaskFilter;
  onFilterChange?: (filter: TaskFilter) => void;
}

export function CounterCards({
  total,
  pending,
  completed,
  filter,
  onFilterChange,
}: CounterCardsProps) {
  const cards: { filterValue: TaskFilter; count: number; label: string; numberClass: string }[] = [
    { filterValue: "all", count: total, label: "Total", numberClass: styles.total },
    { filterValue: "pending", count: pending, label: "Pendientes", numberClass: styles.pending },
    { filterValue: "completed", count: completed, label: "Completadas", numberClass: styles.completed },
  ];

  return (
    <div className={styles.grid}>
      {cards.map(({ filterValue, count, label, numberClass }) => (
        <div
          key={filterValue}
          className={`${styles.card} ${filter === filterValue ? styles.cardActive : ""}`}
          onClick={() => onFilterChange?.(filterValue)}
        >
          <span className={`${styles.number} ${numberClass}`}>{count}</span>
          <span className={styles.label}>{label}</span>
        </div>
      ))}
    </div>
  );
}
