/**
 * Calendário do mês: quantos prazos vencem em cada dia, quais dias caem em
 * evento acadêmico ou feriado e, ao clicar, a lista do dia ao lado.
 */
import { addMonths, eachDayOfInterval, endOfMonth, endOfWeek, isSameMonth, startOfMonth, startOfWeek } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { ProcessoLinha } from "@/features/calendario/components/processo-linha";
import { FERIADOS_2027 } from "@/features/calendario/data/catalogo";
import { dataPorExtenso, mesAno, paraData, paraIso } from "@/features/calendario/lib/datas";
import type { Evento, Processo, Urgencia } from "@/features/calendario/types/calendario.schema";
import { emphasis, press } from "@/lib/motion";
import { cn } from "@/lib/utils";

const SEMANA = ["seg", "ter", "qua", "qui", "sex", "sáb", "dom"];

const COR_PONTO: Partial<Record<Urgencia, string>> = {
   atrasado: "bg-destructive",
   bloqueado: "bg-destructive",
   "esta-semana": "bg-warning",
   proximo: "bg-primary",
   "no-prazo": "bg-muted-foreground/60",
   concluido: "bg-success",
};

interface CalendarioMensalProps {
   processos: Processo[];
   eventos: Evento[];
   hoje: string;
   onAbrir: (id: string) => void;
}

