// src/pages/Tasks.tsx
// Página protegida de gestión de tareas. Ensambla el hook useTasks con los
// componentes de UI. No contiene lógica de negocio ni llamadas a Firestore.

import { useAuth } from "../hooks/useAuth";
import { useTheme } from "../hooks/useTheme";
import { useTasks } from "../hooks/useTasks";
import { logout } from "../services/authService";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { CounterCards } from "../components/CounterCards";
import { TaskForm } from "../components/TaskForm";
import { TaskList } from "../components/TaskList";
import { SendSummaryButton } from "../components/SendSummaryButton";

export function Tasks() {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
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
    removeMany,
    toggleTask,
  } = useTasks(user!.uid);

  // Conteos sobre el array completo (sin filtro) para los counters y el email
  const pending = tasks.filter((t) => !t.completed).length;
  const completed = tasks.filter((t) => t.completed).length;

  return (
    <>
      <Header
        userEmail={user!.email!}
        photoURL={user!.photoURL}
        theme={theme}
        onToggleTheme={toggleTheme}
        onLogout={logout}
      />

      <CounterCards
        total={tasks.length}
        pending={pending}
        completed={completed}
      />

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
        onDeleteMany={removeMany}
      />

      <SendSummaryButton
        to={user!.email!}
        pending={pending}
        completed={completed}
      />

      <Footer />
    </>
  );
}
