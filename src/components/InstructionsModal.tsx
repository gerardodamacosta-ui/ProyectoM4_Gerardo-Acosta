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
              El único campo obligatorio es el título. Podés agregar descripción,
              prioridad (Alta, Media o Baja) y fecha de vencimiento como campos
              opcionales. Hacé click en "+ Crear tarea" para guardarla. En
              mobile, tocá el botón "+" fijo en la esquina inferior derecha para
              abrir el formulario.
            </p>
          </section>

          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>Vistas y filtros</h3>
            <p className={styles.sectionText}>
              Alterná entre Vista Lista y Solapa con el toggle superior izquierdo
              del contenedor. Filtrá tus tareas por Todas / Pendientes /
              Completadas con los botones de la barra. En mobile, el cambio de
              vista está en el botón ⋯ de la barra superior, y los filtros se
              aplican tocando los contadores (Total, Pendientes, Completadas) en
              la parte superior de la pantalla.
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
              eliminarla individualmente. En mobile, esos botones se muestran
              como íconos (lápiz y basurero). También podés deslizar una tarea
              hacia la izquierda para eliminarla o hacia la derecha para marcarla
              como completada.
            </p>
          </section>

          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>Selección múltiple</h3>
            <p className={styles.sectionText}>
              Hacé click en "Seleccionar" para activar el modo selección. Luego
              clickeá sobre las tarjetas para seleccionarlas o deseleccionarlas.
              Tocá "Todos" para marcarlas todas a la vez y "Borrar (N)" para
              eliminarlas. Hacé click fuera del área de tareas o en "Cancelar"
              para salir del modo sin borrar nada. En mobile, el botón
              "Seleccionar" está visible directamente en el toolbar; al activarlo,
              muta a los botones "Todos", "Borrar (N)" y "Cancelar".
            </p>
          </section>

          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>Notificaciones</h3>
            <p className={styles.sectionText}>
              Cada acción importante (crear, editar, eliminar, enviar email)
              muestra una notificación breve en la parte superior de la pantalla
              confirmando el resultado o informando un error. Al eliminar, la
              notificación incluye un botón "Deshacer" que te da 5 segundos para
              revertir la acción antes de que se confirme el borrado.
            </p>
          </section>

          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>Resumen por email</h3>
            <p className={styles.sectionText}>
              El botón "✉ Enviar resumen" en el encabezado envía un resumen de
              tus tareas pendientes y completadas a tu dirección de email. En
              mobile, accedé a esta función desde el menú ☰.
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
