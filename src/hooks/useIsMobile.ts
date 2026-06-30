// src/hooks/useIsMobile.ts
// Detección real de viewport mobile (vía matchMedia), no solo CSS.
// Necesaria para gestos táctiles: los listeners de react-swipeable se
// activan sobre el DOM real, no sobre lo que está visualmente oculto
// con display:none — por eso el breakpoint mobile (max-width:600px)
// se replica acá para poder deshabilitar el gesto en desktop.

import { useState, useEffect } from "react";

const QUERY = "(max-width: 600px)";

export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(() => window.matchMedia(QUERY).matches);

  useEffect(() => {
    const mql = window.matchMedia(QUERY);
    function handleChange(e: MediaQueryListEvent) {
      setIsMobile(e.matches);
    }
    mql.addEventListener("change", handleChange);
    return () => mql.removeEventListener("change", handleChange);
  }, []);

  return isMobile;
}
