// src/components/ConfirmModal.tsx
// Modal de confirmación para borrado masivo. Se muestra solo cuando la acción
// dejaría la lista vacía (todos los elementos seleccionados).

import styles from "./ConfirmModal.module.css";

interface ConfirmModalProps {
  count: number;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmModal({ count, onConfirm, onCancel }: ConfirmModalProps) {
  return (
    <div
      className={styles.overlay}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className={styles.card}>
        <h2 id="modal-title" className={styles.title}>
          ¿Borrar {count} {count === 1 ? "tarea" : "tareas"}?
        </h2>
        <p className={styles.message}>
          Esta acción vaciará la lista y no se puede deshacer.
        </p>
        <span className={styles.icon} aria-hidden="true">&#x2622;&#xFE0F;</span>
        <div className={styles.actions}>
          <button type="button" onClick={onCancel} className={styles.cancelBtn}>
            Cancelar
          </button>
          <button type="button" onClick={onConfirm} className={styles.confirmBtn}>
            Sí, borrar
          </button>
        </div>
      </div>
    </div>
  );
}
