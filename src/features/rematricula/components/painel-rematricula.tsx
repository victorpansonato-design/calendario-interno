/**
 * Rematrícula 2027-1: janelas por modalidade, o fluxo do organograma (que se
 * repete todo ano, mudando só as datas) e os processos da etapa.
 */
import { motion } from "motion/react";
import { Megaphone, PhoneCall, Smartphone, Target, Users } from "lucide-react";

import { Callout } from "@/components/ui/callout";
import {
   dataCurta,
   diaMes,
   diasEntre,
   JANELAS_REMATRICULA,
   ProcessoLinha,
   Setores,
   StatusBadge,
   useCalendario,
   useProcessoAberto,
   type Processo,
} from "@/features/calendario";
import { emphasis, pressSubtle, staggerContainer, staggerItem } from "@/lib/motion";
import { cn } from "@/lib/utils";

const ESCALA_INICIO = "2026-12-01";
const ESCALA_FIM = "2027-03-15";
const MARCAS = ["2026-12-01", "2027-01-01", "2027-02-01", "2027-03-01"];
const MESES_MARCA: Record<string, string> = { "2026-12-01": "dez", "2027-01-01": "jan", "2027-02-01": "fev", "2027-03-01": "mar" };

const ICONE_CANAL: Record<string, React.ComponentType<{ className?: string }>> = {
   Blip: Megaphone,
   Ligação: PhoneCall,
   "App / Comunidades": Smartphone,
   "Plantão da equipe de cobrança": Users,
};

function Secao({ titulo, dica, children }: { titulo: string; dica?: string; children: React.ReactNode }) {
   return (
      <section className="grid gap-3">
         <header className="px-1">
            <h2 className="font-display text-[15px] font-medium">{titulo}</h2>
            {dica ? <p className="mt-0.5 max-w-3xl text-xs text-muted-foreground">{dica}</p> : null}
         </header>
         {children}
      </section>
   );
}

function JanelasPorModalidade({ hoje }: { hoje: string }) {
   const total = diasEntre(ESCALA_INICIO, ESCALA_FIM);
   const pct = (iso: string) => `${(diasEntre(ESCALA_INICIO, iso) / total) * 100}%`;
   const largura = (de: string, ate: string) => `${((diasEntre(de, ate) + 1) / total) * 100}%`;
   const hojeNaEscala = hoje >= ESCALA_INICIO && hoje <= ESCALA_FIM;

   return (
      <div className="rounded-xl border bg-card p-5 shadow-sm">
         <div className="relative ml-24 h-5 text-[10px] font-semibold uppercase tracking-[0.08em] text-muted-foreground sm:ml-28">
            {MARCAS.map(m => (
               <span key={m} className="absolute -translate-x-1/2" style={{ left: pct(m) }}>
                  {MESES_MARCA[m]}
               </span>
            ))}
         </div>
         <div className="grid gap-4">
            {JANELAS_REMATRICULA.map((j, i) => (
               <div key={j.modalidade} className="grid grid-cols-[6rem_1fr] items-center gap-0 sm:grid-cols-[7rem_1fr]">
                  <div>
                     <p className="text-sm font-medium">{j.modalidade}</p>
                     <p className="text-[11px] text-muted-foreground">{j.fimProrrogacao ? "com prorrogação" : "sem prorrogação"}</p>
                  </div>
                  <div className="relative h-9 rounded-md bg-muted/50">
                     {MARCAS.map(m => (
                        <span key={m} className="absolute inset-y-0 w-px bg-border" style={{ left: pct(m) }} aria-hidden />
                     ))}
                     <motion.div
                        className="absolute inset-y-1.5 origin-left rounded-[5px] bg-primary"
                        style={{ left: pct(j.inicio), width: largura(j.inicio, j.fimIdeal) }}
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: 0.8, ease: emphasis, delay: i * 0.08 }}
                        title={`${dataCurta(j.inicio)} a ${dataCurta(j.fimIdeal)}`}
                     />
                     {j.fimProrrogacao ? (
                        <motion.div
                           className="absolute inset-y-1.5 origin-left rounded-[5px] bg-[repeating-linear-gradient(135deg,var(--primary-soft)_0_6px,transparent_6px_10px)] ring-1 ring-primary/40 ring-inset"
                           style={{ left: pct(j.fimIdeal), width: largura(j.fimIdeal, j.fimProrrogacao) }}
                           initial={{ scaleX: 0 }}
                           animate={{ scaleX: 1 }}
                           transition={{ duration: 0.6, ease: emphasis, delay: 0.5 + i * 0.08 }}
                           title={`Prorrogação até ${dataCurta(j.fimProrrogacao)}`}
                        />
                     ) : null}
                     {hojeNaEscala ? (
                        <span className="absolute inset-y-0 w-0.5 bg-destructive" style={{ left: pct(hoje) }} title="Hoje" />
                     ) : null}
                  </div>
                  <p className="col-start-2 mt-1 text-xs text-muted-foreground">
                     <span className="font-mono tabular text-foreground">
                        {diaMes(j.inicio)} → {diaMes(j.fimIdeal)}
                     </span>
                     {j.fimProrrogacao ? (
                        <>
                           {" "}
                           · prorrogação até <span className="font-mono tabular text-foreground">{diaMes(j.fimProrrogacao)}</span>
                        </>
                     ) : null}
                     {!j.fimProrrogacao ? ` · ${j.nota}` : null}
                  </p>
               </div>
            ))}
         </div>
         <div className="mt-4 flex flex-wrap gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
               <span className="h-2.5 w-5 rounded-sm bg-primary" /> Período normal
            </span>
            <span className="flex items-center gap-1.5">
               <span className="h-2.5 w-5 rounded-sm bg-[repeating-linear-gradient(135deg,var(--primary-soft)_0_4px,transparent_4px_7px)] ring-1 ring-primary/40 ring-inset" />{" "}
               Prorrogação
            </span>
            {hojeNaEscala ? (
               <span className="flex items-center gap-1.5">
                  <span className="h-3 w-0.5 bg-destructive" /> Hoje
               </span>
            ) : null}
         </div>
      </div>
   );
}

