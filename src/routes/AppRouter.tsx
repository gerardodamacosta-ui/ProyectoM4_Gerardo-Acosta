// src/routes/AppRouter.tsx
// Definición central de rutas de la app.
// Públicas (envueltas en PublicOnlyRoute): /login, /register
// Protegida (envuelta en ProtectedRoute): /tasks
// /  y  cualquier ruta desconocida → /tasks (y si no hay sesión, ProtectedRoute rebota a /login).

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Login } from "../pages/Login";
import { Register } from "../pages/Register";
import { Tasks } from "../pages/Tasks";
import { ProtectedRoute } from "./ProtectedRoute";
import { PublicOnlyRoute } from "./PublicOnlyRoute";

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={
            <PublicOnlyRoute>
              <Login />
            </PublicOnlyRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicOnlyRoute>
              <Register />
            </PublicOnlyRoute>
          }
        />
        <Route
          path="/tasks"
          element={
            <ProtectedRoute>
              <Tasks />
            </ProtectedRoute>
          }
        />
        {/* Raíz y rutas desconocidas van a /tasks; el guardia decide si hay acceso. */}
        <Route path="/" element={<Navigate to="/tasks" replace />} />
        <Route path="*" element={<Navigate to="/tasks" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
