// src/components/MobileTaskFab.tsx
// Botón flotante "+" visible solo en mobile (ver MobileTaskFab.module.css).
// Abre TaskForm dentro de un bottom sheet en vez del form inline de desktop.

import { useState } from "react";
import { TaskForm } from "./TaskForm";
import type { TaskFormValues } from "../types";
import styles from "./MobileTaskFab.module.css";

interface MobileTaskFabProps {
  onSubmit: (values: TaskFormValues) => Promise<void>;
}

export function MobileTaskFab({ onSubmit }: MobileTaskFabProps) {
  const [open, setOpen] = useState(false);

  // Si onSubmit falla, TaskForm captura el error y mantiene el sheet abierto;
  // solo cerramos acá cuando la creación realmente terminó bien.
  async function handleSubmit(values: TaskFormValues) {
    await onSubmit(values);
    setOpen(false);
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={styles.fab}
        aria-label="Crear tarea"
      >
        +
      </button>

      {open && (
        <div className={styles.overlay} onClick={() => setOpen(false)}>
          <div className={styles.sheet} onClick={(e) => e.stopPropagation()}>
            <TaskForm onSubmit={handleSubmit} onCancel={() => setOpen(false)} />
          </div>
        </div>
      )}
    </>
  );
}
