// src/components/TaskForm.tsx
// Formulario para crear y editar tareas. Recibe `initialValues` cuando edita
// una tarea existente; sin él, opera en modo creación.

import { useState } from "react";
import type { TaskFormValues, Priority } from "../types";
import styles from "./TaskForm.module.css";

interface TaskFormProps {
  onSubmit: (values: TaskFormValues) => Promise<void>;
  initialValues?: TaskFormValues;
  onCancel?: () => void;
}

const EMPTY_FORM: TaskFormValues = {
  title: "",
  description: "",
  dueDate: "",
  priority: undefined,
};

export function TaskForm({ onSubmit, initialValues, onCancel }: TaskFormProps) {
  const [values, setValues] = useState<TaskFormValues>(
    initialValues ?? EMPTY_FORM
  );
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    const { name, value } = e.target;
    setValues((prev) => ({
      ...prev,
      // El select de prioridad puede volver a "" (sin selección): lo tratamos
      // como undefined para no mandar un string vacío a Firestore.
      [name]: name === "priority" && value === "" ? undefined : value,
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!values.title.trim()) {
      setError("El título es obligatorio.");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      await onSubmit(values);
      // Si es modo creación (sin initialValues), limpiamos el form al terminar.
      if (!initialValues) setValues(EMPTY_FORM);
    } catch {
      setError("Ocurrió un error al guardar la tarea. Intentá de nuevo.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.field}>
        <label htmlFor="title" className={styles.label}>Título *</label>
        <input
          id="title"
          name="title"
          type="text"
          value={values.title}
          onChange={handleChange}
          disabled={submitting}
          required
          className={styles.input}
        />
      </div>

      <div className={styles.field}>
        <label htmlFor="description" className={styles.label}>Descripción</label>
        <textarea
          id="description"
          name="description"
          value={values.description}
          onChange={handleChange}
          disabled={submitting}
          rows={3}
          className={styles.input}
        />
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label htmlFor="priority" className={styles.label}>Prioridad</label>
          <select
            id="priority"
            name="priority"
            value={values.priority ?? ""}
            onChange={handleChange}
            disabled={submitting}
            className={styles.input}
          >
            <option value="">Sin prioridad</option>
            <option value={"low" satisfies Priority}>Baja</option>
            <option value={"medium" satisfies Priority}>Media</option>
            <option value={"high" satisfies Priority}>Alta</option>
          </select>
        </div>

        <div className={styles.field}>
          <label htmlFor="dueDate" className={styles.label}>Fecha de vencimiento</label>
          <input
            id="dueDate"
            name="dueDate"
            type="date"
            value={values.dueDate ?? ""}
            onChange={handleChange}
            disabled={submitting}
            className={styles.input}
          />
        </div>
      </div>

      {error && <p role="alert" className={styles.error}>{error}</p>}

      <div className={styles.buttons}>
        <button type="submit" disabled={submitting} className={styles.submitBtn}>
          {submitting ? "Guardando…" : initialValues ? "Guardar cambios" : "+ Crear tarea"}
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel} disabled={submitting} className={styles.cancelBtn}>
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
}
