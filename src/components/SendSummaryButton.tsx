// src/components/SendSummaryButton.tsx
// Botón que envía el resumen de tareas por email. Maneja sus propios estados
// de loading / success / error para no ensuciar la página Tasks.

import { useState } from "react";
import { sendTaskSummaryEmail } from "../services/emailService";
import styles from "./SendSummaryButton.module.css";

interface SendSummaryButtonProps {
  to: string;
  pending: number;
  completed: number;
}

type SendState = "idle" | "loading" | "success" | "error";

export function SendSummaryButton({
  to,
  pending,
  completed,
}: SendSummaryButtonProps) {
  const [state, setState] = useState<SendState>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSend() {
    setState("loading");
    setErrorMessage(null);
    try {
      await sendTaskSummaryEmail(to, { pending, completed });
      setState("success");
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Error al enviar el email."
      );
      setState("error");
    }
  }

  return (
    <div className={styles.wrapper}>
      <button
        type="button"
        onClick={handleSend}
        disabled={state === "loading"}
        className={styles.btn}
      >
        {state === "loading" ? "Enviando…" : "Enviar resumen por email"}
      </button>

      {state === "success" && (
        <p role="status" className={styles.success}>Resumen enviado a {to}.</p>
      )}

      {state === "error" && (
        <p role="alert" className={styles.error}>{errorMessage}</p>
      )}
    </div>
  );
}
