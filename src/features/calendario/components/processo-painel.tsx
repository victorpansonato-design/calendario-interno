/**
 * Painel lateral de um processo: tudo o que o setor precisa para agir,
 * mudar o status, registrar uma nota ou ajustar o processo.
 * Abre a partir de qualquer tela pelo parâmetro `?processo=` da URL.
 */
import { AnimatePresence, motion } from "motion/react";
import {
   ArrowRight,
   ArrowLeft,
   CalendarDays,
   Check,
   ChevronDown,
   CircleDot,
   Hourglass,
   Link2,
   Lock,
   Pencil,
   RotateCcw,
   Send,
   Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Segmented } from "@/components/core/segmented";
import { Button } from "@/components/ui/button";
import { Callout } from "@/components/ui/callout";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import {
   useAdicionarNota,
   useExcluirProcessoCriado,
   useMudarStatus,
   useRestaurarOriginal,
} from "@/features/calendario/api/calendario.mutations";
import { DependenciaTag, PrazoPropostoTag, Setores, StatusBadge, UrgenciaBadge } from "@/features/calendario/components/badges";
import { EditarProcessoForm } from "@/features/calendario/components/editar-processo-form";
import { DEPENDENCIA_DICA, nomeBloco, ORIGEM_LABEL, STATUS_LABEL } from "@/features/calendario/data/catalogo";
import { useAutor } from "@/features/calendario/hooks/use-autor";
import { useCalendario } from "@/features/calendario/hooks/use-calendario";
import { useProcessoAberto } from "@/features/calendario/hooks/use-processo-aberto";
import { dataCurta, dataPorExtenso, distanciaEmDias, intervalo } from "@/features/calendario/lib/datas";
import type { Processo, Registro, Status } from "@/features/calendario/types/calendario.schema";
import { collapseVariants } from "@/lib/motion";

const OPCOES_STATUS: { value: Status; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
   { value: "a-fazer", label: "A fazer", icon: CircleDot },
   { value: "em-andamento", label: "Em andamento", icon: Hourglass },
   { value: "bloqueado", label: "Travado", icon: Lock },
   { value: "concluido", label: "Concluído", icon: Check },
];

export function ProcessoPainel() {
   const { aberto, abrir, restaurarFoco, podeVoltar, voltar } = useProcessoAberto();
   const { visao, isLoading, isError, refetch } = useCalendario();
   const processo = aberto ? visao?.processoPorId.get(aberto) : undefined;
   useEffect(() => {
      if (processo?.id) document.querySelector<HTMLElement>("[data-processo-detalhe] [data-slot=sheet-title]")?.focus();
   }, [processo?.id]);

   return (
      <Sheet open={Boolean(aberto)} onOpenChange={open => (!open ? abrir(null) : undefined)}>
         <SheetContent
            data-processo-detalhe
            closeLabel="Fechar detalhes"
            className="processo-drawer w-full gap-0 overflow-hidden p-0 sm:max-w-xl"
            onCloseAutoFocus={event => {
               event.preventDefault();
               restaurarFoco();
            }}
            onOpenAutoFocus={event => {
               event.preventDefault();
               document.querySelector<HTMLElement>("[data-slot=sheet-content] [data-slot=sheet-title]")?.focus();
            }}
         >
            <div className="flex min-h-14 shrink-0 items-center border-b bg-card px-5 pr-16">
               {podeVoltar ? (
                  <Button variant="ghost" size="sm" onClick={voltar}>
                     <ArrowLeft data-icon="inline-start" />
                     Voltar ao processo
                  </Button>
               ) : (
                  <span className="text-sm font-medium">Detalhes do processo</span>
               )}
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain" key={aberto}>
               {isLoading ? (
                  <SheetHeader className="p-6" aria-busy="true">
                     <SheetTitle tabIndex={-1}>Carregando processo</SheetTitle>
                     <SheetDescription>Aguarde os dados do calendário.</SheetDescription>
                     <Skeleton className="h-48" />
                  </SheetHeader>
               ) : isError ? (
                  <SheetHeader className="p-6">
                     <SheetTitle tabIndex={-1}>Não foi possível carregar o processo</SheetTitle>
                     <SheetDescription>Tente novamente para consultar os dados.</SheetDescription>
                     <Button onClick={() => void refetch()} variant="outline">
                        Tentar de novo
                     </Button>
                  </SheetHeader>
               ) : processo ? (
                  <ConteudoPainel key={processo.id} processo={processo} onAbrir={abrir} />
               ) : (
                  <SheetHeader className="p-6">
                     <SheetTitle tabIndex={-1}>Processo não encontrado</SheetTitle>
                     <SheetDescription>O código {aberto} não existe neste calendário. Ele pode ter sido excluído.</SheetDescription>
                  </SheetHeader>
               )}
            </div>
         </SheetContent>
      </Sheet>
   );
}

