/**
 * Um cartão por setor: quanto já foi feito, o que está atrasado e o próximo prazo.
 * Serve para quem coordena enxergar todas as áreas de uma vez.
 */
import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { getSetor, SETORES } from "@/features/calendario/data/catalogo";
import { useCalendario } from "@/features/calendario/hooks/use-calendario";
import { useProcessoAberto } from "@/features/calendario/hooks/use-processo-aberto";
import { dataCurta, distanciaEmDias } from "@/features/calendario/lib/datas";
import { doSetor, resumir } from "@/features/calendario/lib/prazo";
import { usePreferenciasStore } from "@/features/calendario/stores/preferencias.store";
import { emphasis, staggerContainer, staggerItem } from "@/lib/motion";
import { cn } from "@/lib/utils";

export function VisaoSetores() {
   const { visao } = useCalendario();
   const { abrir } = useProcessoAberto();
   const navigate = useNavigate();
   const meuSetor = usePreferenciasStore(s => s.meuSetor);
   const setMeuSetor = usePreferenciasStore(s => s.setMeuSetor);

   if (!visao) return null;

   const cartoes = SETORES.map(s => {
      const itens = doSetor(visao.processos, s.id);
      return {
         setor: s,
         itens,
         resumo: resumir(itens),
         proximo: itens.find(p => p.diasParaPrazo !== null && p.diasParaPrazo >= 0 && p.status !== "concluido"),
      };
   }).filter(c => c.itens.length > 0);

   return (
      <motion.div variants={staggerContainer} initial="initial" animate="animate" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
         {cartoes.map(({ setor, resumo, proximo }) => {
            const descricao = getSetor(setor.id)?.descricao;
            return (
               <motion.article
                  key={setor.id}
                  variants={staggerItem}
                  className={cn(
                     "flex flex-col gap-4 rounded-xl border bg-card p-5 shadow-sm",
                     meuSetor === setor.id && "ring-2 ring-primary/40",
                  )}
               >
                  <header className="flex items-start justify-between gap-3">
                     <div className="min-w-0">
                        <h3 className="font-display text-[15px] font-medium">{setor.nome}</h3>
                        {descricao ? <p className="mt-0.5 truncate text-xs text-muted-foreground">{descricao}</p> : null}
                     </div>
                     <span className="shrink-0 whitespace-nowrap font-mono text-xs tabular text-muted-foreground">
                        {resumo.total} processos
                     </span>
                  </header>

                  <div>
                     <div className="mb-1.5 flex justify-between text-xs text-muted-foreground">
                        <span>Concluído</span>
                        <span className="tabular">{resumo.percentualConcluido}%</span>
                     </div>
                     <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                        <motion.div
                           className="h-full rounded-full bg-primary"
                           initial={{ width: 0 }}
                           animate={{ width: `${resumo.percentualConcluido}%` }}
                           transition={{ duration: 0.75, ease: emphasis }}
                        />
                     </div>
                  </div>

                  <dl className="grid grid-cols-3 gap-2 text-center">
                     <div className="rounded-lg bg-surface py-2">
                        <dt className="text-[10.5px] text-muted-foreground">Atrasados</dt>
                        <dd className={cn("font-display text-lg tabular", resumo.atrasados ? "text-destructive" : "text-foreground")}>
                           {resumo.atrasados}
                        </dd>
                     </div>
                     <div className="rounded-lg bg-surface py-2">
                        <dt className="text-[10.5px] text-muted-foreground">Em 7 dias</dt>
                        <dd
                           className={cn("font-display text-lg tabular", resumo.estaSemana ? "text-warning-foreground" : "text-foreground")}
                        >
                           {resumo.estaSemana}
                        </dd>
                     </div>
                     <div className="rounded-lg bg-surface py-2">
                        <dt className="text-[10.5px] text-muted-foreground">Sem data</dt>
                        <dd className="font-display text-lg tabular">{resumo.semData}</dd>
                     </div>
                  </dl>

                  {proximo ? (
                     <button
                        type="button"
                        onClick={() => abrir(proximo.id)}
                        className="rounded-lg border border-dashed px-3 py-2 text-left transition-colors hover:bg-muted/50"
                     >
                        <span className="block text-[10.5px] font-semibold uppercase tracking-[0.06em] text-muted-foreground">
                           Próximo prazo · {dataCurta(proximo.prazo)} ({distanciaEmDias(proximo.diasParaPrazo ?? 0)})
                        </span>
                        <span className="mt-0.5 line-clamp-2 block text-[13px]">
                           <span className="font-mono text-primary">{proximo.id}</span> {proximo.nome}
                        </span>
                     </button>
                  ) : (
                     <p className="rounded-lg border border-dashed px-3 py-2 text-xs text-muted-foreground">
                        Sem prazos futuros pendentes.
                     </p>
                  )}

                  <footer className="mt-auto flex flex-wrap gap-2">
                     <Button size="sm" variant="outline" onClick={() => navigate(`/processos?setor=${setor.id}`)}>
                        Ver processos
                     </Button>
                     {!setor.especial && meuSetor !== setor.id ? (
                        <Button size="sm" variant="ghost" onClick={() => setMeuSetor(setor.id)}>
                           Este é meu setor
                        </Button>
                     ) : null}
                  </footer>
               </motion.article>
            );
         })}
      </motion.div>
   );
}
