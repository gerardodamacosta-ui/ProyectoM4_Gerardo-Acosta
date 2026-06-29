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
}

export function SendSummaryButton({
  to,
  pending,
  completed,
}: SendSummaryButtonProps) {
  const [loading, setLoading] = useState(false);

  async function handleSend() {
    setLoading(true);
    try {
      await sendTaskSummaryEmail(to, { pending, completed });
      toast.success(MESSAGES.email.success);
    } catch {
      toast.error(MESSAGES.email.error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.wrapper}>
      <button
        type="button"
        onClick={handleSend}
        disabled={loading}
        className={styles.btn}
      >
        {loading ? "Enviando…" : "Enviar resumen por email"}
      </button>
    </div>
  );
}
