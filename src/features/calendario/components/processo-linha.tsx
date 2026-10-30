import { ChevronRight, Pencil } from "lucide-react";
import { motion } from "motion/react";

import { DependenciaTag, PrazoPropostoTag, Setores, StatusBadge, UrgenciaBadge } from "@/features/calendario/components/badges";
import { nomeBloco } from "@/features/calendario/data/catalogo";
import { dataComSemana } from "@/features/calendario/lib/datas";
import type { Processo } from "@/features/calendario/types/calendario.schema";
import { pressSubtle } from "@/lib/motion";
import { useProcessoAberto } from "@/features/calendario/hooks/use-processo-aberto";
import { cn } from "@/lib/utils";

interface ProcessoLinhaProps {
   processo: Processo;
   onAbrir: (id: string) => void;
   /** Esconde a etapa quando a lista já está agrupada por ela. */
   ocultarEtapa?: boolean;
   compacto?: boolean;
}

function Prazo({ processo }: { processo: Processo }) {
   if (processo.prazoTipo === "data" && processo.prazo) {
      return <span className="font-mono text-[12.5px] tabular text-foreground">{dataComSemana(processo.prazo)}</span>;
   }
   if (processo.prazoTipo === "continuo") return <span className="text-xs text-muted-foreground">Semestre todo</span>;
   return <span className="text-xs text-muted-foreground">{processo.quando ?? "Sem data"}</span>;
}

/** Item de lista clicável: o que é, de quem é, quando vence. */
export function ProcessoLinha({ processo, onAbrir, ocultarEtapa, compacto }: ProcessoLinhaProps) {
   const concluido = processo.status === "concluido";
   const { aberto } = useProcessoAberto();
   return (
      <motion.button
         type="button"
         data-processo-id={processo.id}
         aria-current={aberto === processo.id ? "true" : undefined}
         whileTap={pressSubtle}
         onClick={() => onAbrir(processo.id)}
         className={cn(
            "group flex w-full items-start gap-3 px-4 py-3.5 text-left transition-colors duration-150 hover:bg-muted/50 focus-visible:bg-primary-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring",
            aberto === processo.id && "bg-primary-soft",
         )}
      >
         <div className={cn("flex min-w-0 flex-1 flex-col gap-2", !compacto && "sm:flex-row sm:items-start sm:gap-4")}>
            <div className="min-w-0 flex-1">
               <div className="flex items-baseline gap-2">
                  <span className="shrink-0 font-mono text-[12px] font-medium tabular text-primary">{processo.id}</span>
                  <span
                     className={cn(
                        "text-sm font-medium leading-snug",
                        concluido ? "text-muted-foreground line-through decoration-muted-foreground/50" : "text-foreground",
                     )}
                  >
                     {processo.nome}
                  </span>
                  {processo.alterado ? <Pencil className="size-3 shrink-0 text-muted-foreground" aria-label="Alterado no sistema" /> : null}
               </div>
               <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1">
                  <Setores processo={processo} />
                  {!ocultarEtapa ? <span className="text-[11px] text-muted-foreground">{nomeBloco(processo.bloco)}</span> : null}
                  <DependenciaTag dependencia={processo.dependencia} />
                  {processo.prazoProposto ? <PrazoPropostoTag /> : null}
               </div>
            </div>
            <div className={cn("flex shrink-0 flex-wrap items-center gap-x-2 gap-y-1.5", !compacto && "sm:flex-col sm:items-end")}>
               <Prazo processo={processo} />
               <div className="flex items-center gap-1.5">
                  {processo.status === "em-andamento" ? <StatusBadge status={processo.status} /> : null}
                  <UrgenciaBadge urgencia={processo.urgencia} dias={processo.diasParaPrazo} />
               </div>
            </div>
         </div>
         <ChevronRight
            className="mt-0.5 size-4 shrink-0 text-muted-foreground/50 transition-colors group-hover:text-muted-foreground"
            aria-hidden
         />
      </motion.button>
   );
}
