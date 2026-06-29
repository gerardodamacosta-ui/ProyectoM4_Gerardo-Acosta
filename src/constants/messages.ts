// src/constants/messages.ts
// Strings de feedback para toasts. Centraliza todos los mensajes de la UI
// para evitar hardcode disperso y facilitar cambios futuros.

export const MESSAGES = {
  task: {
    created:         "Tarea creada.",
    createError:     "No se pudo crear la tarea.",
    updated:         "Tarea actualizada.",
    updateError:     "No se pudo actualizar la tarea.",
    deleted:         "Tarea eliminada.",
    deleteError:     "No se pudo eliminar la tarea.",
    deletedMany:     (n: number) => `${n} tarea${n > 1 ? "s" : ""} eliminada${n > 1 ? "s" : ""}.`,
    deleteManyError: "No se pudieron eliminar las tareas seleccionadas.",
    toggleError:     "No se pudo actualizar el estado de la tarea.",
  },
  email: {
    success: "Resumen enviado por email.",
    error:   "No se pudo enviar el email. Intentá de nuevo.",
  },
  generic: {
    error: "Algo salió mal. Intentá de nuevo.",
  },
} as const;