function Campo({ rotulo, children }: { rotulo: string; children: React.ReactNode }) {
   return (
      <div className="grid gap-1">
         <dt className="text-[11px] font-semibold uppercase tracking-[0.06em] text-muted-foreground">{rotulo}</dt>
         <dd className="text-sm leading-relaxed text-foreground">{children}</dd>
      </div>
   );
}

function LinkProcesso({ processo, onAbrir }: { processo: Processo; onAbrir: (id: string) => void }) {
   return (
      <button
         type="button"
         onClick={() => onAbrir(processo.id)}
         className="flex w-full items-start gap-2 rounded-md px-2 py-1.5 text-left text-sm transition-colors hover:bg-muted"
      >
         <span className="font-mono text-[12px] font-medium tabular text-primary">{processo.id}</span>
         <span className="min-w-0 flex-1">{processo.nome}</span>
         <span className="shrink-0 text-xs text-muted-foreground">
            {processo.prazo ? dataCurta(processo.prazo) : (processo.quando ?? "sem data")}
         </span>
      </button>
   );
}

function ConteudoPainel({ processo, onAbrir }: { processo: Processo; onAbrir: (id: string | null) => void }) {
   const { visao } = useCalendario();
   const autor = useAutor();
   const mudarStatus = useMudarStatus();
   const adicionarNota = useAdicionarNota();
   const restaurar = useRestaurarOriginal();
   const excluir = useExcluirProcessoCriado();
   const [editando, setEditando] = useState(false);
   const [nota, setNota] = useState("");
   const [mostrarTecnico, setMostrarTecnico] = useState(false);
   const pendente = mudarStatus.isPending || adicionarNota.isPending || restaurar.isPending || excluir.isPending;
   const erro = mudarStatus.error ?? adicionarNota.error ?? restaurar.error ?? excluir.error;

   const evento = processo.eventoId ? visao?.eventoPorId.get(processo.eventoId) : undefined;
   const antecessor = processo.antecessor ? visao?.processoPorId.get(processo.antecessor) : undefined;
   const dependentes = visao?.dependentes.get(processo.id) ?? [];

   function trocarStatus(status: Status) {
      if (status === processo.status) return;
      mudarStatus.mutate(
         { id: processo.id, status, autor, nota: status === "bloqueado" && nota.trim() ? nota.trim() : undefined },
         {
            onSuccess: () => {
               toast.success(`Status: ${STATUS_LABEL[status]}`, { description: processo.nome });
               if (status === "bloqueado" && nota.trim()) setNota("");
            },
         },
      );
   }

   function registrarNota() {
      if (!nota.trim()) return;
      adicionarNota.mutate(
         { id: processo.id, texto: nota.trim(), autor },
         { onSuccess: () => (setNota(""), toast.success("Nota registrada")) },
      );
   }

   async function copiarLink() {
      try {
         await navigator.clipboard.writeText(window.location.href);
         toast.success("Link copiado", { description: "Quem abrir o link cai direto neste processo." });
      } catch {
         toast.error("Não foi possível copiar o link");
      }
   }

   return (
      <div className="flex min-h-full flex-col">
         <SheetHeader className="gap-3 border-b p-6 pr-12">
            <div className="flex flex-wrap items-center gap-2">
               <span className="font-mono text-[13px] font-medium tabular text-primary">{processo.id}</span>
               <span className="text-xs text-muted-foreground">{nomeBloco(processo.bloco)}</span>
            </div>
            <SheetTitle tabIndex={-1} className="text-lg font-semibold leading-snug">
               {processo.nome}
            </SheetTitle>
            <SheetDescription className="sr-only">Detalhes, status e histórico do processo.</SheetDescription>
            <div className="flex flex-wrap items-center gap-2">
               <Setores processo={processo} />
               <UrgenciaBadge urgencia={processo.urgencia} dias={processo.diasParaPrazo} />
               {processo.prazoProposto ? <PrazoPropostoTag /> : null}
            </div>
         </SheetHeader>

         <div className="grid gap-6 p-6">
            {erro ? (
               <Callout tone="danger" title="A alteração não foi salva">
                  Não foi possível concluir a ação. Seus dados de entrada continuam disponíveis; tente novamente.
               </Callout>
            ) : null}
            {pendente ? (
               <p role="status" className="text-sm text-muted-foreground">
                  Salvando alteração…
               </p>
            ) : null}
            <section className="grid gap-2">
               <span className="text-[11px] font-semibold uppercase tracking-[0.06em] text-muted-foreground">Status do setor</span>
               <Segmented
                  layoutId={`status-${processo.id}`}
                  ariaLabel="Status do processo"
                  opcoes={OPCOES_STATUS}
                  value={processo.status}
                  onChange={trocarStatus}
                  disabled={pendente}
               />
               {processo.status === "bloqueado" ? (
                  <p className="text-xs text-muted-foreground">
                     Travado: registre abaixo o que está faltando e de quem, para a outra área enxergar.
                  </p>
               ) : null}
            </section>

            {processo.alterado ? (
               <Callout tone="info" variant="inline" icon={Pencil}>
                  Este processo foi ajustado no sistema. O original da planilha continua guardado.
               </Callout>
            ) : null}

            <AnimatePresence initial={false} mode="wait">
               {editando ? (
                  <motion.div
                     key="editar"
                     variants={collapseVariants}
                     initial="initial"
                     animate="animate"
                     exit="exit"
                     className="overflow-hidden"
                  >
                     <EditarProcessoForm processo={processo} onConcluir={() => setEditando(false)} />
                  </motion.div>
               ) : (
                  <motion.dl key="ver" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid gap-5">
                     <Campo rotulo="Prazo">
                        {processo.prazoTipo === "data" && processo.prazo ? (
                           <span className="flex flex-wrap items-baseline gap-x-2">
                              <span className="first-letter:uppercase">{dataPorExtenso(processo.prazo)}</span>
                              {processo.diasParaPrazo !== null && processo.status !== "concluido" ? (
                                 <span className="text-xs text-muted-foreground">({distanciaEmDias(processo.diasParaPrazo)})</span>
                              ) : null}
                           </span>
                        ) : processo.prazoTipo === "continuo" ? (
                           "Rotina contínua, durante o semestre todo"
                        ) : (
                           <span>Sem data definida{processo.quando ? ` · ${processo.quando}` : ""}</span>
                        )}
                        {processo.ajusteData ? (
                           <span className="mt-1 block text-xs text-muted-foreground">
                              Data antecipada na planilha: {processo.ajusteData}
                           </span>
                        ) : null}
                     </Campo>

                     <Campo rotulo="O que precisa estar pronto">{processo.entregavel}</Campo>

                     {evento ? (
                        <Campo rotulo="Serve para o evento">
                           <span className="flex items-start gap-2">
                              <CalendarDays className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden />
                              <span>
                                 {evento.nome}
                                 <span className="block text-xs text-muted-foreground">
                                    {intervalo(evento.inicio, evento.fim)}
                                    {processo.diasAntesEvento ? ` · prazo ${processo.diasAntesEvento} dias antes` : ""}
                                 </span>
                              </span>
                           </span>
                        </Campo>
                     ) : null}

                     <Campo rotulo="Se atrasar">
                        <span className="flex flex-wrap items-center gap-2">
                           <DependenciaTag dependencia={processo.dependencia} />
                           <span className="text-muted-foreground">{DEPENDENCIA_DICA[processo.dependencia]}</span>
                        </span>
                     </Campo>

                     {antecessor || dependentes.length ? (
                        <Campo rotulo="Encadeamento">
                           <div className="grid gap-1">
                              {antecessor ? (
                                 <div>
                                    <span className="text-xs text-muted-foreground">Começa depois de</span>
                                    <LinkProcesso processo={antecessor} onAbrir={onAbrir} />
                                 </div>
                              ) : null}
                              {dependentes.length ? (
                                 <div>
                                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                       Libera <ArrowRight className="size-3" />
                                    </span>
                                    {dependentes.map(d => (
                                       <LinkProcesso key={d.id} processo={d} onAbrir={onAbrir} />
                                    ))}
                                 </div>
                              ) : null}
                           </div>
                        </Campo>
                     ) : null}

                     {processo.formatos ? <Campo rotulo="Vale para">{processo.formatos}</Campo> : null}
                     {processo.canais.length ? <Campo rotulo="Canais">{processo.canais.join(" · ")}</Campo> : null}
                     {processo.observacao ? <Campo rotulo="Observação">{processo.observacao}</Campo> : null}

                     <div>
                        <button
                           type="button"
                           onClick={() => setMostrarTecnico(v => !v)}
                           className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
                           aria-expanded={mostrarTecnico}
                        >
                           <ChevronDown className={`size-3.5 transition-transform ${mostrarTecnico ? "rotate-180" : ""}`} />
                           Detalhes técnicos e origem
                        </button>
                        <AnimatePresence initial={false}>
                           {mostrarTecnico ? (
                              <motion.div
                                 variants={collapseVariants}
                                 initial="initial"
                                 animate="animate"
                                 exit="exit"
                                 className="overflow-hidden"
                              >
                                 <dl className="mt-3 grid gap-3 rounded-lg bg-surface p-3">
                                    {processo.nomeTecnico ? <Campo rotulo="Nome técnico (planilha)">{processo.nomeTecnico}</Campo> : null}
                                    {processo.subprocesso ? (
                                       <Campo rotulo="Subprocesso">
                                          {processo.subprocesso.nome}
                                          <span className="block font-mono text-xs text-muted-foreground">
                                             {processo.subprocesso.codigo}
                                          </span>
                                       </Campo>
                                    ) : null}
                                    <Campo rotulo="Origem">{ORIGEM_LABEL[processo.origem]}</Campo>
                                 </dl>
                              </motion.div>
                           ) : null}
                        </AnimatePresence>
                     </div>
                  </motion.dl>
               )}
            </AnimatePresence>

            {!editando ? (
               <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm" onClick={() => setEditando(true)}>
                     <Pencil className="size-3.5" />
                     Ajustar
                  </Button>
                  {processo.alterado && processo.origem !== "manual" ? (
                     <Button
                        variant="ghost"
                        size="sm"
                        disabled={pendente}
                        onClick={() =>
                           restaurar.mutate({ id: processo.id, autor }, { onSuccess: () => toast.success("Voltou para o original") })
                        }
                     >
                        <RotateCcw className="size-3.5" />
                        Voltar ao original
                     </Button>
                  ) : null}
                  <Button variant="ghost" size="sm" onClick={copiarLink}>
                     <Link2 className="size-3.5" />
                     Copiar link
                  </Button>
                  {processo.origem === "manual" ? (
                     <Button
                        variant="ghost"
                        size="sm"
                        disabled={pendente}
                        className="text-destructive hover:bg-destructive-soft hover:text-destructive"
                        onClick={() =>
                           excluir.mutate(processo.id, {
                              onSuccess: () => {
                                 toast.success("Processo excluído");
                                 onAbrir(null);
                              },
                           })
                        }
                     >
                        <Trash2 className="size-3.5" />
                        Excluir
                     </Button>
                  ) : null}
               </div>
            ) : null}

            <section className="grid gap-2 border-t pt-6">
               <label
                  htmlFor={`nota-${processo.id}`}
                  className="text-[11px] font-semibold uppercase tracking-[0.06em] text-muted-foreground"
               >
                  Registrar uma nota
               </label>
               <Textarea
                  id={`nota-${processo.id}`}
                  rows={3}
                  value={nota}
                  onChange={e => setNota(e.target.value)}
                  placeholder="Ex.: aguardando a lista de turmas da CAS para seguir."
               />
               <div className="flex justify-end">
                  <Button size="sm" variant="secondary" onClick={registrarNota} disabled={!nota.trim() || adicionarNota.isPending}>
                     <Send className="size-3.5" />
                     Registrar nota
                  </Button>
               </div>
            </section>

            <Historico registros={processo.historico} />
         </div>
      </div>
   );
}

function Historico({ registros }: { registros: Registro[] }) {
   if (!registros.length) {
      return (
         <p className="text-xs text-muted-foreground">
            Nenhum registro ainda. Mudanças de status, notas e ajustes aparecem aqui com data e autor.
         </p>
      );
   }
   return (
      <section className="grid gap-3">
         <span className="text-[11px] font-semibold uppercase tracking-[0.06em] text-muted-foreground">Histórico</span>
         <ol className="grid gap-0 divide-y">
            {registros.map(r => (
               <li key={`${r.em}-${r.tipo}`} className="grid gap-1 py-2.5">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                     <span className="tabular">{new Date(r.em).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" })}</span>
                     <span>·</span>
                     <span className="font-medium text-foreground">{r.por}</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-sm">
                     {r.tipo === "status" && r.status ? (
                        <>
                           <span className="text-muted-foreground">mudou o status para</span> <StatusBadge status={r.status} />
                        </>
                     ) : null}
                     {r.texto ? <span>{r.texto}</span> : null}
                  </div>
               </li>
            ))}
         </ol>
      </section>
   );
}
