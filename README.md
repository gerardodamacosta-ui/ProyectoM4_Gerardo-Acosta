# MateCode Task Manager

Aplicación web de gestión de tareas desarrollada como Proyecto Integrador del Módulo 4 de Soy Henry. Permite registrarse, iniciar sesión, crear y administrar tareas personales con sincronización en tiempo real, y recibir un resumen por email.

**URL de producción:** https://proyecto-m4-gerardo-acosta.vercel.app

---

## Stack tecnológico

- **Frontend:** React 19 + TypeScript + Vite
- **Autenticación y base de datos:** Firebase Authentication + Firestore
- **Email:** AWS SES vía Vercel Function (serverless)
- **Testing:** Vitest + React Testing Library
- **Deploy:** Vercel

---

## Funcionalidades

- Registro y login con **email/password** y **Google**
- Logout y sesión persistente (sobrevive recarga del navegador)
- Rutas protegidas: las tareas son inaccesibles sin sesión activa
- **CRUD completo de tareas:** crear, editar, eliminar y marcar como completada
- **Campos opcionales:** prioridad (baja / media / alta) y fecha de vencimiento
- **Filtros:** todas / pendientes / completadas
- Sincronización en tiempo real con `onSnapshot` — la UI se actualiza sin recargar
- Cada usuario ve solo sus propias tareas (aislamiento por `userId`)
- Envío de resumen de tareas por email (pendientes y completadas)

---

## Decisiones de arquitectura

### Separación de responsabilidades

El proyecto sigue un modelo de capas estricto:

| Capa | Responsabilidad |
|---|---|
| `src/components/` | UI pura, recibe datos y callbacks por props |
| `src/hooks/` | Estado y efectos secundarios (`useTasks`, `useAuth`) |
| `src/services/` | Llamadas a Firebase y al endpoint de email |
| `api/` | Lógica serverless (nunca se ejecuta en el navegador) |

Los componentes no importan Firebase directamente. Toda la lógica de Firestore está encapsulada en `firestoreService.ts` y consumida a través de `useTasks`.

### Seguridad de credenciales

Las variables de Firebase llevan el prefijo `VITE_` para que Vite las incluya en el bundle del cliente. Las credenciales de AWS **no tienen ese prefijo**: solo existen en el entorno de la Vercel Function y nunca llegan al navegador.

### Sincronización en tiempo real

`useTasks` abre una suscripción con `onSnapshot` al montar el componente y la cancela en el cleanup del `useEffect`. Esto evita memory leaks si el usuario cierra sesión o navega a otra ruta.

### Campos opcionales en Firestore

Firestore rechaza valores `undefined`. Los campos opcionales (`priority`, `dueDate`) se agregan al documento de forma condicional, solo cuando el usuario los proveyó, evitando errores silenciosos.

### Routing SPA en Vercel

`react-router-dom` usa `BrowserRouter`. Para que Vercel no devuelva 404 en accesos directos a rutas como `/tasks`, el archivo `vercel.json` define un rewrite que redirige todo el tráfico que no sea `/api/*` a `index.html`, donde React Router toma el control.

### Reglas de seguridad de Firestore

Las reglas en `firestore.rules` validan en el servidor que:
- El usuario esté autenticado (`request.auth != null`)
- Para lectura/escritura: `request.auth.uid == resource.data.userId`
- Para creación: `request.auth.uid == request.resource.data.userId`

Esto garantiza que ningún usuario pueda leer ni modificar las tareas de otro, independientemente del código del cliente.

---

## Flujo de envío de email

1. El usuario hace click en "Enviar resumen por email" en la página de tareas.
2. El frontend llama a `/api/send-email` con `{ to, summary: { pending, completed } }`.
3. La Vercel Function valida el payload y llama a AWS SES con las credenciales del entorno del servidor.
4. SES envía el email desde la dirección configurada en `SES_FROM_EMAIL`.
5. La UI muestra feedback de éxito o error según la respuesta.

El frontend **nunca** llama a AWS directamente. Las credenciales AWS no existen en el bundle del cliente.

> AWS SES en modo sandbox solo puede enviar a direcciones de email verificadas en la consola de AWS.

---

## Instalación local

### Requisitos

- Node.js 18+
- Cuenta de Firebase con un proyecto creado
- Cuenta de AWS con SES configurado (al menos un email verificado en sandbox)
- Vercel CLI (opcional, para probar las funciones serverless localmente)

### Pasos

```bash
# 1. Clonar el repositorio
git clone <URL-del-repo>
cd ProyectoM4_Gerardo-Acosta

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env
# Editar .env con los valores reales

# 4. Correr en desarrollo
npm run dev

# 5. Para probar el endpoint de email localmente
vercel dev
```

### Correr tests

```bash
npm run test
```

27 tests en 4 suites (firestoreService, TaskForm, TaskList, SendSummaryButton). Firebase está completamente mockeado — no se hacen llamadas reales.

---

## Variables de entorno

Copiar `.env.example` a `.env` y completar con los valores reales.

```env
# Firebase — prefijo VITE_ obligatorio (Vite las expone al cliente)
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=

# AWS SES — SIN prefijo VITE_ (solo serverless, nunca al cliente)
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=
SES_FROM_EMAIL=
```

En Vercel, cargar las mismas variables en **Settings → Environment Variables**. Las variables `VITE_*` aplican al build del frontend; las de AWS aplican a las Vercel Functions.

---

## Uso de IA en el desarrollo

Este proyecto fue desarrollado con asistencia de Claude Code (claude-opus-4-8 y claude-sonnet-4-6).

### Rol de la IA

La IA actuó como par técnico: consultaba el contexto del proyecto (CLAUDE.md), explicaba cada decisión antes de implementarla, y proponía opciones con trade-offs cuando había más de un camino posible. Todas las decisiones de diseño fueron revisadas y aprobadas explícitamente antes de que se escribiera código.

### Decisiones que influyeron en el diseño final

- **Estructura de Firestore como colección plana (`tasks/{taskId}` con campo `userId`)** en lugar de subcolecciones por usuario. Ventaja: queries más simples y reglas de seguridad uniformes. Decisión validada contra la rúbrica del proyecto vía NotebookLM.

- **`vi.hoisted()` para mocks en Vitest.** La IA identificó que `vi.mock` se eleva antes de las declaraciones de variables, causando `ReferenceError`. La solución fue envolver las funciones mock en `vi.hoisted()` para que estuvieran disponibles en el momento correcto.

- **`fireEvent.submit` en lugar de `userEvent.click` para el test de título vacío.** `userEvent.click` en el botón de submit activa la validación nativa HTML5 `required` en jsdom antes de llegar al handler de React. `fireEvent.submit` bypasea esa capa y permite testear la validación con `trim()` del handler.

- **Endpoint en `/api/` en la raíz** (zero-config Vercel) en lugar de `/functions/api/`. Vercel detecta automáticamente la carpeta `api/` en la raíz y la convierte en funciones sin configuración adicional.

- **Rewrite en `vercel.json` para SPA.** La IA identificó proactivamente que `BrowserRouter` requiere un fallback del servidor para que las recargas de página y los accesos directos a rutas no devuelvan 404.

### Qué no delegué a la IA

- La decisión de qué habilitar en Firebase Console (Authentication providers, región de Firestore).
- La configuración de AWS SES (verificación de emails, credenciales IAM, región).
- La revisión y aprobación de cada commit antes de ejecutarlo.
- Las pruebas manuales del flujo completo en el navegador.
