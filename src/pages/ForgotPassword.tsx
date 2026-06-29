// src/pages/ForgotPassword.tsx
// Flujo de recuperación de contraseña — dos pasos manejados con estado interno.
// Paso "input": formulario de email. Paso "sent": confirmación de envío.
// Tema fijo claro, sin participación del sistema de tema oscuro/claro.

import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { sendPasswordReset } from "../services/authService";
import { getAuthErrorMessage } from "../utils/firebaseErrors";
import styles from "./ForgotPassword.module.css";

type Step = "input" | "sent";
type ResendState = "idle" | "loading" | "done";

function IconEmail() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <rect x="1" y="3" width="14" height="10" rx="2" stroke="#7c3aed" strokeWidth="1.4" />
      <path d="M1 5.5l7 4.5 7-4.5" stroke="#7c3aed" strokeWidth="1.4" />
    </svg>
  );
}

function IconSearch() {
  return (
    <svg width="26" height="26" viewBox="0 0 26 26" fill="none" aria-hidden="true">
      <circle cx="10" cy="10" r="7" stroke="#7c3aed" strokeWidth="1.8" />
      <path d="M15.5 15.5L24 24" stroke="#7c3aed" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M20 20l3 -3" stroke="#7c3aed" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("input");
  const [email, setEmail] = useState("");
  const [submittedEmail, setSubmittedEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [networkError, setNetworkError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendState, setResendState] = useState<ResendState>("idle");

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setNetworkError("");

    if (!email.trim()) {
      setEmailError("Ingresá tu email.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError("El formato del email no es válido.");
      return;
    }
    setEmailError("");

    setLoading(true);
    try {
      await sendPasswordReset(email);
      setSubmittedEmail(email);
      setStep("sent");
    } catch (error) {
      const code =
        typeof error === "object" && error !== null && "code" in error
          ? (error as { code: string }).code
          : "";
      // auth/user-not-found → transición exitosa igual (no revelar si el email existe)
      if (code === "auth/user-not-found") {
        setSubmittedEmail(email);
        setStep("sent");
      } else {
        setNetworkError(getAuthErrorMessage(error));
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    if (resendState !== "idle") return;
    setResendState("loading");
    try {
      await sendPasswordReset(submittedEmail);
    } catch {
      // Silencioso — misma práctica de seguridad que el envío inicial
    } finally {
      setResendState("done");
      setTimeout(() => setResendState("idle"), 3000);
    }
  }

  const hasInputError = !!(emailError || networkError);

  return (
    <div className={styles.page}>
      <div className={styles.orb1} aria-hidden="true" />
      <div
        className={step === "input" ? styles.orb2Right : styles.orb2Left}
        aria-hidden="true"
      />
      <div
        className={step === "input" ? styles.dotGridRight : styles.dotGridLeft}
        aria-hidden="true"
      />

      <div className={styles.card}>
        {/* Marca — idéntica en ambos pasos */}
        <div className={styles.logoMark} aria-hidden="true">
          {"</>"}
        </div>
        <h1 className={styles.brand}>MateCode</h1>

        {step === "input" ? (
          /* ── Pantalla 1: ingreso de email ── */
          <form onSubmit={handleSubmit} noValidate className={styles.form}>
            <div className={styles.iconBox} aria-hidden="true">
              <IconSearch />
            </div>

            <h2 className={styles.formTitle}>Recuperá tu contraseña</h2>
            <p className={styles.formDesc}>
              Ingresá tu email y te enviamos un link para restablecer tu contraseña.
            </p>

            <div
              className={`${styles.inputWrapper}${hasInputError ? ` ${styles.inputWrapperError}` : ""}`}
            >
              <IconEmail />
              <input
                id="forgot-email"
                type="email"
                aria-label="Email"
                placeholder="tu@email.com"
                className={styles.emailInput}
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setEmailError("");
                  setNetworkError("");
                }}
                disabled={loading}
                autoComplete="email"
              />
            </div>

            {emailError && (
              <p className={styles.fieldError} role="alert">
                {emailError}
              </p>
            )}
            {networkError && (
              <p className={styles.fieldError} role="alert">
                {networkError}
              </p>
            )}

            <button type="submit" disabled={loading} className={styles.primaryBtn}>
              {loading ? (
                "Enviando…"
              ) : (
                <>
                  Enviar link <span aria-hidden="true">→</span>
                </>
              )}
            </button>

            <Link to="/login" className={styles.backLink}>
              <span aria-hidden="true">←</span> Volver al login
            </Link>
          </form>
        ) : (
          /* ── Pantalla 2: confirmación ── */
          <div className={styles.confirmation}>
            {/* Ilustración sobre + check */}
            <div className={styles.envelopeContainer} aria-hidden="true">
              <div className={styles.envelopeBody}>
                <svg width="96" height="72" viewBox="0 0 96 72">
                  <path
                    d="M2 2l46 38L90 2"
                    stroke="#a78bfa"
                    strokeWidth="1.5"
                    fill="none"
                    strokeLinecap="round"
                  />
                  <line x1="2" y1="72" x2="34" y2="38" stroke="#c4b5fd" strokeWidth="1" opacity=".6" />
                  <line x1="94" y1="72" x2="62" y2="38" stroke="#c4b5fd" strokeWidth="1" opacity=".6" />
                </svg>
              </div>
              <div className={styles.checkBadge}>
                <svg width="14" height="11" viewBox="0 0 14 11" fill="none">
                  <path
                    d="M1.5 5.5L5.5 9.5L12.5 1.5"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>

            <h2 className={styles.confirmTitle}>¡Revisá tu email!</h2>
            <p className={styles.confirmSubtext}>Te enviamos un link a</p>
            <p className={styles.emailPill}>{submittedEmail}</p>

            <div className={styles.instructionCard}>
              <p className={styles.instructionText}>
                El link es válido por <strong>30 minutos</strong>. Si no aparece, revisá tu
                carpeta de spam.
              </p>
            </div>

            <button
              type="button"
              className={styles.primaryBtn}
              onClick={() => navigate("/login")}
            >
              <span aria-hidden="true">←</span> Volver al login
            </button>

            <div className={styles.resendRow}>
              {resendState === "done" ? (
                <span className={styles.resendDone}>¡Reenviado!</span>
              ) : (
                <button
                  type="button"
                  className={styles.resendBtn}
                  onClick={handleResend}
                  disabled={resendState === "loading"}
                >
                  {resendState === "loading" ? "Reenviando…" : "¿No llegó? Reenvialo"}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
