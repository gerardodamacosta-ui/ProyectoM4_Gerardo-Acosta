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

function buildHtmlEmail(summary: SendEmailBody["summary"]): string {
  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Resumen de tareas — MateCode</title>
</head>
<body style="margin:0;padding:0;background-color:#f3effe;font-family:'Courier New',Courier,monospace;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f3effe;padding:40px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="480" cellpadding="0" cellspacing="0" style="background-color:#ede9fe;border-radius:12px;overflow:hidden;">
          <tr>
            <td align="center" bgcolor="#3b0764" style="background:linear-gradient(145deg,#3b0764,#7c3aed);padding:32px 24px;">
              <span style="font-family:'Courier New',Courier,monospace;font-size:22px;font-weight:bold;color:#ffffff;">&lt;/&gt;</span>
              <br>
              <span style="font-family:'Courier New',Courier,monospace;font-size:28px;font-weight:bold;color:#ffffff;letter-spacing:2px;">MateCode</span>
            </td>
          </tr>
          <tr>
            <td style="padding:32px 32px 24px;">
              <p style="font-family:'Courier New',Courier,monospace;font-size:16px;color:#1e1b4b;margin:0 0 8px 0;">Hola,</p>
              <p style="font-family:'Courier New',Courier,monospace;font-size:14px;color:#1e1b4b;margin:0 0 28px 0;">Este es el resumen de tus tareas en MateCode:</p>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
                <tr>
                  <td width="48%" align="center" style="background-color:#ddd6fe;border-radius:8px;padding:20px 16px;">
                    <span style="font-family:'Courier New',Courier,monospace;font-size:36px;font-weight:bold;color:#7c3aed;display:block;">${summary.pending}</span>
                    <span style="font-family:'Courier New',Courier,monospace;font-size:11px;color:#6d28d9;text-transform:uppercase;letter-spacing:1px;">Pendientes</span>
                  </td>
                  <td width="4%"></td>
                  <td width="48%" align="center" style="background-color:#ddd6fe;border-radius:8px;padding:20px 16px;">
                    <span style="font-family:'Courier New',Courier,monospace;font-size:36px;font-weight:bold;color:#7c3aed;display:block;">${summary.completed}</span>
                    <span style="font-family:'Courier New',Courier,monospace;font-size:11px;color:#6d28d9;text-transform:uppercase;letter-spacing:1px;">Completadas</span>
                  </td>
                </tr>
              </table>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <a href="https://proyecto-m4-gerardo-acosta.vercel.app" style="display:inline-block;background-color:#2e1065;color:#e9d5ff;font-family:'Courier New',Courier,monospace;font-size:14px;font-weight:bold;text-decoration:none;padding:12px 36px;border-radius:999px;letter-spacing:1px;">Ir a la app</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding:16px 32px 8px;border-top:1px solid #c4b5fd;">
              <p style="font-family:'Courier New',Courier,monospace;font-size:12px;color:#6d28d9;margin:0;">MateCode Task Manager</p>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding:0 32px 28px;">
              <p style="font-family:'Courier New',Courier,monospace;font-size:12px;color:#6d28d9;letter-spacing:2px;margin:0 0 2px 0;">Desarrollador</p>
              <p style="font-family:'Courier New',Courier,monospace;font-size:15px;color:#7c3aed;letter-spacing:1.5px;margin:0;">Gerardo Acosta</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
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
          Body: {
            Text: { Data: emailBody, Charset: "UTF-8" },
            Html: { Data: buildHtmlEmail(summary), Charset: "UTF-8" },
          },
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
