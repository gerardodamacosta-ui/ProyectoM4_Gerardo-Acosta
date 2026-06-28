// tests/TaskList.test.tsx
// Tests de componente de TaskList. Cubren filtros, estados de carga/error
// y lista vacía. TaskItem está mockeado para aislar TaskList del DOM de cada ítem.

import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TaskList } from "../src/components/TaskList";
import type { Task, TaskFilter } from "../src/types";
import { Timestamp } from "firebase/firestore";

// Mockeamos TaskItem para no depender de su implementación ni de firebase/firestore
// (TaskItem importa Timestamp para la conversión de fechas).
vi.mock("../src/components/TaskItem", () => ({
  TaskItem: ({ task }: { task: Task }) => (
    <li data-testid="task-item">{task.title}</li>
  ),
}));

vi.mock("firebase/firestore", () => ({
  Timestamp: { fromDate: vi.fn() },
}));

// Props base reutilizables en cada test
const noop = vi.fn();
const BASE_PROPS = {
  tasks: [] as Task[],
  loading: false,
  error: null,
  filter: "all" as TaskFilter,
  onFilterChange: noop,
  onToggle: vi.fn(),
  onEdit: vi.fn(),
  onDelete: vi.fn(),
  onDeleteMany: vi.fn(),
};

function makeTask(overrides: Partial<Task> = {}): Task {
  return {
    id: "task-1",
    userId: "user-1",
    title: "Tarea de prueba",
    description: "",
    completed: false,
    createdAt: {} as Timestamp,
    ...overrides,
  };
}

describe("TaskList", () => {
  // --- Estados de carga y error ---

  it("muestra el indicador de carga cuando loading es true", () => {
    // Arrange + Act
    render(<TaskList {...BASE_PROPS} loading={true} />);

    // Assert
    expect(screen.getByText(/cargando tareas/i)).toBeInTheDocument();
  });

  it("muestra el error cuando error no es null", () => {
    // Arrange + Act
    render(<TaskList {...BASE_PROPS} error="Falló la conexión" />);

    // Assert
    expect(screen.getByRole("alert")).toHaveTextContent(/falló la conexión/i);
  });

  it("no muestra la lista cuando hay error", () => {
    // Arrange + Act
    render(
      <TaskList {...BASE_PROPS} tasks={[makeTask()]} error="Falló la conexión" />
    );

    // Assert
    expect(screen.queryByTestId("task-item")).not.toBeInTheDocument();
  });

  // --- Lista vacía ---

  it("muestra mensaje de lista vacía cuando no hay tareas y el filtro es 'all'", () => {
    // Arrange + Act
    render(<TaskList {...BASE_PROPS} tasks={[]} filter="all" />);

    // Assert
    expect(screen.getByText(/creá la primera/i)).toBeInTheDocument();
  });

  it("muestra mensaje específico cuando no hay tareas pendientes", () => {
    // Arrange + Act — caso borde: filtro activo sin resultados
    render(<TaskList {...BASE_PROPS} tasks={[]} filter="pending" />);

    // Assert
    expect(screen.getByText(/no hay tareas pendientes/i)).toBeInTheDocument();
  });

  it("muestra mensaje específico cuando no hay tareas completadas", () => {
    // Arrange + Act — caso borde: filtro activo sin resultados
    render(<TaskList {...BASE_PROPS} tasks={[]} filter="completed" />);

    // Assert
    expect(screen.getByText(/no hay tareas completadas/i)).toBeInTheDocument();
  });

  // --- Renderizado de tareas ---

  it("renderiza un ítem por cada tarea recibida", () => {
    // Arrange
    const tasks = [
      makeTask({ id: "1", title: "Primera" }),
      makeTask({ id: "2", title: "Segunda" }),
    ];

    // Act
    render(<TaskList {...BASE_PROPS} tasks={tasks} />);

    // Assert
    expect(screen.getAllByTestId("task-item")).toHaveLength(2);
    expect(screen.getByText("Primera")).toBeInTheDocument();
    expect(screen.getByText("Segunda")).toBeInTheDocument();
  });

  // --- Filtros ---

  it("marca el botón del filtro activo con aria-pressed=true", () => {
    // Arrange + Act
    render(<TaskList {...BASE_PROPS} filter="pending" />);

    // Assert
    expect(
      screen.getByRole("button", { name: /pendientes/i })
    ).toHaveAttribute("aria-pressed", "true");
    expect(
      screen.getByRole("button", { name: /todas/i })
    ).toHaveAttribute("aria-pressed", "false");
  });

  it("llama a onFilterChange con el valor correcto al cambiar el filtro", async () => {
    // Arrange
    const user = userEvent.setup();
    const onFilterChange = vi.fn();
    render(<TaskList {...BASE_PROPS} onFilterChange={onFilterChange} />);

    // Act
    await user.click(screen.getByRole("button", { name: /completadas/i }));

    // Assert
    expect(onFilterChange).toHaveBeenCalledWith("completed");
  });
});
