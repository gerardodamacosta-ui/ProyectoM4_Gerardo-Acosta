// src/utils/dateFormatting.ts

import type { Timestamp } from "firebase/firestore";

// Usa métodos locales (getFullYear/getMonth/getDate) en lugar de toISOString()
// para evitar que la conversión a UTC desplace la fecha en zonas UTC-.
export function toLocalDateString(ts: Timestamp): string {
  const d = ts.toDate();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
