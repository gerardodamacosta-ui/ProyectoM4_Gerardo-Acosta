// src/services/emailService.ts
// Única pieza del frontend que sabe cómo llamar al endpoint de email.
// El componente nunca hace fetch inline: siempre pasa por acá.

interface EmailSummary {
  pending: number;
  completed: number;
}

export async function sendTaskSummaryEmail(
  to: string,
  summary: EmailSummary
): Promise<void> {
  const response = await fetch("/api/send-email", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ to, summary }),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(
      (data as { error?: string }).error ?? "Error al enviar el email."
    );
  }
}
