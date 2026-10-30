import { diasEntre } from "@/features/calendario/lib/datas";
import type { Processo } from "@/features/calendario/types/calendario.schema";

/** Agrupa alvos que colidiriam na escala atual; não cria intervalos nem altera datas. */
export function agruparMarcos(processos: Processo[], inicio: string, pxDia: number) {
   const grupos: { x: number; itens: Processo[] }[] = [];
   for (const processo of [...processos].sort((a, b) => (a.prazo ?? "").localeCompare(b.prazo ?? ""))) {
      if (processo.prazoTipo !== "data" || !processo.prazo) continue;
      const x = Math.max(22, diasEntre(inicio, processo.prazo) * pxDia + pxDia / 2);
      const anterior = grupos.at(-1);
      if (anterior && x - anterior.x < 48) anterior.itens.push(processo);
      else grupos.push({ x, itens: [processo] });
   }
   return grupos;
}
