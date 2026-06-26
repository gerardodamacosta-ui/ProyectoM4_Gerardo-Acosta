// src/pages/Tasks.tsx
// Página protegida de gestión de tareas. Ensambla el hook useTasks con los
// componentes de UI. No contiene lógica de negocio ni llamadas a Firestore.

import { useAuth } from "../hooks/useAuth";
import { useTasks } from "../hooks/useTasks";
import { logout } from "../services/authService";
import { TaskForm } from "../components/TaskForm";
import { TaskList } from "../components/TaskList";
import { SendSummaryButton } from "../components/SendSummaryButton";

export function Tasks() {
  const { user } = useAuth();
  const {
    tasks,
    filteredTasks,
    loading,
    error,
    filter,
    setFilter,
    addTask,
    editTask,
    removeTask,
    toggleTask,
  } = useTasks(user!.uid);

  // Los conteos se calculan sobre `tasks` (array completo, sin filtro aplicado)
  // para que el resumen del email refleje el estado real, no el filtro activo.
  const pending = tasks.filter((t) => !t.completed).length;
  const completed = tasks.filter((t) => t.completed).length;

  return (
    <div>
      <header>
        <h1>Mis tareas</h1>
        <span>{user?.email}</span>
        <button type="button" onClick={() => logout()}>
          Cerrar sesión
        </button>
      </header>

      <TaskForm onSubmit={addTask} />

      <TaskList
        tasks={filteredTasks}
        loading={loading}
        error={error}
        filter={filter}
        onFilterChange={setFilter}
        onToggle={toggleTask}
        onEdit={editTask}
        onDelete={removeTask}
      />

      <SendSummaryButton
        to={user!.email!}
        pending={pending}
        completed={completed}
      />
    </div>
  );
}
