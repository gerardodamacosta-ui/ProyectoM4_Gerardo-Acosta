// src/components/InstructionsModal.tsx
// Modal de instrucciones de uso de MateCode. Contenido estático.
// Tipografía de cuerpo en system-ui para mejorar legibilidad.

import styles from "./InstructionsModal.module.css";

interface InstructionsModalProps {
  onClose: () => void;
}

export function InstructionsModal({ onClose }: InstructionsModalProps) {
  return (
    <div
      className={styles.overlay}
      role="dialog"
      aria-modal="true"
      aria-labelledby="instructions-title"
      onClick={onClose}
    >
      <div className={styles.card} onClick={(e) => e.stopPropagation()}>
        <h2 id="instructions-title" className={styles.title}>
          Cómo usar MateCode
        </h2>

        <div className={styles.body}>
          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>Crear tarea</h3>
            <p className={styles.sectionText}>
              Completá el formulario superior con título, descripción,
              prioridad y fecha de vencimiento opcionales. Hacé click en
              "+ Crear tarea" para guardarla.
            </p>
          </section>

          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>Filtrar y vistas</h3>
            <p className={styles.sectionText}>
              Filtrá por Todas / Pendientes / Completadas con los botones del
              contenedor. Alternará entre Vista Lista y Solapa con el toggle
              superior izquierdo.
            </p>
          </section>

          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>Completar una tarea</h3>
            <p className={styles.sectionText}>
              El checkbox izquierdo de cada tarea la marca como completada.
              Las tareas completadas se muestran tachadas y con menor opacidad.
            </p>
          </section>

          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>Editar y eliminar</h3>
            <p className={styles.sectionText}>
              Cada tarea tiene botones propios para editar su contenido o
              eliminarla individualmente.
            </p>
          </section>

          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>Selección múltiple</h3>
            <p className={styles.sectionText}>
              Usá "Seleccionar todos" y el botón "Borrar (N)" para eliminar
              varias tareas a la vez. Si la acción dejaría la vista vacía,
              aparece un modal de confirmación.
            </p>
          </section>

          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>Resumen por email</h3>
            <p className={styles.sectionText}>
              El botón al pie de la página envía un resumen de tus tareas
              pendientes y completadas a tu dirección de email.
            </p>
          </section>
        </div>

      </div>
    </div>
  );
}
