// src/types/index.ts
// Tipos compartidos del dominio.
// Por ahora solo los de autenticación (Hito 3). En el Hito 5 sumamos
// Task, TaskFormValues, TaskFilter, etc.

export interface AuthFormValues {
  email: string;
  password: string;
}
