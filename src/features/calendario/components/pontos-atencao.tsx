/**
 * Pontos de atenção: o que ainda depende de decisão, de responsável ou de
 * data para o calendário ficar completo. É a lista de checagem antes de
 * colocar o sistema para rodar.
 */
import { CalendarClock, ChevronDown, Gavel, HelpCircle, ListTodo, Save, UserRoundX } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

import { Segmented } from "@/components/core/segmented";
import { StatTile } from "@/components/core/stat-tile";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Callout } from "@/components/ui/callout";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useSalvarDecisao } from "@/features/calendario/api/calendario.mutations";
import { ProcessoLinha } from "@/features/calendario/components/processo-linha";
import { FORA_DO_ESCOPO, PREMISSAS } from "@/features/calendario/data/catalogo";
import { useCalendario } from "@/features/calendario/hooks/use-calendario";
import { useProcessoAberto } from "@/features/calendario/hooks/use-processo-aberto";
import { intervalo } from "@/features/calendario/lib/datas";
import type { DecisaoJanela, JanelaCritica, Processo } from "@/features/calendario/types/calendario.schema";
import { collapseVariants, staggerContainer } from "@/lib/motion";

function Secao({ id, titulo, dica, children }: { id: string; titulo: string; dica?: string; children: React.ReactNode }) {
   return (
      <section id={id} className="grid scroll-mt-6 gap-3">
         <header className="px-1">
            <h2 className="font-display text-[15px] font-medium">{titulo}</h2>
            {dica ? <p className="mt-0.5 max-w-3xl text-xs text-muted-foreground">{dica}</p> : null}
         </header>
         {children}
      </section>
   );
}

function ListaCurta({ itens, onAbrir }: { itens: Processo[]; onAbrir: (id: string) => void }) {
   if (!itens.length)
      return (
         <p className="rounded-xl border border-dashed bg-surface px-4 py-5 text-center text-sm text-muted-foreground">
            Nada pendente aqui.
         </p>
      );
   return (
      <div className="divide-y overflow-hidden rounded-xl border bg-card shadow-sm">
         {itens.map(p => (
            <ProcessoLinha key={p.id} processo={p} onAbrir={onAbrir} />
         ))}
      </div>
   );
}

function JanelaCard({ janela, decisao }: { janela: JanelaCritica; decisao?: DecisaoJanela }) {
   const salvar = useSalvarDecisao();
   const [aberto, setAberto] = useState(false);
   const [situacao, setSituacao] = useState<DecisaoJanela["situacao"]>(decisao?.situacao ?? "pendente");
   const [responsavel, setResponsavel] = useState(decisao?.responsavel ?? "");
   const [texto, setTexto] = useState(decisao?.decisao ?? "");
   const decidido = decisao?.situacao === "decidido";

   function gravar() {
      salvar.mutate(
         { id: janela.id, decisao: { situacao, responsavel: responsavel.trim(), decisao: texto.trim() } },
         { onSuccess: () => toast.success(`${janela.id} atualizada`) },
      );
   }

   return (
      <article className="rounded-xl border bg-card shadow-sm">
         <button
            type="button"
            onClick={() => setAberto(v => !v)}
            aria-expanded={aberto}
            className="flex w-full items-start gap-3 p-4 text-left"
         >
            <div className="min-w-0 flex-1">
               <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-[12px] font-medium text-primary">{janela.id}</span>
                  <Badge size="sm" tone="neutral">
                     {janela.tipo}
                  </Badge>
                  <Badge size="sm" tone={decidido ? "success" : "warning"} dot>
                     {decidido ? "Decidido" : "Pendente"}
                  </Badge>
                  {decisao?.responsavel ? <span className="text-xs text-muted-foreground">Responsável: {decisao.responsavel}</span> : null}
               </div>
               <p className="mt-1.5 text-sm font-medium leading-snug">{janela.ponto}</p>
            </div>
            <ChevronDown
               className={`mt-1 size-4 shrink-0 text-muted-foreground transition-transform ${aberto ? "rotate-180" : ""}`}
               aria-hidden
            />
         </button>
         <AnimatePresence initial={false}>
            {aberto ? (
               <motion.div variants={collapseVariants} initial="initial" animate="animate" exit="exit" className="overflow-hidden">
                  <div className="grid gap-4 border-t p-4">
                     <dl className="grid gap-3 text-sm">
                        <div>
                           <dt className="text-[11px] font-semibold uppercase tracking-[0.06em] text-muted-foreground">O que acontece</dt>
                           <dd className="mt-1 leading-relaxed">{janela.evidencia}</dd>
                        </div>
                        <div>
                           <dt className="text-[11px] font-semibold uppercase tracking-[0.06em] text-muted-foreground">Impacto</dt>
                           <dd className="mt-1 leading-relaxed">{janela.impacto}</dd>
                        </div>
                        <div>
                           <dt className="text-[11px] font-semibold uppercase tracking-[0.06em] text-muted-foreground">
                              Recomendação da planilha
                           </dt>
                           <dd className="mt-1 leading-relaxed">{janela.recomendacao}</dd>
                        </div>
                     </dl>
                     <div className="grid gap-3 rounded-lg bg-surface p-3">
                        <Segmented
                           layoutId={`decisao-${janela.id}`}
                           ariaLabel="Situação da decisão"
                           size="sm"
                           value={situacao}
                           onChange={setSituacao}
                           opcoes={[
                              { value: "pendente", label: "Pendente" },
                              { value: "decidido", label: "Decidido" },
                           ]}
                        />
                        <Input
                           value={responsavel}
                           onChange={e => setResponsavel(e.target.value)}
                           placeholder="Quem responde por esta decisão"
                           aria-label="Responsável"
                        />
                        <Textarea
                           value={texto}
                           onChange={e => setTexto(e.target.value)}
                           rows={2}
                           placeholder="O que foi decidido"
                           aria-label="Decisão"
                        />
                        <div className="flex justify-end">
                           <Button size="sm" onClick={gravar} disabled={salvar.isPending}>
                              <Save className="size-3.5" />
                              Salvar
                           </Button>
                        </div>
                     </div>
                  </div>
               </motion.div>
            ) : null}
         </AnimatePresence>
      </article>
   );
}

