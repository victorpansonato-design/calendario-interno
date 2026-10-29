/**
 * Curvas e variantes de movimento (design system UniAnchieta, §8).
 * - spring: o que se move entre duas posições conhecidas (abas, indicadores).
 * - emphasis: o que chega (painéis, páginas).
 * - exit: o que sai — sempre mais rápido que a entrada.
 * `prefers-reduced-motion` é tratado pelo `MotionConfig` do `main.tsx`.
 */
import type { Transition, Variants } from "motion/react";

export const spring: Transition = { type: "spring", stiffness: 460, damping: 38, mass: 0.7 };
export const springSoft: Transition = { type: "spring", stiffness: 320, damping: 32, mass: 0.9 };

export const emphasis = [0.16, 1, 0.3, 1] as const;
export const exitCurve = [0.4, 0, 1, 1] as const;

export const enterFast: Transition = { duration: 0.22, ease: emphasis };
export const exitFast: Transition = { duration: 0.13, ease: exitCurve };

export const staggerContainer: Variants = {
   animate: { transition: { staggerChildren: 0.035, delayChildren: 0.02 } },
};

export const staggerItem: Variants = {
   initial: { opacity: 0, y: 10 },
   animate: { opacity: 1, y: 0, transition: { duration: 0.28, ease: emphasis } },
};

export const collapseVariants: Variants = {
   initial: { height: 0, opacity: 0 },
   animate: { height: "auto", opacity: 1, transition: { duration: 0.26, ease: emphasis } },
   exit: { height: 0, opacity: 0, transition: { duration: 0.18, ease: exitCurve } },
};

/** Feedback de toque uniforme em todo o app. */
export const press = { scale: 0.975 } as const;
export const pressSubtle = { scale: 0.99 } as const;
