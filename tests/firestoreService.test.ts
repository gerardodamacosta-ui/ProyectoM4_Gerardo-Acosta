// tests/firestoreService.test.ts
// Tests unitarios de la capa de acceso a Firestore.
// Firebase está completamente mockeado: no se hacen llamadas reales a la BD.

import { describe, it, expect, vi, beforeEach } from "vitest";
import { createTask, toggleTaskCompleted, deleteTask } from "../src/services/firestoreService";

// vi.hoisted() declara las funciones ANTES del hoisting de vi.mock,
// lo que permite referenciarlas dentro de la factory del mock.
const {
  mockAddDoc,
  mockUpdateDoc,
  mockDeleteDoc,
  mockDoc,
  mockCollection,
  mockServerTimestamp,
  mockTimestampFromDate,
} = vi.hoisted(() => ({
  mockAddDoc: vi.fn().mockResolvedValue({ id: "mock-id" }),
  mockUpdateDoc: vi.fn().mockResolvedValue(undefined),
  mockDeleteDoc: vi.fn().mockResolvedValue(undefined),
  mockDoc: vi.fn().mockReturnValue("mock-doc-ref"),
  mockCollection: vi.fn().mockReturnValue("mock-collection-ref"),
  mockServerTimestamp: vi.fn().mockReturnValue("mock-server-timestamp"),
  mockTimestampFromDate: vi.fn((date: Date) => ({
    toDate: () => date,
    seconds: Math.floor(date.getTime() / 1000),
    nanoseconds: 0,
  })),
}));

// Mockeamos firebase/firestore completo: cualquier import de ese módulo
// en el código bajo test queda reemplazado por estas funciones.
vi.mock("firebase/firestore", () => ({
  collection: mockCollection,
  query: vi.fn(),
  where: vi.fn(),
  orderBy: vi.fn(),
  onSnapshot: vi.fn(),
  addDoc: mockAddDoc,
  updateDoc: mockUpdateDoc,
  deleteDoc: mockDeleteDoc,
  doc: mockDoc,
  serverTimestamp: mockServerTimestamp,
  Timestamp: { fromDate: mockTimestampFromDate },
}));

// Mockeamos la instancia `db` que usa el service.
vi.mock("../src/services/firebase", () => ({ db: {} }));

// --- Tests ---

describe("firestoreService", () => {
  beforeEach(() => {
    // Limpiamos el historial de llamadas entre tests para que no se contaminen.
    vi.clearAllMocks();
  });

  describe("createTask", () => {
    it("guarda los campos base cuando no hay campos opcionales", async () => {
      // Arrange
      const userId = "user-123";
      const values = { title: "Tarea base", description: "Sin opcionales" };

      // Act
      await createTask(userId, values);

      // Assert — verificamos qué se pasó como segundo arg a addDoc (el documento)
      expect(mockAddDoc).toHaveBeenCalledOnce();
      const savedDoc = mockAddDoc.mock.calls[0][1];
      expect(savedDoc).toMatchObject({
        userId: "user-123",
        title: "Tarea base",
        description: "Sin opcionales",
        completed: false,
        createdAt: "mock-server-timestamp",
      });
    });

    it("omite priority y dueDate cuando no se proporcionan", async () => {
      // Arrange — caso borde crítico: Firestore rechaza campos `undefined`
      const values = { title: "Sin extras", description: "" };

      // Act
      await createTask("user-123", values);

      // Assert — el documento NO debe tener las claves, ni siquiera como undefined
      const savedDoc = mockAddDoc.mock.calls[0][1];
      expect(savedDoc).not.toHaveProperty("priority");
      expect(savedDoc).not.toHaveProperty("dueDate");
    });

    it("incluye priority y dueDate cuando se proporcionan", async () => {
      // Arrange
      const values = {
        title: "Con extras",
        description: "Con prioridad y fecha",
        priority: "high" as const,
        dueDate: "2026-07-15",
      };

      // Act
      await createTask("user-123", values);

      // Assert
      const savedDoc = mockAddDoc.mock.calls[0][1];
      expect(savedDoc.priority).toBe("high");
      // dueDate debe ser el Timestamp convertido, no el string original
      expect(mockTimestampFromDate).toHaveBeenCalledWith(new Date("2026-07-15"));
      expect(savedDoc.dueDate).toBeDefined();
    });
  });

  describe("toggleTaskCompleted", () => {
    it("invierte el valor de completed de true a false", async () => {
      // Act
      await toggleTaskCompleted("task-abc", true);

      // Assert
      expect(mockUpdateDoc).toHaveBeenCalledWith("mock-doc-ref", {
        completed: false,
      });
    });

    it("invierte el valor de completed de false a true", async () => {
      // Act
      await toggleTaskCompleted("task-abc", false);

      // Assert
      expect(mockUpdateDoc).toHaveBeenCalledWith("mock-doc-ref", {
        completed: true,
      });
    });
  });

  describe("deleteTask", () => {
    it("llama a deleteDoc con la referencia correcta del documento", async () => {
      // Act
      await deleteTask("task-xyz");

      // Assert
      expect(mockDoc).toHaveBeenCalledWith({}, "tasks", "task-xyz");
      expect(mockDeleteDoc).toHaveBeenCalledWith("mock-doc-ref");
    });
  });
});