export function PontosAtencao() {
   const { visao } = useCalendario();
   const { abrir } = useProcessoAberto();
   if (!visao) return null;

   const pendentes = visao.janelas.filter(j => visao.decisoes[j.id]?.situacao !== "decidido");
   const semResponsavel = visao.processos.filter(p => p.responsaveis.includes("a-definir"));
   const aConfirmar = visao.processos.filter(p => p.prazoProposto && p.status !== "concluido");
   const semData = visao.processos.filter(p => p.prazoTipo === "sem-data");
   const eventosComProcesso = new Set(visao.processos.map(p => p.eventoId).filter(Boolean));
   const eventosSemProcesso = visao.eventos.filter(e => e.tipo === "academico" && !eventosComProcesso.has(e.id));
   const rematriculaV1 = ["A1.16", "A1.17"].map(id => visao.processoPorId.get(id)).filter((p): p is Processo => Boolean(p));

   const ir = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });

   return (
      <div className="grid gap-10">
         <motion.div variants={staggerContainer} initial="initial" animate="animate" className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <StatTile
               label="Decisões pendentes"
               valor={pendentes.length}
               icon={Gavel}
               tom={pendentes.length ? "warning" : "success"}
               detalhe={`de ${visao.janelas.length} janelas críticas`}
               onClick={() => ir("janelas")}
            />
            <StatTile
               label="Sem responsável"
               valor={semResponsavel.length}
               icon={UserRoundX}
               tom={semResponsavel.length ? "warning" : "success"}
               detalhe="Setor ainda a definir"
               onClick={() => ir("sem-responsavel")}
            />
            <StatTile
               label="Prazos a confirmar"
               valor={aConfirmar.length}
               icon={CalendarClock}
               detalhe="Sugeridos pelas regras"
               onClick={() => ir("a-confirmar")}
            />
            <StatTile
               label="Sem data"
               valor={semData.length}
               icon={ListTodo}
               detalhe="Fora da linha do tempo"
               onClick={() => ir("sem-data")}
            />
         </motion.div>

         <Secao
            id="divergencias"
            titulo="O que a planilha v1 ainda não reflete"
            dica="Diferenças entre a planilha de 28/10/2026 e as informações recebidas depois."
         >
            <div className="grid gap-3">
               <Callout tone="warning" title="Prazos de rematrícula da v1 terminam em 23/12">
                  A planilha fechou a rematrícula em 23/12/2026, mas as janelas reais vão até 31/01 (presencial, com prorrogação até 23/02),
                  01/02 (EaD, com prorrogação até 02/03) e 19/02 (híbrido, sem prorrogação). Revise os prazos abaixo.
               </Callout>
               <ListaCurta itens={rematriculaV1} onAbrir={abrir} />
               <Callout tone="info" title="Limpeza de ficha dividida por modalidade">
                  O antigo A1.23 (18/01) virou três processos, um por modalidade, cada um logo depois do fim da prorrogação: A1.23-P,
                  A1.23-E e A1.23-H.
               </Callout>
            </div>
         </Secao>

         <Secao
            id="janelas"
            titulo="Janelas críticas"
            dica="Pontos em que o calendário acadêmico aperta a operação. Registre aqui a decisão e quem responde por ela."
         >
            <div className="grid gap-3">
               {visao.janelas.map(j => (
                  <JanelaCard key={j.id} janela={j} decisao={visao.decisoes[j.id]} />
               ))}
            </div>
         </Secao>

         <Secao
            id="sem-responsavel"
            titulo="Processos sem setor responsável"
            dica="Vieram da diretriz do contrato ou do organograma sem um setor indicado. Abra e use “Ajustar” para definir."
         >
            <ListaCurta itens={semResponsavel} onAbrir={abrir} />
         </Secao>

         <Secao
            id="a-confirmar"
            titulo="Prazos sugeridos para confirmar"
            dica="Calculados pelas regras do calendário (ex.: 7 dias antes de abrir a rematrícula). Confirme com o setor e ajuste se precisar."
         >
            <ListaCurta itens={aConfirmar} onAbrir={abrir} />
         </Secao>

         <Secao
            id="sem-data"
            titulo="Processos sem data"
            dica="Os passos do organograma da rematrícula entram sem data até cada setor confirmar a de 2027. A data de 2026 aparece como referência."
         >
            <ListaCurta itens={semData} onAbrir={abrir} />
         </Secao>

         <Secao
            id="eventos"
            titulo="Eventos acadêmicos sem processo ligado"
            dica="Confirmar se a preparação está coberta por um evento parecido (ex.: calouros e veteranos) ou se falta um processo próprio."
         >
            {eventosSemProcesso.length ? (
               <ul className="divide-y overflow-hidden rounded-xl border bg-card shadow-sm">
                  {eventosSemProcesso.map(e => (
                     <li key={e.id} className="flex items-start gap-3 px-4 py-3">
                        <HelpCircle className="mt-0.5 size-4 shrink-0 text-warning-foreground" aria-hidden />
                        <div>
                           <p className="text-[13px] font-medium">
                              <span className="font-mono text-primary">{e.id}</span> {e.nome}
                           </p>
                           <p className="text-xs text-muted-foreground">{intervalo(e.inicio, e.fim)}</p>
                        </div>
                     </li>
                  ))}
               </ul>
            ) : (
               <p className="text-sm text-muted-foreground">Todos os eventos têm pelo menos um processo ligado.</p>
            )}
         </Secao>

         <Secao
            id="escopo"
            titulo="Áreas fora da planilha v1"
            dica="Não têm processos na planilha original. Marketing e Acordos já entraram pelo fluxo da rematrícula."
         >
            <div className="flex flex-wrap gap-2">
               {FORA_DO_ESCOPO.map(s => (
                  <span
                     key={s}
                     className={`rounded-full px-3 py-1 text-xs ${s === "Marketing" ? "bg-primary-soft text-primary" : "bg-muted text-muted-foreground"}`}
                  >
                     {s}
                     {s === "Marketing" ? " · já incluído" : ""}
                  </span>
               ))}
            </div>
         </Secao>

         <Secao id="premissas" titulo="Premissas para confirmar">
            <ul className="grid gap-2">
               {PREMISSAS.map(p => (
                  <li key={p.titulo} className="rounded-xl border bg-card px-4 py-3 shadow-sm">
                     <p className="text-[13px] font-medium">{p.titulo}</p>
                     <p className="mt-0.5 text-sm text-muted-foreground">{p.texto}</p>
                  </li>
               ))}
            </ul>
         </Secao>
      </div>
   );
}
