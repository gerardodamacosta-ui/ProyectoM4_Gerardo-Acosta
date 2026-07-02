// src/components/SendSummaryButton.tsx
// Botón que envía el resumen de tareas por email.
// El feedback de éxito/error se delega a react-hot-toast.

import { useState } from "react";
import toast from "react-hot-toast";
import { sendTaskSummaryEmail } from "../services/emailService";
import { MESSAGES } from "../constants/messages";
import styles from "./SendSummaryButton.module.css";

interface SendSummaryButtonProps {
  to: string;
  pending: number;
  completed: number;
  // "button": pill estándar del header. "menuItem": fila dentro del dropdown
  // del menú hamburguesa (misma lógica de envío, look distinto).
  variant?: "button" | "menuItem";
}

export function SendSummaryButton({
  to,
  pending,
  completed,
  variant = "button",
}: SendSummaryButtonProps) {
  const [loading, setLoading] = useState(false);

  async function handleSend() {
    setLoading(true);
    try {
      await sendTaskSummaryEmail(to, { pending, completed });
      toast.success(MESSAGES.email.success);
    } catch (error) {
      console.error("Error al enviar resumen:", error);
      toast.error(MESSAGES.email.error);
    } finally {
      setLoading(false);
    }
  }

  if (variant === "menuItem") {
    return (
      <button
        type="button"
        onClick={handleSend}
        disabled={loading}
        className={styles.menuItemBtn}
      >
        {loading ? "Enviando…" : "✉ Enviar resumen"}
      </button>
    );
  }

  return (
    <div className={styles.wrapper}>
      <button
        type="button"
        onClick={handleSend}
        disabled={loading}
        className={styles.btn}
      >
        ✉ {loading ? "Enviando…" : "Enviar resumen"}
      </button>
    </div>
  );
}
