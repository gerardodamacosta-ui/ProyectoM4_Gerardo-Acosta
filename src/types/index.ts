// src/types/index.ts
// Tipos compartidos del dominio.

import { Timestamp } from "firebase/firestore";

// --- Autenticación (Hito 3) ---

export interface AuthFormValues {
  email: string;
  password: string;
}

// --- Tareas (Hito 5) ---

// Una tarea tal como vive en Firestore. El `id` es el id del documento y
// `userId` es el dueño: sobre ese campo se apoyan las reglas de seguridad.
export interface Task {
  id: string;
  userId: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt: Timestamp;
  dueDate?: Timestamp; // extra: fecha de vencimiento (opcional)
  priority?: "low" | "medium" | "high"; // extra: prioridad (opcional)
}

// Lo que el formulario produce. `dueDate` es string en el form (input date)
// y se convierte a Timestamp al guardar. No incluye `id`, `userId`,
// `completed` ni `createdAt` porque esos los pone la app, no el usuario.
export interface TaskFormValues {
  title: string;
  description: string;
  dueDate?: string;
  priority?: "low" | "medium" | "high";
}

// Estados del filtro de la lista de tareas.
export type TaskFilter = "all" | "pending" | "completed";