function PassoFluxo({ processo, numero, onAbrir }: { processo: Processo; numero: number; onAbrir: (id: string) => void }) {
   return (
      <motion.li variants={staggerItem} className="group relative grid grid-cols-[2.25rem_1fr] gap-3 pb-4 last:pb-0">
         <span className="absolute bottom-0 left-[1.07rem] top-9 w-px bg-border group-last:hidden" aria-hidden />
         <span
            className={cn(
               "relative z-10 grid size-9 place-items-center rounded-full font-mono text-[13px] font-medium tabular",
               processo.status === "concluido" ? "bg-success text-success-foreground" : "bg-primary-soft text-primary",
            )}
         >
            {numero}
         </span>
         <motion.button
            type="button"
            whileTap={pressSubtle}
            onClick={() => onAbrir(processo.id)}
            className="rounded-xl border bg-card p-3.5 text-left shadow-sm transition-colors duration-150 hover:border-border-strong"
         >
            <div className="flex flex-wrap items-start justify-between gap-2">
               <p className="text-sm font-medium leading-snug">{processo.nome}</p>
               {processo.status !== "a-fazer" ? <StatusBadge status={processo.status} /> : null}
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1.5">
               <Setores processo={processo} />
               {processo.canais.map(c => {
                  const Icone = ICONE_CANAL[c];
                  return (
                     <span key={c} className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                        {Icone ? <Icone className="size-3" /> : null}
                        {c}
                     </span>
                  );
               })}
            </div>
            {processo.quando ? (
               <p className="mt-1.5 text-xs text-muted-foreground">
                  {processo.prazo ? `Prazo: ${dataCurta(processo.prazo)}` : processo.quando}
               </p>
            ) : null}
         </motion.button>
      </motion.li>
   );
}

export function PainelRematricula() {
   const { visao, hoje } = useCalendario();
   const { abrir } = useProcessoAberto();
   if (!visao) return null;

   const fluxo = visao.processos
      .filter(p => p.bloco === "rematricula-fluxo")
      .sort((a, b) => a.id.localeCompare(b.id, "pt-BR", { numeric: true }));
   const limpeza = ["A1.23-H", "A1.23-P", "A1.23-E"].map(id => visao.processoPorId.get(id)).filter((p): p is Processo => Boolean(p));
   const etapa = visao.processos.filter(p => p.bloco === "matricula" && !p.id.startsWith("A1.23-"));

   return (
      <div className="grid gap-10">
         <Secao titulo="Janelas de rematrícula 2027-1" dica="Todas abrem em 15/12/2026. O fim muda por modalidade.">
            <JanelasPorModalidade hoje={hoje} />
         </Secao>

         <Secao
            titulo="Limpeza de ficha: só depois do fim da rematrícula"
            dica="Como a matrícula é prorrogada, as fichas dos matriculados só podem ser limpas no fim do período de cada modalidade."
         >
            <div className="divide-y overflow-hidden rounded-xl border bg-card shadow-sm">
               {limpeza.map(p => (
                  <ProcessoLinha key={p.id} processo={p} onAbrir={abrir} />
               ))}
            </div>
         </Secao>

         <div className="grid gap-10 xl:grid-cols-[minmax(0,1fr)_320px]">
            <Secao
               titulo="Fluxo da rematrícula (organograma)"
               dica="Passos do organograma de 2026, que se repetem em 2027 mudando só as datas. Entram sem data até cada setor confirmar; a data de 2026 aparece como referência."
            >
               <motion.ol variants={staggerContainer} initial="initial" animate="animate" className="grid">
                  {fluxo.map((p, i) => (
                     <PassoFluxo key={p.id} processo={p} numero={i + 1} onAbrir={abrir} />
                  ))}
               </motion.ol>
            </Secao>

            <aside className="grid content-start gap-4">
               <div className="rounded-xl border bg-card p-5 shadow-sm">
                  <div className="flex items-center gap-2">
                     <Target className="size-4 text-primary" aria-hidden />
                     <h3 className="font-display text-[15px] font-medium">Metas de 2026</h3>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">Referência do organograma. Confirmar as metas de 2027.</p>
                  <dl className="mt-4 grid gap-3">
                     <div className="flex items-baseline justify-between">
                        <dt className="text-sm">Presencial</dt>
                        <dd className="font-display text-2xl tabular">97%</dd>
                     </div>
                     <div className="flex items-baseline justify-between">
                        <dt className="text-sm">Semipresencial</dt>
                        <dd className="font-display text-2xl tabular">97%</dd>
                     </div>
                  </dl>
                  <p className="mt-3 border-t pt-3 text-xs text-muted-foreground">
                     Prazo da meta em 2026: 21/03. Até 2 mensalidades negociamos.
                  </p>
               </div>
               <Callout tone="info" variant="banner" title="Acompanhamento das metas">
                  O Metabase precisa estar virado antes de a rematrícula abrir (processo K.04, TI Sistemas).
               </Callout>
            </aside>
         </div>

         <Secao titulo="Processos da etapa Matrícula e rematrícula">
            <div className="divide-y overflow-hidden rounded-xl border bg-card shadow-sm">
               {etapa.map(p => (
                  <ProcessoLinha key={p.id} processo={p} onAbrir={abrir} />
               ))}
            </div>
         </Secao>
      </div>
   );
}