export function CalendarioMensal({ processos, eventos, hoje, onAbrir }: CalendarioMensalProps) {
   const primeiroPrazo = processos.find(p => p.prazoTipo === "data" && p.prazo)?.prazo;
   const inicial = startOfMonth(paraData(hoje < (primeiroPrazo ?? hoje) ? (primeiroPrazo ?? hoje) : hoje));
   const [mes, setMes] = useState(inicial);
   const [direcao, setDirecao] = useState(1);
   const [diaSelecionado, setDiaSelecionado] = useState<string | null>(null);

   const porDia = useMemo(() => {
      const mapa = new Map<string, Processo[]>();
      for (const p of processos) {
         if (p.prazoTipo !== "data" || !p.prazo) continue;
         mapa.set(p.prazo, [...(mapa.get(p.prazo) ?? []), p]);
      }
      return mapa;
   }, [processos]);

   const eventosPorDia = useMemo(() => {
      const mapa = new Map<string, Evento[]>();
      for (const e of eventos) {
         for (const d of eachDayOfInterval({ start: paraData(e.inicio), end: paraData(e.fim ?? e.inicio) })) {
            const iso = paraIso(d);
            mapa.set(iso, [...(mapa.get(iso) ?? []), e]);
         }
      }
      return mapa;
   }, [eventos]);

   const feriados = useMemo(() => new Map(FERIADOS_2027.map(f => [f.data, f.nome])), []);

   const dias = eachDayOfInterval({
      start: startOfWeek(startOfMonth(mes), { weekStartsOn: 1 }),
      end: endOfWeek(endOfMonth(mes), { weekStartsOn: 1 }),
   });

   function mudarMes(delta: number) {
      setDirecao(delta);
      setMes(m => addMonths(m, delta));
      setDiaSelecionado(null);
   }

   const selecionados = diaSelecionado ? (porDia.get(diaSelecionado) ?? []) : [];
   const eventosDoDia = diaSelecionado ? (eventosPorDia.get(diaSelecionado) ?? []) : [];

   return (
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
         <div className="rounded-xl border bg-card p-4 shadow-sm sm:p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
               <h2 className="font-display text-[17px] font-medium first-letter:uppercase">{mesAno(mes)}</h2>
               <div className="flex items-center gap-1">
                  <Button variant="outline" size="sm" onClick={() => mudarMes(-1)} aria-label="Mês anterior">
                     <ChevronLeft className="size-4" />
                  </Button>
                  <Button
                     variant="ghost"
                     size="sm"
                     onClick={() => {
                        setDirecao(paraData(hoje) > mes ? 1 : -1);
                        setMes(startOfMonth(paraData(hoje)));
                     }}
                  >
                     Hoje
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => mudarMes(1)} aria-label="Próximo mês">
                     <ChevronRight className="size-4" />
                  </Button>
               </div>
            </div>

            <div className="grid grid-cols-7 gap-1 pb-1 text-center text-[10px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
               {SEMANA.map(d => (
                  <span key={d}>{d}</span>
               ))}
            </div>

            <AnimatePresence mode="wait" initial={false} custom={direcao}>
               <motion.div
                  key={paraIso(mes)}
                  custom={direcao}
                  initial={{ opacity: 0, x: direcao * 16 }}
                  animate={{ opacity: 1, x: 0, transition: { duration: 0.24, ease: emphasis } }}
                  exit={{ opacity: 0, x: direcao * -12, transition: { duration: 0.12 } }}
                  className="grid grid-cols-7 gap-1"
               >
                  {dias.map(d => {
                     const iso = paraIso(d);
                     const doMes = isSameMonth(d, mes);
                     const itens = porDia.get(iso) ?? [];
                     const temEvento = eventosPorDia.has(iso);
                     const feriado = feriados.get(iso);
                     const selecionado = diaSelecionado === iso;
                     const ehHoje = iso === hoje;
                     const fimDeSemana = d.getDay() === 0 || d.getDay() === 6;
                     return (
                        <motion.button
                           key={iso}
                           type="button"
                           whileTap={press}
                           onClick={() => setDiaSelecionado(iso)}
                           aria-label={`${dataPorExtenso(iso)}: ${itens.length} prazos${feriado ? `, feriado (${feriado})` : ""}`}
                           aria-pressed={selecionado}
                           className={cn(
                              "relative flex min-h-[74px] flex-col items-start rounded-lg border p-1.5 text-left transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                              doMes ? "bg-background" : "bg-transparent opacity-40",
                              fimDeSemana && doMes && "bg-muted/40",
                              selecionado ? "border-primary ring-1 ring-primary" : "border-border/70 hover:border-border-strong",
                           )}
                        >
                           <span className="flex w-full items-center justify-between">
                              <span
                                 className={cn(
                                    "grid size-6 place-items-center rounded-full font-mono text-[12px] tabular",
                                    ehHoje
                                       ? "bg-primary font-semibold text-primary-foreground"
                                       : feriado
                                         ? "text-destructive"
                                         : "text-foreground",
                                 )}
                              >
                                 {d.getDate()}
                              </span>
                              {itens.length ? (
                                 <span className="font-mono text-[11px] font-medium tabular text-muted-foreground">{itens.length}</span>
                              ) : null}
                           </span>
                           {temEvento ? (
                              <span className="mt-1 h-1 w-full rounded-full bg-accent" title="Evento do calendário acadêmico" />
                           ) : null}
                           {feriado ? <span className="mt-1 truncate text-[9.5px] leading-tight text-destructive">{feriado}</span> : null}
                           <span className="mt-auto flex flex-wrap gap-0.5 pt-1">
                              {itens.slice(0, 6).map(p => (
                                 <span
                                    key={p.id}
                                    className={cn("size-1.5 rounded-full", COR_PONTO[p.urgencia] ?? "bg-muted-foreground/40")}
                                 />
                              ))}
                              {itens.length > 6 ? (
                                 <span className="text-[9px] leading-none text-muted-foreground">+{itens.length - 6}</span>
                              ) : null}
                           </span>
                        </motion.button>
                     );
                  })}
               </motion.div>
            </AnimatePresence>
         </div>

         <aside className="rounded-xl border bg-card shadow-sm" aria-live="polite">
            {diaSelecionado ? (
               <div>
                  <div className="border-b p-4">
                     <p className="text-[11px] font-semibold uppercase tracking-[0.06em] text-muted-foreground">Dia selecionado</p>
                     <p className="mt-1 font-display text-[15px] font-medium first-letter:uppercase">{dataPorExtenso(diaSelecionado)}</p>
                     {feriados.get(diaSelecionado) ? (
                        <p className="mt-1 text-xs text-destructive">Feriado: {feriados.get(diaSelecionado)}</p>
                     ) : null}
                  </div>
                  {eventosDoDia.length ? (
                     <div className="grid gap-1.5 border-b p-4">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.06em] text-muted-foreground">Acontecendo neste dia</p>
                        {eventosDoDia.map(e => (
                           <p key={e.id} className="flex items-start gap-2 text-[13px]">
                              <span
                                 className={cn(
                                    "mt-1.5 size-2 shrink-0 rounded-full",
                                    e.tipo === "rematricula" ? "bg-primary" : "bg-accent",
                                 )}
                              />
                              {e.nome}
                           </p>
                        ))}
                     </div>
                  ) : null}
                  {selecionados.length ? (
                     <div className="divide-y">
                        {selecionados.map(p => (
                           <ProcessoLinha key={p.id} processo={p} onAbrir={onAbrir} />
                        ))}
                     </div>
                  ) : (
                     <p className="p-4 text-sm text-muted-foreground">Nenhum prazo neste dia.</p>
                  )}
               </div>
            ) : (
               <div className="p-6 text-sm text-muted-foreground">
                  <p className="font-display text-[15px] font-medium text-foreground">Escolha um dia</p>
                  <p className="mt-1">
                     Clique em um dia do calendário para ver o que vence nele e o que está acontecendo no calendário acadêmico.
                  </p>
                  <div className="mt-4 grid gap-2 text-xs">
                     <span className="flex items-center gap-2">
                        <span className="h-1 w-6 rounded-full bg-accent" /> Dia com evento acadêmico ou rematrícula
                     </span>
                     <span className="flex items-center gap-2">
                        <span className="font-mono text-destructive">21</span> Feriado
                     </span>
                     <span className="flex items-center gap-2">
                        <span className="size-1.5 rounded-full bg-primary" /> Cada ponto é um prazo (a cor mostra a situação)
                     </span>
                  </div>
               </div>
            )}
         </aside>
      </div>
   );
}
