// src/components/TaskList.tsx
// Renderiza la lista filtrada de tareas. Maneja los estados de carga, error
// y lista vacía. Delega cada ítem a TaskItem.

import { TaskItem } from "./TaskItem";
import type { Task, TaskFormValues, TaskFilter } from "../types";

interface TaskListProps {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  filter: TaskFilter;
  onFilterChange: (filter: TaskFilter) => void;
  onToggle: (taskId: string, currentValue: boolean) => Promise<void>;
  onEdit: (taskId: string, values: TaskFormValues) => Promise<void>;
  onDelete: (taskId: string) => Promise<void>;
}

const FILTER_OPTIONS: { value: TaskFilter; label: string }[] = [
  { value: "all", label: "Todas" },
  { value: "pending", label: "Pendientes" },
  { value: "completed", label: "Completadas" },
];

export function TaskList({
  tasks,
  loading,
  error,
  filter,
  onFilterChange,
  onToggle,
  onEdit,
  onDelete,
}: TaskListProps) {
  return (
    <section>
      <div role="group" aria-label="Filtrar tareas">
        {FILTER_OPTIONS.map(({ value, label }) => (
          <button
            key={value}
            type="button"
            onClick={() => onFilterChange(value)}
            aria-pressed={filter === value}
          >
            {label}
          </button>
        ))}
      </div>

      {loading && <p>Cargando tareas…</p>}

      {error && <p role="alert">Error al cargar las tareas: {error}</p>}

      {!loading && !error && tasks.length === 0 && (
        <p>
          {filter === "all"
            ? "Todavía no tenés tareas. ¡Creá la primera!"
            : `No hay tareas ${filter === "pending" ? "pendientes" : "completadas"}.`}
        </p>
      )}

      {!loading && !error && tasks.length > 0 && (
        <ul>
          {tasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onToggle={onToggle}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </ul>
      )}
    </section>
  );
}
