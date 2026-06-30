// src/hooks/useSwipeToAction.ts
// Envuelve useSwipeable (react-swipeable) para el patrón swipe derecha =
// completar / swipe izquierda = eliminar en TaskItem/TaskCard.
// `disabled` debe incluir tanto !isMobile (ver useIsMobile) como el modo
// selección activo, para que el gesto no dispare acciones en desktop ni
// pelee con el tap-to-select.

import { useState } from "react";
import { useSwipeable } from "react-swipeable";

interface UseSwipeToActionOptions {
  onSwipeRight: () => void;
  onSwipeLeft: () => void;
  disabled: boolean;
}

const SWIPE_THRESHOLD = 80;
const MAX_OFFSET = 120;

export function useSwipeToAction({
  onSwipeRight,
  onSwipeLeft,
  disabled,
}: UseSwipeToActionOptions) {
  const [offset, setOffset] = useState(0);

  const handlers = useSwipeable({
    onSwiping: (e) => {
      if (disabled) return;
      const clamped = Math.max(-MAX_OFFSET, Math.min(MAX_OFFSET, e.deltaX));
      setOffset(clamped);
    },
    onSwiped: (e) => {
      if (!disabled) {
        if (e.dir === "Left" && e.absX > SWIPE_THRESHOLD) onSwipeLeft();
        else if (e.dir === "Right" && e.absX > SWIPE_THRESHOLD) onSwipeRight();
      }
      setOffset(0);
    },
    trackMouse: false,
    preventScrollOnSwipe: true,
    delta: 10,
  });

  return { handlers, offset };
}
