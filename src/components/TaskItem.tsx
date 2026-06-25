// src/components/TaskItem.tsx
// Muestra una tarea individual con sus acciones: completar, editar, eliminar.
// Cuando el usuario pulsa "Editar", reemplaza la vista por el TaskForm inline.

import { useState } from "react";
import { TaskForm } from "./TaskForm";
import type { Task, TaskFormValues } from "../types";
import type { Timestamp } from "firebase/firestore";

// Usa métodos locales (getFullYear/getMonth/getDate) en lugar de toISOString()
// para evitar que la conversión a UTC desplace la fecha en zonas UTC-.
function toLocalDateString(ts: Timestamp): string {
  const d = ts.toDate();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

interface TaskItemProps {
  task: Task;
  onToggle: (taskId: string, currentValue: boolean) => Promise<void>;
  onEdit: (taskId: string, values: TaskFormValues) => Promise<void>;
  onDelete: (taskId: string) => Promise<void>;
}

const PRIORITY_LABEL: Record<NonNullable<Task["priority"]>, string> = {
  low: "Baja",
  medium: "Media",
  high: "Alta",
};

export function TaskItem({ task, onToggle, onEdit, onDelete }: TaskItemProps) {
  const [editing, setEditing] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const dueDateString = task.dueDate
    ? toLocalDateString(task.dueDate)
    : undefined;

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
      <li>
        <TaskForm
          initialValues={initialValues}
          onSubmit={handleEdit}
          onCancel={() => setEditing(false)}
        />
      </li>
    );
  }

  return (
    <li>
      <input
        type="checkbox"
        checked={task.completed}
        onChange={() => onToggle(task.id, task.completed)}
        aria-label={`Marcar "${task.title}" como ${task.completed ? "pendiente" : "completada"}`}
      />

      <div>
        <strong style={{ textDecoration: task.completed ? "line-through" : "none" }}>
          {task.title}
        </strong>
        {task.description && <p>{task.description}</p>}
        {task.priority && <span>Prioridad: {PRIORITY_LABEL[task.priority]}</span>}
        {task.dueDate && (
          <span>Vence: {task.dueDate.toDate().toLocaleDateString("es-AR")}</span>
        )}
      </div>

      <div>
        <button type="button" onClick={() => setEditing(true)}>
          Editar
        </button>
        <button type="button" onClick={handleDelete} disabled={deleting}>
          {deleting ? "Eliminando…" : "Eliminar"}
        </button>
      </div>
    </li>
  );
}
