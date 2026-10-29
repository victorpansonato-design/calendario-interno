import { motion } from "motion/react";

import { pressSubtle, staggerItem } from "@/lib/motion";
import { cn } from "@/lib/utils";

interface StatTileProps {
   label: string;
   valor: number | string;
   detalhe?: string;
   icon?: React.ComponentType<{ className?: string }>;
   /** Cor só quando significa algo: "danger" para atraso, "warning" para atenção. */
   tom?: "neutral" | "danger" | "warning" | "success";
   onClick?: () => void;
}

const TOM_VALOR: Record<NonNullable<StatTileProps["tom"]>, string> = {
   neutral: "text-foreground",
   danger: "text-destructive",
   warning: "text-warning-foreground",
   success: "text-success",
};

/** Número de resumo. Clicável quando leva para a lista filtrada. */
export function StatTile({ label, valor, detalhe, icon: Icon, tom = "neutral", onClick }: StatTileProps) {
   const conteudo = (
      <>
         <div className="flex items-center justify-between gap-2">
            <span className="text-[13px] font-medium text-muted-foreground">{label}</span>
            {Icon ? <Icon className="size-4 text-muted-foreground" aria-hidden /> : null}
         </div>
         <div className={cn("mt-2 font-display text-[26px] font-medium leading-none tabular", TOM_VALOR[tom])}>{valor}</div>
         {detalhe ? <p className="mt-2 text-xs text-muted-foreground">{detalhe}</p> : null}
      </>
   );

   const classe = "flex flex-col justify-start rounded-xl border bg-card p-4 text-left shadow-sm";

   if (onClick) {
      return (
         <motion.button
            type="button"
            variants={staggerItem}
            whileTap={pressSubtle}
            onClick={onClick}
            className={cn(
               classe,
               "transition-colors duration-150 hover:border-border-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            )}
         >
            {conteudo}
         </motion.button>
      );
   }
   return (
      <motion.div variants={staggerItem} className={classe}>
         {conteudo}
      </motion.div>
   );
}
