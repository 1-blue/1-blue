"use client";

import { useEffect, useRef } from "react";

export const useDragScroll = <T extends HTMLElement>() => {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) {
      return;
    }

    let isDown = false;
    let startX = 0;
    let startScrollLeft = 0;
    let moved = false;

    const onPointerDown = (event: PointerEvent) => {
      if (event.pointerType !== "mouse" || event.button !== 0) {
        return;
      }
      isDown = true;
      moved = false;
      startX = event.clientX;
      startScrollLeft = el.scrollLeft;
    };

    const onPointerMove = (event: PointerEvent) => {
      if (!isDown) {
        return;
      }
      const dx = event.clientX - startX;
      if (!moved && Math.abs(dx) > 4) {
        moved = true;
        el.setPointerCapture?.(event.pointerId);
        el.classList.add("is-dragging");
      }
      if (moved) {
        el.scrollLeft = startScrollLeft - dx;
      }
    };

    const endDrag = (event: PointerEvent) => {
      if (!isDown) {
        return;
      }
      isDown = false;
      el.releasePointerCapture?.(event.pointerId);
      el.classList.remove("is-dragging");
    };

    const onClickCapture = (event: MouseEvent) => {
      if (moved) {
        event.preventDefault();
        event.stopPropagation();
        moved = false;
      }
    };

    el.addEventListener("pointerdown", onPointerDown);
    el.addEventListener("pointermove", onPointerMove);
    el.addEventListener("pointerup", endDrag);
    el.addEventListener("pointercancel", endDrag);
    el.addEventListener("pointerleave", endDrag);
    el.addEventListener("click", onClickCapture, true);

    return () => {
      el.removeEventListener("pointerdown", onPointerDown);
      el.removeEventListener("pointermove", onPointerMove);
      el.removeEventListener("pointerup", endDrag);
      el.removeEventListener("pointercancel", endDrag);
      el.removeEventListener("pointerleave", endDrag);
      el.removeEventListener("click", onClickCapture, true);
    };
  }, []);

  return ref;
};
