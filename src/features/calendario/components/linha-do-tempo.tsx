/**
 * Linha do tempo por setor: cada linha é um setor, cada ponto um prazo.
 * A faixa de cima mostra os eventos do calendário acadêmico e as janelas de
 * rematrícula, para enxergar o que cada entrega está sustentando.
 */
import { addDays, addMonths, startOfMonth } from "date-fns";
import { motion } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";

import { Segmented } from "@/components/core/segmented";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { nomeSetor, SETORES, URGENCIA_LABEL } from "@/features/calendario/data/catalogo";
import { usePreferenciasStore } from "@/features/calendario/stores/preferencias.store";
import { dataCurta, diasEntre, intervalo, mesAbreviado, paraData, paraIso } from "@/features/calendario/lib/datas";
import type { Evento, Processo, Urgencia } from "@/features/calendario/types/calendario.schema";
import { cn } from "@/lib/utils";

const LARGURA_ROTULO = 196;
const ALTURA_LINHA = 36;
const ALTURA_EVENTO = 16;

type Zoom = "compacto" | "normal" | "detalhado";
const PX_POR_DIA: Record<Zoom, number> = { compacto: 4, normal: 7, detalhado: 12 };

const COR_MARCADOR: Record<Urgencia, string> = {
   atrasado: "bg-destructive",
   bloqueado: "bg-card ring-2 ring-destructive ring-inset",
   "esta-semana": "bg-warning",
   proximo: "bg-primary",
   "no-prazo": "bg-muted-foreground/70",
   concluido: "bg-success",
   continuo: "bg-muted-foreground/40",
   "sem-data": "bg-muted-foreground/40",
};

const LEGENDA_LINHA_DO_TEMPO: { urgencia: Urgencia; classe: string }[] = [
   { urgencia: "atrasado", classe: COR_MARCADOR.atrasado },
   { urgencia: "esta-semana", classe: COR_MARCADOR["esta-semana"] },
   { urgencia: "proximo", classe: COR_MARCADOR.proximo },
   { urgencia: "no-prazo", classe: COR_MARCADOR["no-prazo"] },
   { urgencia: "concluido", classe: COR_MARCADOR.concluido },
   { urgencia: "bloqueado", classe: COR_MARCADOR.bloqueado },
];

interface LinhaDoTempoProps {
   processos: Processo[];
   eventos: Evento[];
   hoje: string;
   onAbrir: (id: string) => void;
}

/** Distribui eventos que se sobrepõem em faixas diferentes. */
function empilhar(eventos: Evento[]) {
   const ordenados = [...eventos].sort((a, b) => a.inicio.localeCompare(b.inicio));
   const fimDaFaixa: string[] = [];
   return ordenados.map(evento => {
      const fim = evento.fim ?? evento.inicio;
      let faixa = fimDaFaixa.findIndex(f => f < evento.inicio);
      if (faixa === -1) {
         faixa = fimDaFaixa.length;
         fimDaFaixa.push(fim);
      } else fimDaFaixa[faixa] = fim;
      return { evento, faixa };
   });
}

