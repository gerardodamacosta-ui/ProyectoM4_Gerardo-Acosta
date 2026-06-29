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
              Completá el formulario con título y descripción. Podés agregar
              prioridad (Alta, Media o Baja) y fecha de vencimiento como campos
              opcionales. Hacé click en "+ Crear tarea" para guardarla.
            </p>
          </section>

          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>Vistas y filtros</h3>
            <p className={styles.sectionText}>
              Alterná entre Vista Lista y Solapa con el toggle superior izquierdo
              del contenedor. Filtrá tus tareas por Todas / Pendientes /
              Completadas con los botones de la barra.
            </p>
          </section>

          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>Completar una tarea</h3>
            <p className={styles.sectionText}>
              El checkbox de cada tarea la marca como completada. Las tareas
              completadas se muestran tachadas y con menor opacidad.
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
              Hacé click en "Seleccionar" para activar el modo selección. Luego
              clickeá sobre las tarjetas para seleccionarlas o deseleccionarlas.
              Usá "Seleccionar todos" para marcarlas todas a la vez y "Borrar (N)"
              para eliminarlas. Hacé click fuera del área de tareas o en
              "Cancelar" para salir del modo sin borrar nada.
            </p>
          </section>

          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>Notificaciones</h3>
            <p className={styles.sectionText}>
              Cada acción importante (crear, editar, eliminar, enviar email)
              muestra una notificación breve en la parte superior de la pantalla
              confirmando el resultado o informando un error.
            </p>
          </section>

          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>Resumen por email</h3>
            <p className={styles.sectionText}>
              El botón "✉ Enviar resumen" en el encabezado envía un resumen de
              tus tareas pendientes y completadas a tu dirección de email.
            </p>
          </section>

          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>Tema claro / oscuro</h3>
            <p className={styles.sectionText}>
              Usá el botón ☀ / 🌙 en el encabezado para alternar entre el tema
              oscuro (verde neon) y el tema claro (violeta). La preferencia se
              guarda automáticamente.
            </p>
          </section>
        </div>

      </div>
    </div>
  );
}
