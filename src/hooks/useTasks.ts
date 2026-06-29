// src/hooks/useTasks.ts
// Expone el estado de tareas y las acciones CRUD al resto de la app.
// Toda la comunicación con Firestore pasa por firestoreService; acá no hay
// imports de firebase/firestore.

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
  const [tasks, setTasks] = useState<Task[]>([]);
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
        setTasks(updatedTasks);
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [userId]);

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
    try {
      await deleteTask(taskId);
      toast.success(MESSAGES.task.deleted);
    } catch {
      toast.error(MESSAGES.task.deleteError);
    }
  }, []);

  // Llama a deleteTask directamente para evitar N toasts individuales de removeTask
  const removeMany = useCallback(async (ids: string[]) => {
    try {
      await Promise.all(ids.map(deleteTask));
      toast.success(MESSAGES.task.deletedMany(ids.length));
    } catch {
      toast.error(MESSAGES.task.deleteManyError);
    }
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
