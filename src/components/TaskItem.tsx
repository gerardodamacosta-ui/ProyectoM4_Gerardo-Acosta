// src/components/TaskItem.tsx
// Muestra una tarea individual con sus acciones: completar, editar, eliminar.
// Cuando el usuario pulsa "Editar", reemplaza la vista por el TaskForm inline.

import { useState } from "react";
import { TaskForm } from "./TaskForm";
import { useIsMobile } from "../hooks/useIsMobile";
import { useSwipeToAction } from "../hooks/useSwipeToAction";
import type { Task, TaskFormValues } from "../types";
import { toLocalDateString } from "../utils/dateFormatting";
import styles from "./TaskItem.module.css";

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

interface TaskItemProps {
  task: Task;
  isSelected: boolean;
  isSelectionMode: boolean;
  onSelect: (taskId: string) => void;
  onToggle: (taskId: string, currentValue: boolean) => Promise<void>;
  onEdit: (taskId: string, values: TaskFormValues) => Promise<void>;
  onDelete: (taskId: string) => Promise<void>;
}

export function TaskItem({
  task,
  isSelected,
  isSelectionMode,
  onSelect,
  onToggle,
  onEdit,
  onDelete,
}: TaskItemProps) {
  const [editing, setEditing] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const isMobile = useIsMobile();

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

  const { handlers: swipeHandlers, offset: swipeOffset } = useSwipeToAction({
    onSwipeRight: () => onToggle(task.id, task.completed),
    onSwipeLeft: () => void handleDelete(),
    disabled: !isMobile || isSelectionMode || editing,
  });

  if (editing) {
    return (
      <li className={styles.editContainer}>
        <TaskForm
          initialValues={initialValues}
          onSubmit={handleEdit}
          onCancel={() => setEditing(false)}
        />
      </li>
    );
  }

  const itemClass = [
    styles.item,
    task.completed ? styles.completed : "",
    isSelectionMode && isSelected ? styles.itemSelected : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <li
      className={itemClass}
      onClick={isSelectionMode ? () => onSelect(task.id) : undefined}
      style={{
        cursor: isSelectionMode ? "pointer" : undefined,
        transform: swipeOffset ? `translateX(${swipeOffset}px)` : undefined,
        touchAction: "pan-y",
      }}
      {...swipeHandlers}
    >
      <input
        type="checkbox"
        className={styles.checkToggle}
        checked={task.completed}
        onClick={(e) => e.stopPropagation()}
        onChange={() => onToggle(task.id, task.completed)}
        aria-label={`Marcar "${task.title}" como ${task.completed ? "pendiente" : "completada"}`}
      />

      <div className={styles.content}>
        <strong className={styles.title}>{task.title}</strong>
        {task.description && (
          <p className={styles.description}>{task.description}</p>
        )}
        <div className={styles.meta}>
          {task.priority && (
            <span className={`${styles.badge} ${PRIORITY_CLASS[task.priority]}`}>
              {PRIORITY_LABEL[task.priority]}
            </span>
          )}
          {task.dueDate && (
            <span className={styles.dueDate}>
              {task.dueDate.toDate().toLocaleDateString("es-AR")}
            </span>
          )}
        </div>
      </div>

      <div className={`${styles.actions} ${isSelectionMode ? styles.actionsHiddenOnMobile : ""}`}>
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); setEditing(true); }}
          className={styles.editBtn}
        >
          <span className={styles.btnLabel}>Editar</span>
          <i className={`ti ti-pencil ${styles.btnIcon}`} aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); void handleDelete(); }}
          disabled={deleting}
          className={styles.deleteBtn}
        >
          <span className={styles.btnLabel}>{deleting ? "…" : "Eliminar"}</span>
          <i className={`ti ti-trash ${styles.btnIcon}`} aria-hidden="true" />
        </button>
      </div>
    </li>
  );
}
