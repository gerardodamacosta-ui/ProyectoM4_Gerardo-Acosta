// src/hooks/useTasks.tsx
// Expone el estado de tareas y las acciones CRUD al resto de la app.
// Toda la comunicación con Firestore pasa por firestoreService; acá no hay
// imports de firebase/firestore.
//
// removeTask y removeMany implementan un patrón de "soft-delete con undo":
// la tarea se oculta visualmente de inmediato (pendingDeleteIds) y el delete
// real en Firestore se ejecuta 5s después, solo si el usuario no presiona
// "Deshacer" en el toast.

import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import {
  subscribeToUserTasks,
  createTask,
  updateTask,
  deleteTask,
  toggleTaskCompleted,
} from "../services/firestoreService";
import { MESSAGES } from "../constants/messages";
import type { Task, TaskFormValues, TaskFilter } from "../types";

const UNDO_MS = 5000;

interface UseTasksResult {
  tasks: Task[];
  filteredTasks: Task[];
  loading: boolean;
  error: string | null;
  filter: TaskFilter;
  setFilter: (filter: TaskFilter) => void;
  addTask: (values: TaskFormValues) => Promise<void>;
  editTask: (taskId: string, values: TaskFormValues) => Promise<void>;
  removeTask: (taskId: string) => Promise<void>;
  removeMany: (ids: string[]) => Promise<void>;
  toggleTask: (taskId: string, currentValue: boolean) => Promise<void>;
}

export function useTasks(userId: string): UseTasksResult {
  const [rawTasks, setRawTasks] = useState<Task[]>([]);
  const [pendingDeleteIds, setPendingDeleteIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<TaskFilter>("all");

  useEffect(() => {
    setLoading(true);
    setError(null);

    // subscribeToUserTasks devuelve la función de limpieza de onSnapshot.
    // Al retornarla como cleanup del useEffect, React la llama automáticamente
    // cuando el componente se desmonta o cuando userId cambia — sin memory leaks.
    const unsubscribe = subscribeToUserTasks(
      userId,
      (updatedTasks) => {
        setRawTasks(updatedTasks);
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [userId]);

  // tasks excluye las que están en pendingDeleteIds para que contadores
  // y lista sean consistentes durante el período de undo.
  const tasks = rawTasks.filter((t) => !pendingDeleteIds.has(t.id));

  // Los filtros se aplican en cliente sobre el array ya cargado.
  // Evita queries adicionales a Firestore y funciona bien con onSnapshot.
  const filteredTasks = tasks.filter((task) => {
    if (filter === "pending") return !task.completed;
    if (filter === "completed") return task.completed;
    return true;
  });

  const addTask = useCallback(
    async (values: TaskFormValues) => {
      try {
        await createTask(userId, values);
        toast.success(MESSAGES.task.created);
      } catch {
        toast.error(MESSAGES.task.createError);
      }
    },
    [userId]
  );

  const editTask = useCallback(
    async (taskId: string, values: TaskFormValues) => {
      try {
        await updateTask(taskId, values);
        toast.success(MESSAGES.task.updated);
      } catch {
        toast.error(MESSAGES.task.updateError);
      }
    },
    []
  );

  const removeTask = useCallback(async (taskId: string) => {
    // 1. Ocultar visualmente de inmediato, sin tocar Firestore todavía
    setPendingDeleteIds((prev) => { const s = new Set(prev); s.add(taskId); return s; });

    let undone = false;

    // 2. Toast con botón Deshacer
    toast(
      (t) => (
        <span style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span>{MESSAGES.task.deleted}</span>
          <button
            onClick={() => {
              undone = true;
              setPendingDeleteIds((prev) => { const s = new Set(prev); s.delete(taskId); return s; });
              toast.dismiss(t.id);
            }}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
              padding: "2px 6px",
              color: "var(--accent)",
              fontFamily: "inherit",
              fontSize: "inherit",
              letterSpacing: "inherit",
            }}
          >
            <i className="ti ti-arrow-back-up" aria-hidden="true" />
            {" "}Deshacer
          </button>
        </span>
      ),
      { duration: UNDO_MS }
    );

    // 3. Ejecutar el delete real en Firestore si no se deshace
    setTimeout(async () => {
      if (undone) return;
      try {
        await deleteTask(taskId);
      } catch {
        toast.error(MESSAGES.task.deleteError);
      } finally {
        setPendingDeleteIds((prev) => { const s = new Set(prev); s.delete(taskId); return s; });
      }
    }, UNDO_MS);
  }, []);

  // Llama a deleteTask directamente para evitar N toasts individuales de removeTask
  const removeMany = useCallback(async (ids: string[]) => {
    const count = ids.length;

    // 1. Ocultar todas visualmente de inmediato
    setPendingDeleteIds((prev) => { const s = new Set(prev); ids.forEach((id) => s.add(id)); return s; });

    let undone = false;

    // 2. Toast con botón Deshacer
    toast(
      (t) => (
        <span style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span>{MESSAGES.task.deletedMany(count)}</span>
          <button
            onClick={() => {
              undone = true;
              setPendingDeleteIds((prev) => { const s = new Set(prev); ids.forEach((id) => s.delete(id)); return s; });
              toast.dismiss(t.id);
            }}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
              padding: "2px 6px",
              color: "var(--accent)",
              fontFamily: "inherit",
              fontSize: "inherit",
              letterSpacing: "inherit",
            }}
          >
            <i className="ti ti-arrow-back-up" aria-hidden="true" />
            {" "}Deshacer
          </button>
        </span>
      ),
      { duration: UNDO_MS }
    );

    // 3. Ejecutar el delete real en Firestore si no se deshace
    setTimeout(async () => {
      if (undone) return;
      try {
        await Promise.all(ids.map(deleteTask));
      } catch {
        toast.error(MESSAGES.task.deleteManyError);
      } finally {
        setPendingDeleteIds((prev) => { const s = new Set(prev); ids.forEach((id) => s.delete(id)); return s; });
      }
    }, UNDO_MS);
  }, []);

  const toggleTask = useCallback(
    async (taskId: string, currentValue: boolean) => {
      try {
        await toggleTaskCompleted(taskId, currentValue);
      } catch {
        toast.error(MESSAGES.task.toggleError);
      }
    },
    []
  );

  return {
    tasks,
    filteredTasks,
    loading,
    error,
    filter,
    setFilter,
    addTask,
    editTask,
    removeTask,
    removeMany,
    toggleTask,
  };
}