export function LinhaDoTempo({ processos, eventos, hoje, onAbrir }: LinhaDoTempoProps) {
   const [zoom, setZoom] = useState<Zoom>("normal");
   const meuSetor = usePreferenciasStore(s => s.meuSetor);
   const rolagem = useRef<HTMLDivElement>(null);
   const pxDia = PX_POR_DIA[zoom];

   const comData = useMemo(() => processos.filter(p => p.prazoTipo === "data" && p.prazo), [processos]);

   const { inicio, totalDias, meses } = useMemo(() => {
      const datas = [...comData.map(p => p.prazo as string), ...eventos.flatMap(e => [e.inicio, e.fim ?? e.inicio])].sort();
      const primeiro = startOfMonth(paraData(datas[0] ?? hoje));
      const ultimo = addMonths(startOfMonth(paraData(datas[datas.length - 1] ?? hoje)), 1);
      const lista: { rotulo: string; deslocamento: number; largura: number }[] = [];
      for (let m = primeiro; m < ultimo; m = addMonths(m, 1)) {
         const prox = addMonths(m, 1);
         lista.push({
            rotulo: mesAbreviado(m),
            deslocamento: diasEntre(paraIso(primeiro), paraIso(m)),
            largura: diasEntre(paraIso(m), paraIso(prox)),
         });
      }
      return { inicio: paraIso(primeiro), totalDias: diasEntre(paraIso(primeiro), paraIso(ultimo)), meses: lista };
   }, [comData, eventos, hoje]);

   const x = (iso: string) => diasEntre(inicio, iso) * pxDia;
   const largura = totalDias * pxDia;
   const hojeVisivel = diasEntre(inicio, hoje) >= 0 && diasEntre(inicio, hoje) <= totalDias;

   const faixas = useMemo(() => empilhar(eventos), [eventos]);
   const alturaEventos = (Math.max(0, ...faixas.map(f => f.faixa)) + 1) * (ALTURA_EVENTO + 4) + 10;

   const linhas = useMemo(() => {
      const porSetor = new Map<string, Processo[]>();
      for (const p of comData) for (const r of p.responsaveis) porSetor.set(r, [...(porSetor.get(r) ?? []), p]);
      return SETORES.filter(s => porSetor.has(s.id)).map(s => ({ setor: s.id, itens: porSetor.get(s.id) ?? [] }));
   }, [comData]);

   // Ao abrir, posiciona a rolagem perto de hoje (ou do primeiro prazo).
   useEffect(() => {
      const el = rolagem.current;
      if (!el) return;
      const alvo = hojeVisivel ? x(hoje) : 0;
      el.scrollLeft = Math.max(0, alvo - 120);
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [zoom, inicio]);

   return (
      <div className="grid gap-3">
         <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
               {LEGENDA_LINHA_DO_TEMPO.map(l => (
                  <span key={l.urgencia} className="inline-flex items-center gap-1.5">
                     <span className={cn("size-2.5 rounded-full", l.classe)} aria-hidden />
                     {URGENCIA_LABEL[l.urgencia]}
                  </span>
               ))}
               <span className="inline-flex items-center gap-1.5">
                  <span className="h-2.5 w-4 rounded-sm bg-accent-soft ring-1 ring-accent ring-inset" aria-hidden />
                  Evento acadêmico
               </span>
               <span className="inline-flex items-center gap-1.5">
                  <span className="h-2.5 w-4 rounded-sm bg-primary-soft ring-1 ring-primary/40 ring-inset" aria-hidden />
                  Rematrícula
               </span>
            </div>
            <Segmented
               layoutId="zoom-linha-do-tempo"
               ariaLabel="Zoom da linha do tempo"
               size="sm"
               value={zoom}
               onChange={setZoom}
               opcoes={[
                  { value: "compacto", label: "Semestre" },
                  { value: "normal", label: "Normal" },
                  { value: "detalhado", label: "Detalhado" },
               ]}
            />
         </div>

         <div ref={rolagem} className="relative overflow-x-auto rounded-xl border bg-card shadow-sm">
            <div className="relative" style={{ width: largura + LARGURA_ROTULO }}>
               {/* Meses */}
               <div className="sticky top-0 z-20 flex border-b bg-card" style={{ height: 34 }}>
                  <div className="sticky left-0 z-30 shrink-0 border-r bg-card" style={{ width: LARGURA_ROTULO }} />
                  <div className="relative" style={{ width: largura }}>
                     {meses.map(m => (
                        <div
                           key={m.rotulo}
                           className="absolute top-0 flex h-full items-center border-l pl-2 text-[11px] font-semibold uppercase tracking-[0.06em] text-muted-foreground"
                           style={{ left: m.deslocamento * pxDia, width: m.largura * pxDia }}
                        >
                           {m.rotulo}
                        </div>
                     ))}
                  </div>
               </div>

               {/* Eventos */}
               <div className="relative flex border-b bg-surface">
                  <div
                     className="sticky left-0 z-10 flex shrink-0 items-center border-r bg-surface px-3 text-[10px] font-semibold uppercase tracking-[0.1em] text-muted-foreground"
                     style={{ width: LARGURA_ROTULO, height: alturaEventos }}
                  >
                     Calendário acadêmico
                  </div>
                  <div className="relative" style={{ width: largura, height: alturaEventos }}>
                     {faixas.map(({ evento, faixa }) => {
                        const dias = diasEntre(evento.inicio, evento.fim ?? evento.inicio) + 1;
                        return (
                           <Tooltip key={evento.id}>
                              <TooltipTrigger asChild>
                                 <div
                                    className={cn(
                                       "absolute truncate rounded-[4px] px-1 text-[10px] font-medium leading-4",
                                       evento.tipo === "rematricula"
                                          ? "bg-primary-soft text-primary ring-1 ring-primary/40 ring-inset"
                                          : "bg-accent-soft text-accent-foreground ring-1 ring-accent ring-inset",
                                    )}
                                    style={{
                                       left: x(evento.inicio),
                                       width: Math.max(6, dias * pxDia - 1),
                                       top: 6 + faixa * (ALTURA_EVENTO + 4),
                                       height: ALTURA_EVENTO,
                                    }}
                                 >
                                    {dias * pxDia > 70 ? evento.nome : ""}
                                 </div>
                              </TooltipTrigger>
                              <TooltipContent className="max-w-xs">
                                 <p className="font-medium">{evento.nome}</p>
                                 <p className="opacity-80">{intervalo(evento.inicio, evento.fim)}</p>
                              </TooltipContent>
                           </Tooltip>
                        );
                     })}
                  </div>
               </div>

               {/* Setores */}
               <div className="relative">
                  {/* Grade dos meses e linha de hoje */}
                  <div className="pointer-events-none absolute inset-y-0" style={{ left: LARGURA_ROTULO, width: largura }} aria-hidden>
                     {meses.map(m => (
                        <div
                           key={m.rotulo}
                           className="absolute inset-y-0 border-l border-border/70"
                           style={{ left: m.deslocamento * pxDia }}
                        />
                     ))}
                     {hojeVisivel ? (
                        <div className="absolute inset-y-0 z-10 w-px bg-primary" style={{ left: x(hoje) }}>
                           <span className="absolute -top-0 left-1 rounded-sm bg-primary px-1 text-[9px] font-semibold uppercase text-primary-foreground">
                              hoje
                           </span>
                        </div>
                     ) : null}
                  </div>

                  {linhas.map((linha, i) => (
                     <div
                        key={linha.setor}
                        className={cn(
                           "relative flex",
                           i > 0 && "border-t border-border/70",
                           linha.setor === meuSetor && "bg-primary-soft/50",
                        )}
                        style={{ height: ALTURA_LINHA }}
                     >
                        <div
                           className={cn(
                              "sticky left-0 z-10 flex shrink-0 items-center justify-between gap-2 border-r px-3",
                              linha.setor === meuSetor ? "bg-primary-soft text-primary" : "bg-card",
                           )}
                           style={{ width: LARGURA_ROTULO }}
                        >
                           <span className="truncate text-[12.5px] font-medium">{nomeSetor(linha.setor)}</span>
                           <span className="font-mono text-[11px] tabular text-muted-foreground">{linha.itens.length}</span>
                        </div>
                        <div className="relative" style={{ width: largura }}>
                           {linha.itens.map(p => (
                              <Tooltip key={p.id}>
                                 <TooltipTrigger asChild>
                                    <motion.button
                                       type="button"
                                       onClick={() => onAbrir(p.id)}
                                       whileHover={{ scale: 1.35 }}
                                       whileTap={{ scale: 0.9 }}
                                       aria-label={`${p.id}: ${p.nome}, prazo ${dataCurta(p.prazo)}`}
                                       className={cn(
                                          "absolute top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full ring-2 ring-card focus-visible:outline-none focus-visible:ring-ring",
                                          COR_MARCADOR[p.urgencia],
                                          p.dependencia === "trava" &&
                                             p.urgencia !== "concluido" &&
                                             "outline outline-1 outline-offset-1 outline-foreground/15",
                                       )}
                                       style={{ left: x(p.prazo as string) + pxDia / 2 }}
                                    />
                                 </TooltipTrigger>
                                 <TooltipContent className="max-w-xs">
                                    <p className="font-mono text-[11px] opacity-80">
                                       {p.id} · {dataCurta(p.prazo)}
                                    </p>
                                    <p className="font-medium">{p.nome}</p>
                                    <p className="opacity-80">{URGENCIA_LABEL[p.urgencia]}</p>
                                 </TooltipContent>
                              </Tooltip>
                           ))}
                        </div>
                     </div>
                  ))}
                  {linhas.length === 0 ? (
                     <p className="px-4 py-10 text-center text-sm text-muted-foreground">
                        Nenhum processo com data para os filtros escolhidos.
                     </p>
                  ) : null}
               </div>
            </div>
         </div>
         <p className="text-xs text-muted-foreground">
            Arraste para o lado para ver o semestre inteiro. Pontos com contorno travam um evento acadêmico se atrasarem. Período:{" "}
            {dataCurta(inicio)} a {dataCurta(paraIso(addDays(paraData(inicio), totalDias - 1)))}.
         </p>
      </div>
   );
}
