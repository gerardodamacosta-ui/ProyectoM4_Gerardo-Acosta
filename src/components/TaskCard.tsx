// src/components/TaskCard.tsx
// Variante card de una tarea para la vista grilla (Solapa).
// Misma lógica que TaskItem pero con borde superior en lugar de izquierdo.

import { useState } from "react";
import { TaskForm } from "./TaskForm";
import type { Task, TaskFormValues } from "../types";
import type { Timestamp } from "firebase/firestore";
import styles from "./TaskCard.module.css";

function toLocalDateString(ts: Timestamp): string {
  const d = ts.toDate();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

const PRIORITY_LABEL: Record<NonNullable<Task["priority"]>, string> = {
  low: "Baja",
  medium: "Media",
  high: "Alta",
};

const PRIORITY_CLASS: Record<NonNullable<Task["priority"]>, string> = {
  low: styles.badgeLow,
  medium: styles.badgeMedium,
  high: styles.badgeHigh,
};

interface TaskCardProps {
  task: Task;
  isSelected: boolean;
  onSelect: (taskId: string) => void;
  onToggle: (taskId: string, currentValue: boolean) => Promise<void>;
  onEdit: (taskId: string, values: TaskFormValues) => Promise<void>;
  onDelete: (taskId: string) => Promise<void>;
}

export function TaskCard({
  task,
  isSelected,
  onSelect,
  onToggle,
  onEdit,
  onDelete,
}: TaskCardProps) {
  const [editing, setEditing] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const dueDateString = task.dueDate ? toLocalDateString(task.dueDate) : undefined;

  const initialValues: TaskFormValues = {
    title: task.title,
    description: task.description,
    priority: task.priority,
    dueDate: dueDateString,
  };

  async function handleEdit(values: TaskFormValues) {
    await onEdit(task.id, values);
    setEditing(false);
  }

  async function handleDelete() {
    setDeleting(true);
    try {
      await onDelete(task.id);
    } finally {
      setDeleting(false);
    }
  }

  if (editing) {
    return (
      <div className={styles.editContainer}>
        <TaskForm
          initialValues={initialValues}
          onSubmit={handleEdit}
          onCancel={() => setEditing(false)}
        />
      </div>
    );
  }

  return (
    <div className={`${styles.card} ${task.completed ? styles.completed : ""}`}>
      <div className={styles.cardHeader}>
        <input
          type="checkbox"
          className={styles.checkToggle}
          checked={task.completed}
          onChange={() => onToggle(task.id, task.completed)}
          aria-label={`Marcar "${task.title}" como ${task.completed ? "pendiente" : "completada"}`}
        />
        <input
          type="checkbox"
          className={styles.checkSelect}
          checked={isSelected}
          onChange={() => onSelect(task.id)}
          aria-label={`Seleccionar "${task.title}"`}
        />
        {task.priority && (
          <span className={`${styles.badge} ${PRIORITY_CLASS[task.priority]}`}>
            {PRIORITY_LABEL[task.priority]}
          </span>
        )}
      </div>

      <strong className={styles.title}>{task.title}</strong>

      {task.description && (
        <p className={styles.description}>{task.description}</p>
      )}

      {task.dueDate && (
        <span className={styles.dueDate}>
          {task.dueDate.toDate().toLocaleDateString("es-AR")}
        </span>
      )}

      <div className={styles.actions}>
        <button
          type="button"
          onClick={() => setEditing(true)}
          className={styles.editBtn}
        >
          Editar
        </button>
        <button
          type="button"
          onClick={handleDelete}
          disabled={deleting}
          className={styles.deleteBtn}
        >
          {deleting ? "…" : "Eliminar"}
        </button>
      </div>
    </div>
  );
}
