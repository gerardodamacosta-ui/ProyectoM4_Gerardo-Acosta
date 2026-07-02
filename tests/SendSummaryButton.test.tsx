// tests/SendSummaryButton.test.tsx
// Prueba los dos caminos del botón de email: éxito y error del serverless.
// emailService está mockeado: no se hacen llamadas reales a /api/send-email.

import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import toast, { Toaster } from "react-hot-toast";
import { SendSummaryButton } from "../src/components/SendSummaryButton";

const { mockSendEmail } = vi.hoisted(() => ({
  mockSendEmail: vi.fn(),
}));

vi.mock("../src/services/emailService", () => ({
  sendTaskSummaryEmail: mockSendEmail,
}));

const DEFAULT_PROPS = {
  to: "usuario@example.com",
  pending: 3,
  completed: 5,
};

describe("SendSummaryButton", () => {
  afterEach(() => toast.remove());
  it("muestra feedback de éxito cuando el email se envía correctamente", async () => {
    // Arrange
    const user = userEvent.setup();
    mockSendEmail.mockResolvedValue(undefined);
    render(<><SendSummaryButton {...DEFAULT_PROPS} /><Toaster /></>);

    // Act
    await user.click(screen.getByRole("button", { name: /enviar resumen/i }));

    // Assert
    await waitFor(() =>
      expect(screen.getByRole("status")).toHaveTextContent(/resumen enviado/i)
    );
    expect(mockSendEmail).toHaveBeenCalledWith("usuario@example.com", {
      pending: 3,
      completed: 5,
    });
  });

  it("muestra el error del serverless cuando el envío falla", async () => {
    // Arrange — caso borde: la función serverless rechaza
    const user = userEvent.setup();
    mockSendEmail.mockRejectedValue(new Error("Error interno del servidor"));
    render(<><SendSummaryButton {...DEFAULT_PROPS} /><Toaster /></>);

    // Act
    await user.click(screen.getByRole("button", { name: /enviar resumen/i }));

    // Assert
    await waitFor(() =>
      expect(screen.getByRole("status")).toHaveTextContent(/no se pudo enviar el email/i)
    );
  });

  it("deshabilita el botón mientras se está enviando", async () => {
    // Arrange — promesa que nunca resuelve para atrapar el estado intermedio
    const user = userEvent.setup();
    mockSendEmail.mockReturnValue(new Promise(() => {}));
    render(<><SendSummaryButton {...DEFAULT_PROPS} /><Toaster /></>);

    // Act
    await user.click(screen.getByRole("button", { name: /enviar resumen/i }));

    // Assert
    expect(screen.getByRole("button", { name: /enviando/i })).toBeDisabled();
  });
});
