// src/components/TaskList.tsx
// Renderiza las tareas en vista Lista (filas) o Solapa (grilla de cards).
// Gestiona selección múltiple y borrado en lote. Delega cada ítem a
// TaskItem (lista) o TaskCard (solapa).

import { useState, useEffect, useRef } from "react";
import { TaskItem } from "./TaskItem";
import { TaskCard } from "./TaskCard";
import { ConfirmModal } from "./ConfirmModal";
import type { Task, TaskFormValues, TaskFilter } from "../types";
import styles from "./TaskList.module.css";

type ViewMode = "list" | "grid";

interface TaskListProps {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  filter: TaskFilter;
  onFilterChange: (filter: TaskFilter) => void;
  onToggle: (taskId: string, currentValue: boolean) => Promise<void>;
  onEdit: (taskId: string, values: TaskFormValues) => Promise<void>;
  onDelete: (taskId: string) => Promise<void>;
  onDeleteMany: (ids: string[]) => Promise<void>;
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
  onDeleteMany,
}: TaskListProps) {
  const [view, setView] = useState<ViewMode>("list");
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [showModal, setShowModal] = useState(false);
  const [viewMenuOpen, setViewMenuOpen] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const viewMenuRef = useRef<HTMLDivElement>(null);

  // Limpia la selección al cambiar el filtro activo
  useEffect(() => {
    setSelectedIds(new Set());
  }, [filter]);

  // Cierra el modo selección al hacer click fuera del contenedor de tareas
  useEffect(() => {
    if (!isSelectionMode) return;
    function handleOutsideClick(e: MouseEvent) {
      if (sectionRef.current && !sectionRef.current.contains(e.target as Node)) {
        cancelSelectionMode();
      }
    }
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [isSelectionMode]);

  // Cierra el dropdown de vista (mobile) al hacer click fuera de él
  useEffect(() => {
    if (!viewMenuOpen) return;
    function handleOutsideClick(e: MouseEvent) {
      if (viewMenuRef.current && !viewMenuRef.current.contains(e.target as Node)) {
        setViewMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [viewMenuOpen]);

  function enterSelectionMode() {
    setIsSelectionMode(true);
  }

  function cancelSelectionMode() {
    setIsSelectionMode(false);
    setSelectedIds(new Set());
  }

  const allSelected = tasks.length > 0 && selectedIds.size === tasks.length;
  const deleteCount = selectedIds.size;

  function toggleSelect(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleSelectAll() {
    if (allSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(tasks.map((t) => t.id)));
    }
  }

  async function doDelete() {
    await onDeleteMany(Array.from(selectedIds));
    setSelectedIds(new Set());
  }

  function handleDeleteSelected() {
    // Modal solo cuando la acción dejaría la vista vacía
    if (deleteCount === tasks.length) {
      setShowModal(true);
    } else {
      void doDelete();
    }
  }

  async function confirmDelete() {
    await doDelete();
    setShowModal(false);
  }

  const hasTasks = !loading && !error && tasks.length > 0;

  const emptyMessage =
    filter === "all"
      ? "Todavía no tenés tareas. ¡Creá la primera!"
      : `No hay tareas ${filter === "pending" ? "pendientes" : "completadas"}.`;

  return (
    <section className={styles.section} ref={sectionRef}>
      {/* Barra superior: toggle de vista + acciones de selección */}
      <div className={styles.topBar}>
        <div className={styles.viewToggle}>
          <button
            type="button"
            onClick={() => setView("list")}
            className={`${styles.viewBtn} ${view === "list" ? styles.viewBtnActive : ""}`}
          >
            Lista
          </button>
          <button
            type="button"
            onClick={() => setView("grid")}
            className={`${styles.viewBtn} ${view === "grid" ? styles.viewBtnActive : ""}`}
          >
            Solapa
          </button>
        </div>

        {hasTasks && !isSelectionMode && (
          <button
            type="button"
            onClick={enterSelectionMode}
            className={styles.selectModeBtn}
          >
            Seleccionar
          </button>
        )}

        {hasTasks && isSelectionMode && (
          <div className={styles.bulkActions}>
            <button
              type="button"
              onClick={toggleSelectAll}
              className={styles.selectAllBtn}
            >
              {allSelected ? "Deseleccionar todos" : "Seleccionar todos"}
            </button>
            <button
              type="button"
              onClick={handleDeleteSelected}
              disabled={deleteCount === 0}
              className={`${styles.deleteBtn} ${deleteCount > 0 ? styles.deleteBtnActive : ""}`}
            >
              Borrar{deleteCount > 0 ? ` (${deleteCount})` : ""}
            </button>
            <button
              type="button"
              onClick={cancelSelectionMode}
              className={styles.cancelBtn}
            >
              Cancelar
            </button>
          </div>
        )}
      </div>

      {/* Barra superior mobile: dropdown de vista + filtros compactos + selección */}
      <div className={styles.mobileTopBar}>
        <div className={styles.mobileViewMenuWrapper} ref={viewMenuRef}>
          <button
            type="button"
            onClick={() => setViewMenuOpen((prev) => !prev)}
            className={styles.mobileViewBtn}
            aria-label="Cambiar vista"
            aria-expanded={viewMenuOpen}
          >
            ⋯
          </button>

          {viewMenuOpen && (
            <div className={styles.mobileViewMenu}>
              <button
                type="button"
                onClick={() => {
                  setView("list");
                  setViewMenuOpen(false);
                }}
                className={`${styles.mobileViewMenuBtn} ${view === "list" ? styles.mobileViewMenuBtnActive : ""}`}
              >
                Lista
              </button>
              <button
                type="button"
                onClick={() => {
                  setView("grid");
                  setViewMenuOpen(false);
                }}
                className={`${styles.mobileViewMenuBtn} ${view === "grid" ? styles.mobileViewMenuBtnActive : ""}`}
              >
                Solapa
              </button>
            </div>
          )}
        </div>

        {hasTasks && !isSelectionMode && (
          <button
            type="button"
            onClick={enterSelectionMode}
            className={styles.selectModeBtn}
          >
            Seleccionar
          </button>
        )}

        {hasTasks && isSelectionMode && (
          <div className={styles.mobileSelectionActions}>
            <button
              type="button"
              onClick={toggleSelectAll}
              className={styles.selectAllBtn}
            >
              Todos
            </button>
            <button
              type="button"
              onClick={handleDeleteSelected}
              disabled={deleteCount === 0}
              className={`${styles.deleteBtn} ${deleteCount > 0 ? styles.deleteBtnActive : ""}`}
            >
              Borrar{deleteCount > 0 ? ` (${deleteCount})` : ""}
            </button>
            <button
              type="button"
              onClick={cancelSelectionMode}
              className={styles.cancelBtn}
            >
              Cancelar
            </button>
          </div>
        )}
      </div>

      {/* Estados de carga y error */}
      {loading && <p className={styles.message}>Cargando tareas…</p>}
      {error && (
        <p role="alert" className={styles.error}>
          Error al cargar las tareas: {error}
        </p>
      )}

      {/* Vista Lista */}
      {view === "list" && (
        <div className={styles.container}>
          <div
            role="group"
            aria-label="Filtrar tareas"
            className={styles.tabs}
          >
            {FILTER_OPTIONS.map(({ value, label }) => (
              <button
                key={value}
                type="button"
                onClick={() => onFilterChange(value)}
                aria-pressed={filter === value}
                className={`${styles.tab} ${filter === value ? styles.tabActive : ""}`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className={styles.content}>
            {!loading && !error && tasks.length === 0 && (
              <p className={styles.message}>{emptyMessage}</p>
            )}

            {hasTasks && (
              <ul className={styles.list}>
                {tasks.map((task) => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    isSelected={selectedIds.has(task.id)}
                    isSelectionMode={isSelectionMode}
                    onSelect={toggleSelect}
                    onToggle={onToggle}
                    onEdit={onEdit}
                    onDelete={onDelete}
                  />
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

      {/* Vista Solapa */}
      {view === "grid" && (
        <div className={styles.container}>
          <div role="group" aria-label="Filtrar tareas" className={styles.tabs}>
            {FILTER_OPTIONS.map(({ value, label }) => (
              <button
                key={value}
                type="button"
                onClick={() => onFilterChange(value)}
                aria-pressed={filter === value}
                className={`${styles.tab} ${filter === value ? styles.tabActive : ""}`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className={styles.content}>
            {!loading && !error && tasks.length === 0 && (
              <p className={styles.message}>{emptyMessage}</p>
            )}

            {hasTasks && (
              <div className={styles.grid}>
                {tasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    isSelected={selectedIds.has(task.id)}
                    isSelectionMode={isSelectionMode}
                    onSelect={toggleSelect}
                    onToggle={onToggle}
                    onEdit={onEdit}
                    onDelete={onDelete}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {showModal && (
        <ConfirmModal
          count={deleteCount}
          onConfirm={confirmDelete}
          onCancel={() => setShowModal(false)}
        />
      )}
    </section>
  );
}
