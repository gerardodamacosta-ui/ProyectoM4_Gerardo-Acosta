// tests/TaskForm.test.tsx
// Tests de componente de TaskForm. Prueban comportamiento observable
// (lo que el usuario ve e interactúa), no detalles de implementación.
// No hay llamadas reales a Firebase: el componente recibe onSubmit por prop.

import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TaskForm } from "../src/components/TaskForm";

describe("TaskForm", () => {
  // --- Modo creación ---

  it("renderiza el botón 'Crear tarea' cuando no recibe initialValues", () => {
    // Arrange + Act
    render(<TaskForm onSubmit={vi.fn()} />);

    // Assert
    expect(screen.getByRole("button", { name: /crear tarea/i })).toBeInTheDocument();
  });

  it("renderiza el botón 'Guardar cambios' cuando recibe initialValues", () => {
    // Arrange
    const initial = { title: "Tarea existente", description: "desc" };

    // Act
    render(<TaskForm onSubmit={vi.fn()} initialValues={initial} />);

    // Assert
    expect(screen.getByRole("button", { name: /guardar cambios/i })).toBeInTheDocument();
  });

  it("llama a onSubmit con los valores correctos al completar el formulario", async () => {
    // Arrange
    const user = userEvent.setup();
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    render(<TaskForm onSubmit={onSubmit} />);

    // Act
    await user.type(screen.getByLabelText(/título/i), "Mi nueva tarea");
    await user.type(screen.getByLabelText(/descripción/i), "Una descripción");
    await user.click(screen.getByRole("button", { name: /crear tarea/i }));

    // Assert
    await waitFor(() => expect(onSubmit).toHaveBeenCalledOnce());
    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "Mi nueva tarea",
        description: "Una descripción",
      })
    );
  });

  it("limpia el formulario después de un submit exitoso en modo creación", async () => {
    // Arrange
    const user = userEvent.setup();
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    render(<TaskForm onSubmit={onSubmit} />);
    const titleInput = screen.getByLabelText(/título/i);

    // Act
    await user.type(titleInput, "Tarea que se limpia");
    await user.click(screen.getByRole("button", { name: /crear tarea/i }));

    // Assert — el input vuelve a estar vacío
    await waitFor(() => expect(titleInput).toHaveValue(""));
  });

  // --- Caso borde: título vacío ---

  it("muestra error y no llama a onSubmit cuando el título está vacío", () => {
    // Arrange
    const onSubmit = vi.fn();
    const { container } = render(<TaskForm onSubmit={onSubmit} />);

    // Act — fireEvent.submit bypasea el `required` nativo del browser y deja
    // que llegue a nuestro handler React, donde está la validación con trim().
    fireEvent.submit(container.querySelector("form")!);

    // Assert
    expect(screen.getByRole("alert")).toHaveTextContent(/título es obligatorio/i);
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("muestra error y no llama a onSubmit cuando el título es solo espacios", async () => {
    // Arrange
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<TaskForm onSubmit={onSubmit} />);

    // Act — espacios pasan el `required` nativo pero no el trim() de React
    await user.type(screen.getByLabelText(/título/i), "   ");
    fireEvent.submit(screen.getByLabelText(/título/i).closest("form")!);

    // Assert
    expect(screen.getByRole("alert")).toHaveTextContent(/título es obligatorio/i);
    expect(onSubmit).not.toHaveBeenCalled();
  });

  // --- Caso borde: error en onSubmit ---

  it("muestra mensaje de error cuando onSubmit rechaza", async () => {
    // Arrange
    const user = userEvent.setup();
    const onSubmit = vi.fn().mockRejectedValue(new Error("Error de red"));
    render(<TaskForm onSubmit={onSubmit} />);

    // Act
    await user.type(screen.getByLabelText(/título/i), "Tarea válida");
    await user.click(screen.getByRole("button", { name: /crear tarea/i }));

    // Assert
    await waitFor(() =>
      expect(screen.getByRole("alert")).toHaveTextContent(/error al guardar/i)
    );
  });

  // --- Botón cancelar ---

  it("llama a onCancel cuando se pulsa el botón Cancelar", async () => {
    // Arrange
    const user = userEvent.setup();
    const onCancel = vi.fn();
    render(<TaskForm onSubmit={vi.fn()} onCancel={onCancel} />);

    // Act
    await user.click(screen.getByRole("button", { name: /cancelar/i }));

    // Assert
    expect(onCancel).toHaveBeenCalledOnce();
  });

  it("no renderiza el botón Cancelar si no se pasa onCancel", () => {
    // Arrange + Act
    render(<TaskForm onSubmit={vi.fn()} />);

    // Assert
    expect(screen.queryByRole("button", { name: /cancelar/i })).not.toBeInTheDocument();
  });
});
