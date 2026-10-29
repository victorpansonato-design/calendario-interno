import { motion } from "motion/react";

import { press, spring } from "@/lib/motion";
import { cn } from "@/lib/utils";

export interface OpcaoSegmented<T extends string> {
   value: T;
   label: string;
   icon?: React.ComponentType<{ className?: string }>;
}

interface SegmentedProps<T extends string> {
   /** Precisa ser único por instância (anima a pastilha ativa). */
   layoutId: string;
   opcoes: OpcaoSegmented<T>[];
   value: T;
   onChange: (value: T) => void;
   ariaLabel: string;
   className?: string;
   size?: "sm" | "md";
}

/** Controle segmentado com pastilha animada (spring) entre as opções. */
export function Segmented<T extends string>({ layoutId, opcoes, value, onChange, ariaLabel, className, size = "md" }: SegmentedProps<T>) {
   return (
      <div
         role="radiogroup"
         aria-label={ariaLabel}
         className={cn("inline-flex w-fit max-w-full flex-wrap gap-1 rounded-lg bg-muted p-1", className)}
      >
         {opcoes.map(opcao => {
            const ativo = opcao.value === value;
            const Icon = opcao.icon;
            return (
               <motion.button
                  key={opcao.value}
                  type="button"
                  role="radio"
                  aria-checked={ativo}
                  whileTap={press}
                  onClick={() => onChange(opcao.value)}
                  className={cn(
                     "relative inline-flex items-center gap-1.5 rounded-md font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                     size === "sm" ? "h-7 px-2.5 text-xs" : "h-8 px-3 text-[13px]",
                     ativo ? "text-foreground" : "text-muted-foreground hover:text-foreground",
                  )}
               >
                  {ativo ? (
                     <motion.span
                        layoutId={layoutId}
                        transition={spring}
                        className="absolute inset-0 rounded-md bg-card shadow-xs"
                        aria-hidden
                     />
                  ) : null}
                  <span className="relative z-10 inline-flex items-center gap-1.5">
                     {Icon ? <Icon className="size-3.5" /> : null}
                     {opcao.label}
                  </span>
               </motion.button>
            );
         })}
      </div>
   );
}
