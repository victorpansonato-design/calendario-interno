import { CalendarClock, Lock } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
   DEPENDENCIA_DICA,
   DEPENDENCIA_LABEL,
   getSetor,
   STATUS_DICA,
   STATUS_LABEL,
   URGENCIA_LABEL,
   URGENCIA_TOM,
} from "@/features/calendario/data/catalogo";
import { distanciaEmDias } from "@/features/calendario/lib/datas";
import type { Dependencia, Processo, Status, Urgencia } from "@/features/calendario/types/calendario.schema";

const STATUS_TOM: Record<Status, "neutral" | "primary" | "success" | "danger"> = {
   "a-fazer": "neutral",
   "em-andamento": "primary",
   concluido: "success",
   bloqueado: "danger",
};

export function StatusBadge({ status }: { status: Status }) {
   return (
      <Badge tone={STATUS_TOM[status]} size="sm" dot title={STATUS_DICA[status]}>
         {STATUS_LABEL[status]}
      </Badge>
   );
}

/** Urgência: o que a pessoa precisa saber primeiro (atrasado, vence logo...). */
export function UrgenciaBadge({ urgencia, dias }: { urgencia: Urgencia; dias?: number | null }) {
   let texto = URGENCIA_LABEL[urgencia];
   if ((urgencia === "atrasado" || urgencia === "esta-semana" || urgencia === "proximo") && dias !== null && dias !== undefined) {
      texto = urgencia === "atrasado" ? `Atrasado (venceu ${distanciaEmDias(dias)})` : `Vence ${distanciaEmDias(dias)}`;
   }
   return (
      <Badge tone={URGENCIA_TOM[urgencia]} size="sm" dot>
         {texto}
      </Badge>
   );
}

export function DependenciaTag({ dependencia }: { dependencia: Dependencia }) {
   if (dependencia !== "trava") return null;
   return (
      <Tooltip>
         <TooltipTrigger asChild>
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-muted-foreground">
               <Lock className="size-3" aria-hidden />
               {DEPENDENCIA_LABEL[dependencia]}
            </span>
         </TooltipTrigger>
         <TooltipContent>{DEPENDENCIA_DICA[dependencia]}</TooltipContent>
      </Tooltip>
   );
}

export function PrazoPropostoTag() {
   return (
      <Tooltip>
         <TooltipTrigger asChild>
            <span className="inline-flex items-center gap-1 rounded-full border border-dashed border-warning/60 px-1.5 py-px text-[10.5px] font-medium text-warning-foreground">
               <CalendarClock className="size-3" aria-hidden />
               prazo a confirmar
            </span>
         </TooltipTrigger>
         <TooltipContent>Prazo sugerido a partir das regras do calendário. Confirme com o setor antes de assumir.</TooltipContent>
      </Tooltip>
   );
}

export function SetorChip({ id }: { id: string }) {
   const setor = getSetor(id);
   const nome = setor?.nome ?? id;
   const indefinido = id === "a-definir";
   const chip = (
      <span
         className={
            indefinido
               ? "inline-flex items-center rounded-full border border-dashed border-warning/60 px-2 py-0.5 text-[11px] font-medium text-warning-foreground"
               : "inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground"
         }
      >
         {nome}
      </span>
   );
   if (!setor?.descricao) return chip;
   return (
      <Tooltip>
         <TooltipTrigger asChild>{chip}</TooltipTrigger>
         <TooltipContent>{setor.descricao}</TooltipContent>
      </Tooltip>
   );
}

export function Setores({ processo }: { processo: Pick<Processo, "responsaveis"> }) {
   return (
      <span className="flex flex-wrap gap-1">
         {processo.responsaveis.map(r => (
            <SetorChip key={r} id={r} />
         ))}
      </span>
   );
}
