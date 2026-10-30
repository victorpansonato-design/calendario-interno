/** Calendário de datas locais, com agenda diária no desktop e no celular. */
import { addDays, addMonths, eachDayOfInterval, endOfMonth, endOfWeek, isSameMonth, isValid, startOfMonth, startOfWeek } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { ProcessoLinha } from "@/features/calendario/components/processo-linha";
import { FERIADOS_2027 } from "@/features/calendario/data/catalogo";
import { dataPorExtenso, mesAno, paraData, paraIso } from "@/features/calendario/lib/datas";
import type { Evento, Processo } from "@/features/calendario/types/calendario.schema";
import { cn } from "@/lib/utils";

const SEMANA = ["seg", "ter", "qua", "qui", "sex", "sáb", "dom"];
function diaValido(valor: string | null): valor is string {
   return !!valor && /^\d{4}-\d{2}-\d{2}$/.test(valor) && isValid(paraData(valor));
}

interface CalendarioMensalProps {
   processos: Processo[];
   eventos: Evento[];
   hoje: string;
   onAbrir: (id: string) => void;
}

export function CalendarioMensal({ processos, eventos, hoje, onAbrir }: CalendarioMensalProps) {
   const [params, setParams] = useSearchParams();
   const primeiroPrazo = processos.find(p => p.prazoTipo === "data" && p.prazo)?.prazo;
   const [inicial] = useState(() => (hoje < (primeiroPrazo ?? hoje) ? primeiroPrazo! : hoje));
   const mesParam = `${params.get("mes")}-01`;
   const mes = startOfMonth(paraData(diaValido(mesParam) ? mesParam : inicial));
   const diaParam = params.get("dia");
   const diaSelecionado = diaValido(diaParam) ? diaParam : isSameMonth(paraData(inicial), mes) ? inicial : paraIso(mes);
   const grade = useRef<HTMLDivElement>(null);
   const porDia = useMemo(() => {
      const mapa = new Map<string, Processo[]>();
      for (const p of processos) {
         if (p.prazoTipo !== "data" || !p.prazo) continue;
         const itens = mapa.get(p.prazo) ?? [];
         itens.push(p);
         mapa.set(p.prazo, itens);
      }
      return mapa;
   }, [processos]);
   const eventosPorDia = useMemo(() => {
      const mapa = new Map<string, Evento[]>();
      for (const e of eventos) {
         for (const d of eachDayOfInterval({ start: paraData(e.inicio), end: paraData(e.fim ?? e.inicio) })) {
            const iso = paraIso(d);
            const itens = mapa.get(iso) ?? [];
            itens.push(e);
            mapa.set(iso, itens);
         }
      }
      return mapa;
   }, [eventos]);
   const feriados = useMemo(() => new Map(FERIADOS_2027.map(f => [f.data, f.nome])), []);
   const dias = eachDayOfInterval({ start: startOfWeek(mes, { weekStartsOn: 1 }), end: endOfWeek(endOfMonth(mes), { weekStartsOn: 1 }) });

   function selecionar(iso: string, focar = false) {
      setParams(prev => {
         const next = new URLSearchParams(prev);
         next.set("mes", iso.slice(0, 7));
         next.set("dia", iso);
         return next;
      });
      if (focar) requestAnimationFrame(() => grade.current?.querySelector<HTMLButtonElement>(`[data-dia="${iso}"]`)?.focus());
   }
   const selecionados = porDia.get(diaSelecionado) ?? [];
   const eventosDoDia = eventosPorDia.get(diaSelecionado) ?? [];
   const prazosDoMes = processos.filter(p => p.prazoTipo === "data" && p.prazo?.slice(0, 7) === paraIso(mes).slice(0, 7)).length;

   return (
      <div className="grid min-w-0 items-start gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(340px,0.8fr)]">
         <section className="min-w-0 rounded-xl border bg-card p-2 sm:p-4" aria-label="Calendário mensal">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3 p-1">
               <div>
                  <h2 id="mes-calendario" className="text-base font-semibold first-letter:uppercase">
                     {mesAno(mes)}
                  </h2>
                  <p className="mt-1 text-xs text-muted-foreground tabular-nums">{prazosDoMes} prazos com os filtros atuais</p>
               </div>
               <div className="flex items-center gap-1">
                  <Button
                     variant="outline"
                     size="icon"
                     className="size-11"
                     onClick={() => selecionar(paraIso(startOfMonth(addMonths(mes, -1))))}
                     aria-label="Mês anterior"
                  >
                     <ChevronLeft aria-hidden />
                  </Button>
                  <Button variant="ghost" className="min-h-11" onClick={() => selecionar(hoje)}>
                     Hoje
                  </Button>
                  <Button
                     variant="outline"
                     size="icon"
                     className="size-11"
                     onClick={() => selecionar(paraIso(startOfMonth(addMonths(mes, 1))))}
                     aria-label="Próximo mês"
                  >
                     <ChevronRight aria-hidden />
                  </Button>
               </div>
            </div>
            <label className="mb-4 flex flex-wrap items-center gap-2 px-1 text-xs text-muted-foreground">
               Ir para o mês
               <input
                  type="month"
                  aria-label="Ir para o mês"
                  value={paraIso(mes).slice(0, 7)}
                  onChange={e => {
                     if (diaValido(`${e.target.value}-01`)) selecionar(`${e.target.value}-01`);
                  }}
                  className="h-10 min-w-0 rounded-md border bg-background px-3 text-sm text-foreground"
               />
            </label>
            <Button
               variant="secondary"
               size="sm"
               className="mb-3 w-full xl:hidden"
               onClick={() => {
                  const agenda = document.getElementById("agenda-dia");
                  agenda?.focus({ preventScroll: true });
                  agenda?.scrollIntoView({ block: "start", behavior: "instant" });
               }}
            >
               Ver agenda do dia · {selecionados.length} prazos
            </Button>
            <div className="mb-2 grid grid-cols-7 text-center text-xs font-medium text-muted-foreground" aria-hidden>
               {SEMANA.map(d => (
                  <span key={d}>{d}</span>
               ))}
            </div>
            <div
               ref={grade}
               className="grid grid-cols-7 gap-0.5 sm:gap-1"
               role="group"
               aria-labelledby="mes-calendario"
               aria-describedby="ajuda-calendario"
            >
               {dias.map(d => {
                  const iso = paraIso(d);
                  const itens = porDia.get(iso) ?? [];
                  const ev = eventosPorDia.get(iso) ?? [];
                  const feriado = feriados.get(iso);
                  const selecionado = diaSelecionado === iso;
                  return (
                     <button
                        key={iso}
                        type="button"
                        data-dia={iso}
                        tabIndex={selecionado ? 0 : -1}
                        onClick={() => selecionar(iso)}
                        aria-pressed={selecionado}
                        aria-current={iso === hoje ? "date" : undefined}
                        aria-label={`${dataPorExtenso(iso)}: ${itens.length} prazos, ${ev.length} eventos${feriado ? `, feriado: ${feriado}` : ""}${iso === hoje ? ", hoje" : ""}`}
                        onKeyDown={e => {
                           const deltas: Record<string, number> = { ArrowRight: 1, ArrowLeft: -1, ArrowDown: 7, ArrowUp: -7 };
                           let alvo: Date | null = null;
                           if (e.key in deltas) alvo = addDays(d, deltas[e.key]);
                           if (e.key === "Home") alvo = startOfWeek(d, { weekStartsOn: 1 });
                           if (e.key === "End") alvo = endOfWeek(d, { weekStartsOn: 1 });
                           if (e.key === "PageUp" || e.key === "PageDown") alvo = addMonths(d, e.key === "PageUp" ? -1 : 1);
                           if (alvo) {
                              e.preventDefault();
                              selecionar(paraIso(alvo), true);
                           }
                        }}
                        className={cn(
                           "flex min-h-14 min-w-0 flex-col items-center gap-1 rounded-md border border-transparent p-1 text-center text-xs transition-colors sm:min-h-20 sm:items-start sm:p-2",
                           !isSameMonth(d, mes) && "text-muted-foreground",
                           isSameMonth(d, mes) && "bg-muted/40",
                           selecionado ? "border-primary bg-primary-soft text-foreground ring-1 ring-primary" : "hover:bg-muted",
                           feriado && "text-destructive",
                        )}
                     >
                        <span
                           className={cn(
                              "inline-flex size-6 items-center justify-center rounded-full text-xs font-medium tabular-nums",
                              iso === hoje && "bg-primary text-primary-foreground",
                           )}
                        >
                           {d.getDate()}
                        </span>
                        {itens.length ? (
                           <span className="max-w-full rounded bg-secondary px-1 text-[10px] font-medium text-secondary-foreground tabular-nums">
                              {itens.length}
                              <span className="hidden lg:inline"> prazos</span>
                           </span>
                        ) : null}
                        {ev.length ? <span className="h-1 w-5 shrink-0 rounded-full bg-accent" aria-hidden /> : null}
                        {feriado ? (
                           <span className="hidden w-full truncate text-[10px] sm:block" title={feriado}>
                              {feriado}
                           </span>
                        ) : null}
                     </button>
                  );
               })}
            </div>
            <p id="ajuda-calendario" className="mt-3 px-1 text-xs leading-relaxed text-muted-foreground">
               Selecione um dia para consultar a agenda. Use as setas para navegar por teclado. A faixa amarela indica eventos acadêmicos ou
               rematrícula.
            </p>
         </section>
         <section className="min-w-0 overflow-hidden rounded-xl border bg-card" aria-labelledby="agenda-dia">
            <header className="border-b p-4">
               <h2 id="agenda-dia" tabIndex={-1} className="scroll-mt-40 text-base font-semibold">
                  Agenda do dia
               </h2>
               <p className="mt-1 text-sm first-letter:uppercase">{dataPorExtenso(diaSelecionado)}</p>
               <p role="status" className="mt-2 text-xs text-muted-foreground tabular-nums">
                  {selecionados.length} prazos · {eventosDoDia.length} eventos
               </p>
               {feriados.has(diaSelecionado) ? (
                  <p className="mt-2 text-xs text-destructive">Feriado: {feriados.get(diaSelecionado)}</p>
               ) : null}
            </header>
            {eventosDoDia.length ? (
               <div className="grid gap-2 border-b p-4">
                  <h3 className="text-xs font-semibold text-muted-foreground">Acontecendo neste dia</h3>
                  {eventosDoDia.map(e => (
                     <p key={e.id} className="flex items-start gap-2 text-sm leading-relaxed">
                        <span
                           aria-hidden
                           className={cn("mt-1.5 size-2 shrink-0 rounded-full", e.tipo === "rematricula" ? "bg-primary" : "bg-accent")}
                        />
                        <span>{e.nome}</span>
                     </p>
                  ))}
               </div>
            ) : null}
            {selecionados.length ? (
               <div className="divide-y">
                  {selecionados.map(p => (
                     <ProcessoLinha key={p.id} processo={p} onAbrir={onAbrir} compacto />
                  ))}
               </div>
            ) : (
               <div className="grid gap-2 p-4">
                  <p className="text-sm text-muted-foreground">Nenhum prazo neste dia com os filtros atuais.</p>
                  {primeiroPrazo ? (
                     <Button variant="outline" size="sm" className="w-fit" onClick={() => selecionar(primeiroPrazo)}>
                        Ver o primeiro prazo da consulta
                     </Button>
                  ) : (
                     <p className="text-xs text-muted-foreground">Experimente remover um filtro ou consultar outro dia.</p>
                  )}
               </div>
            )}
         </section>
      </div>
   );
}
