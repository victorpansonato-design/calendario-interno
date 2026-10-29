import { FlaskConical, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { dataPorExtenso } from "@/features/calendario/lib/datas";
import { usePreferenciasStore } from "@/features/calendario/stores/preferencias.store";

/** Aviso fixo enquanto alguém está testando o calendário "como se hoje fosse" outra data. */
export function BannerDataSimulada() {
   const dataSimulada = usePreferenciasStore(s => s.dataSimulada);
   const setDataSimulada = usePreferenciasStore(s => s.setDataSimulada);
   if (!dataSimulada) return null;
   return (
      <div
         role="status"
         className="flex items-center gap-2 border-b border-warning/40 bg-warning-soft px-5 py-1.5 text-xs text-warning-foreground"
      >
         <FlaskConical className="size-3.5 shrink-0" aria-hidden />
         <span className="min-w-0 flex-1 truncate">
            Simulação: o calendário está calculando prazos como se hoje fosse{" "}
            <strong className="first-letter:uppercase">{dataPorExtenso(dataSimulada)}</strong>.
         </span>
         <Button variant="ghost" size="sm" className="h-6 px-2 text-xs" onClick={() => setDataSimulada(null)}>
            <X className="size-3" />
            Voltar para hoje
         </Button>
      </div>
   );
}
