// api/send-email.ts
// Vercel Function (serverless). Vercel sirve automáticamente cualquier archivo
// dentro de /api en la raíz como un endpoint: este queda en POST /api/send-email.
//
// Corre SOLO en el servidor: las credenciales de AWS se leen de process.env y
// nunca llegan al navegador. El frontend le pega a este endpoint, jamás a AWS.

import type { VercelRequest, VercelResponse } from "@vercel/node";
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";

// Forma esperada del body que manda el frontend.
interface SendEmailBody {
  to: string;
  summary: {
    pending: number;
    completed: number;
  };
}

// El SDK v3 toma AWS_ACCESS_KEY_ID y AWS_SECRET_ACCESS_KEY automáticamente
// desde las variables de entorno (default credential provider chain).
// Solo le pasamos la región de forma explícita.
const ses = new SESClient({ region: process.env.AWS_REGION });

// Valida que el body tenga la forma correcta. Devuelve un mensaje de error
// si algo falta o tiene el tipo equivocado, o null si está todo bien.
function validateBody(body: unknown): string | null {
  if (typeof body !== "object" || body === null) {
    return "El body debe ser un objeto JSON.";
  }
  const { to, summary } = body as Partial<SendEmailBody>;

  if (typeof to !== "string" || to.trim() === "") {
    return "Falta el campo 'to' (email del destinatario).";
  }
  if (
    typeof summary !== "object" ||
    summary === null ||
    typeof summary.pending !== "number" ||
    typeof summary.completed !== "number"
  ) {
    return "Falta 'summary' con los conteos numéricos 'pending' y 'completed'.";
  }
  return null;
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Solo aceptamos POST: el envío de email no es una operación idempotente de lectura.
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido. Usá POST." });
  }

  // Validación del payload: si algo falta, cortamos con 400 antes de tocar SES.
  const validationError = validateBody(req.body);
  if (validationError) {
    return res.status(400).json({ error: validationError });
  }

  const { to, summary } = req.body as SendEmailBody;
  const fromEmail = process.env.SES_FROM_EMAIL;

  // Si falta la config del servidor, es un error nuestro (500), no del cliente.
  if (!fromEmail) {
    return res
      .status(500)
      .json({ error: "Falta SES_FROM_EMAIL en la configuración del servidor." });
  }

  // Cuerpo del email en texto plano (el formato base que pide la rúbrica).
  const emailBody =
    `Hola,\n\n` +
    `Este es el resumen de tus tareas en MateCode:\n\n` +
    `Pendientes: ${summary.pending}\n` +
    `Completadas: ${summary.completed}\n\n` +
    `—\n` +
    `MateCode Task Manager`;

  try {
    await ses.send(
      new SendEmailCommand({
        Source: fromEmail,
        Destination: { ToAddresses: [to] },
        Message: {
          Subject: { Data: "Resumen de tus tareas — MateCode", Charset: "UTF-8" },
          Body: { Text: { Data: emailBody, Charset: "UTF-8" } },
        },
      })
    );
    return res.status(200).json({ message: "Email enviado correctamente." });
  } catch (error) {
    // No filtramos el detalle del error de AWS al cliente; lo logueamos en el server.
    console.error("Error al enviar email con SES:", error);
    return res
      .status(502)
      .json({ error: "No se pudo enviar el email. Intentá de nuevo más tarde." });
  }
}
