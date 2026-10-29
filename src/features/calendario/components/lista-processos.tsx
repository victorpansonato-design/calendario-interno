import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { motion } from "motion/react";

import { ProcessoLinha } from "@/features/calendario/components/processo-linha";
import { BLOCOS, nomeSetor, SETORES } from "@/features/calendario/data/catalogo";
import { paraData } from "@/features/calendario/lib/datas";
import type { Processo } from "@/features/calendario/types/calendario.schema";
import { staggerContainer, staggerItem } from "@/lib/motion";

export type Agrupamento = "mes" | "etapa" | "setor";

interface Grupo {
   chave: string;
   titulo: string;
   itens: Processo[];
}

function agrupar(processos: Processo[], por: Agrupamento): Grupo[] {
   const mapa = new Map<string, Grupo>();
   const add = (chave: string, titulo: string, p: Processo) => {
      const g = mapa.get(chave) ?? { chave, titulo, itens: [] };
      g.itens.push(p);
      mapa.set(chave, g);
   };

   for (const p of processos) {
      if (por === "mes") {
         if (p.prazoTipo === "data" && p.prazo) {
            const chave = p.prazo.slice(0, 7);
            add(chave, format(paraData(p.prazo), "MMMM 'de' yyyy", { locale: ptBR }), p);
         } else if (p.prazoTipo === "continuo") add("zz-continuo", "Rotinas do semestre todo", p);
         else add("zy-sem-data", "Sem data definida", p);
      } else if (por === "etapa") {
         add(p.bloco, BLOCOS.find(b => b.id === p.bloco)?.nome ?? p.bloco, p);
      } else {
         for (const r of p.responsaveis) add(r, nomeSetor(r), p);
      }
   }

   const grupos = [...mapa.values()];
   if (por === "mes") return grupos.sort((a, b) => a.chave.localeCompare(b.chave));
   if (por === "etapa") return grupos.sort((a, b) => BLOCOS.findIndex(x => x.id === a.chave) - BLOCOS.findIndex(x => x.id === b.chave));
   return grupos.sort((a, b) => SETORES.findIndex(x => x.id === a.chave) - SETORES.findIndex(x => x.id === b.chave));
}

interface ListaProcessosProps {
   processos: Processo[];
   agrupamento: Agrupamento;
   onAbrir: (id: string) => void;
}

export function ListaProcessos({ processos, agrupamento, onAbrir }: ListaProcessosProps) {
   const grupos = agrupar(processos, agrupamento);

   return (
      <motion.div variants={staggerContainer} initial="initial" animate="animate" className="grid gap-6">
         {grupos.map(grupo => (
            <motion.section key={grupo.chave} variants={staggerItem} aria-labelledby={`grupo-${grupo.chave}`}>
               <header className="mb-2 flex items-baseline justify-between gap-3 px-1">
                  <h3 id={`grupo-${grupo.chave}`} className="font-display text-[15px] font-medium first-letter:uppercase">
                     {grupo.titulo}
                  </h3>
                  <span className="text-xs text-muted-foreground tabular">
                     {grupo.itens.length} {grupo.itens.length === 1 ? "processo" : "processos"}
                  </span>
               </header>
               <div className="divide-y overflow-hidden rounded-xl border bg-card shadow-sm">
                  {grupo.itens.map(p => (
                     <ProcessoLinha key={`${grupo.chave}-${p.id}`} processo={p} onAbrir={onAbrir} ocultarEtapa={agrupamento === "etapa"} />
                  ))}
               </div>
            </motion.section>
         ))}
      </motion.div>
   );
}
