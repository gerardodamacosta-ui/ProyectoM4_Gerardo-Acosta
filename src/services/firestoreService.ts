// src/services/firestoreService.ts
// Única capa que habla con Firestore. Los componentes y hooks nunca importan
// firebase/firestore directamente: todo pasa por acá.

import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { db } from "./firebase";
import type { Task, TaskFormValues } from "../types";

const TASKS_COLLECTION = "tasks";

// --- Suscripción en tiempo real ---

// Devuelve una función `unsubscribe` que el caller debe invocar al desmontar.
// Firestore llama a `onUpdate` cada vez que cambia cualquier tarea del usuario.
// Si ocurre un error de lectura (ej. sesión expirada), llama a `onError`.
export function subscribeToUserTasks(
  userId: string,
  onUpdate: (tasks: Task[]) => void,
  onError: (error: Error) => void
): () => void {
  const q = query(
    collection(db, TASKS_COLLECTION),
    where("userId", "==", userId),
    orderBy("createdAt", "desc")
  );

  return onSnapshot(
    q,
    (snapshot) => {
      const tasks: Task[] = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...(docSnap.data() as Omit<Task, "id">),
      }));
      onUpdate(tasks);
    },
    (error) => onError(error)
  );
}

// --- Crear ---

export async function createTask(
  userId: string,
  values: TaskFormValues
): Promise<void> {
  // Construimos el documento base sin campos opcionales.
  // Firestore rechaza `undefined`: si priority o dueDate no vienen,
  // los omitimos directamente en lugar de incluirlos como undefined.
  const newTask: Omit<Task, "id"> = {
    userId,
    title: values.title,
    description: values.description,
    completed: false,
    createdAt: serverTimestamp() as Timestamp,
  };

  if (values.priority !== undefined) {
    newTask.priority = values.priority;
  }

  if (values.dueDate) {
    // El form entrega dueDate como string "YYYY-MM-DD".
    // Lo convertimos a Timestamp de Firestore para ordenar y comparar fechas.
    newTask.dueDate = Timestamp.fromDate(new Date(values.dueDate));
  }

  await addDoc(collection(db, TASKS_COLLECTION), newTask);
}

// --- Editar ---

export async function updateTask(
  taskId: string,
  values: TaskFormValues
): Promise<void> {
  const taskRef = doc(db, TASKS_COLLECTION, taskId);

  // Mismo principio que en create: armamos el objeto con lo que venga,
  // sin incluir campos opcionales ausentes.
  const updates: Partial<Omit<Task, "id" | "userId" | "createdAt">> = {
    title: values.title,
    description: values.description,
  };

  if (values.priority !== undefined) {
    updates.priority = values.priority;
  }

  if (values.dueDate) {
    updates.dueDate = Timestamp.fromDate(new Date(values.dueDate));
  }

  await updateDoc(taskRef, updates);
}

// --- Marcar como completada / pendiente ---

export async function toggleTaskCompleted(
  taskId: string,
  currentValue: boolean
): Promise<void> {
  const taskRef = doc(db, TASKS_COLLECTION, taskId);
  await updateDoc(taskRef, { completed: !currentValue });
}

// --- Eliminar ---

export async function deleteTask(taskId: string): Promise<void> {
  const taskRef = doc(db, TASKS_COLLECTION, taskId);
  await deleteDoc(taskRef);
}
