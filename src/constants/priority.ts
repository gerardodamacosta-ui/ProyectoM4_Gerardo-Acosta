// src/constants/priority.ts

import type { Task } from "../types";

export const PRIORITY_LABEL: Record<NonNullable<Task["priority"]>, string> = {
  low: "Baja",
  medium: "Media",
  high: "Alta",
};
