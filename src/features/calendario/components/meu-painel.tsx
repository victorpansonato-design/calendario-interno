/**
 * Painel de entrada: o que o setor precisa fazer agora, o que vem pela frente
 * e o que está acontecendo no calendário acadêmico.
 */
import { AlertTriangle, CalendarClock, CheckCircle2, Hourglass, ListTodo } from "lucide-react";
import { motion } from "motion/react";
import { Link, useNavigate } from "react-router-dom";

import { StatTile } from "@/components/core/stat-tile";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { ProcessoLinha } from "@/features/calendario/components/processo-linha";
import { SeletorSetor } from "@/features/calendario/components/seletor-setor";
import { nomeSetor } from "@/features/calendario/data/catalogo";
import { useCalendario } from "@/features/calendario/hooks/use-calendario";
import { useProcessoAberto } from "@/features/calendario/hooks/use-processo-aberto";
import { distanciaEmDias, diasEntre, intervalo } from "@/features/calendario/lib/datas";
import { DIAS_PROXIMOS, doSetor, resumir } from "@/features/calendario/lib/prazo";
import { usePreferenciasStore } from "@/features/calendario/stores/preferencias.store";
import type { Processo } from "@/features/calendario/types/calendario.schema";
import { staggerContainer } from "@/lib/motion";

function Bloco({ titulo, dica, acao, children }: { titulo: string; dica?: string; acao?: React.ReactNode; children: React.ReactNode }) {
   return (
      <section className="grid gap-3">
         <header className="flex items-end justify-between gap-3 px-1">
            <div>
               <h2 className="font-display text-[15px] font-medium">{titulo}</h2>
               {dica ? <p className="mt-0.5 text-xs text-muted-foreground">{dica}</p> : null}
            </div>
            {acao}
         </header>
         {children}
      </section>
   );
}

function Lista({ itens, onAbrir }: { itens: Processo[]; onAbrir: (id: string) => void }) {
   return (
      <div className="divide-y overflow-hidden rounded-xl border bg-card shadow-sm">
         {itens.map(p => (
            <ProcessoLinha key={p.id} processo={p} onAbrir={onAbrir} />
         ))}
      </div>
   );
}

export function MeuPainel() {
   const { visao, hoje } = useCalendario();
   const meuSetor = usePreferenciasStore(s => s.meuSetor);
   const { abrir } = useProcessoAberto();
   const navigate = useNavigate();

   if (!visao) return null;

   const meus = doSetor(visao.processos, meuSetor);
   const resumo = resumir(meus);
   const agora = meus.filter(p => p.urgencia === "atrasado" || p.urgencia === "esta-semana" || p.urgencia === "bloqueado");
   const proximos = meus.filter(p => p.urgencia === "proximo");
   const proximoPrazo = meus.find(p => p.urgencia === "proximo" || p.urgencia === "no-prazo");
   const semData = meus.filter(p => p.prazoTipo === "sem-data");
   const eventosAFrente = visao.eventos
      .filter(e => (e.fim ?? e.inicio) >= hoje)
      .sort((a, b) => a.inicio.localeCompare(b.inicio))
      .slice(0, 6);
   const filtroSetor = meuSetor ? `setor=${meuSetor}&` : "";

   const irPara = (situacao: string) => navigate(`/processos?${filtroSetor}situacao=${situacao}`);

   return (
      <div className="grid gap-8">
         {meuSetor ? (
            <div className="flex items-center gap-3 xl:hidden">
               <span className="text-[11px] font-semibold uppercase tracking-[0.06em] text-muted-foreground">Meu setor</span>
               <SeletorSetor compacto className="flex-1" />
            </div>
         ) : null}
         {!meuSetor ? (
            <div className="flex flex-col gap-3 rounded-xl border border-primary/25 bg-primary-soft/60 p-4 sm:flex-row sm:items-center sm:justify-between">
               <div>
                  <p className="text-sm font-medium text-primary">Você está vendo todos os setores.</p>
                  <p className="text-xs text-primary/80">Escolha o seu setor para o painel mostrar só o que é com você.</p>
               </div>
               <SeletorSetor className="sm:w-64" />
            </div>
         ) : null}

         <motion.div variants={staggerContainer} initial="initial" animate="animate" className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <StatTile
               label="Atrasados"
               valor={resumo.atrasados}
               icon={AlertTriangle}
               tom={resumo.atrasados ? "danger" : "neutral"}
               detalhe={resumo.atrasados ? "Passaram do prazo e não foram concluídos" : "Nada atrasado"}
               onClick={() => irPara("atrasado")}
            />
            <StatTile
               label="Vencem em 7 dias"
               valor={resumo.estaSemana}
               icon={CalendarClock}
               tom={resumo.estaSemana ? "warning" : "neutral"}
               detalhe="Prioridade desta semana"
               onClick={() => irPara("esta-semana")}
            />
            <StatTile
               label="Em andamento"
               valor={resumo.emAndamento}
               icon={Hourglass}
               detalhe={`${resumo.travados} travado(s)`}
               onClick={() => navigate(`/processos?${filtroSetor}status=em-andamento`)}
            />
            <StatTile
               label="Concluídos"
               valor={`${resumo.percentualConcluido}%`}
               icon={CheckCircle2}
               tom={resumo.percentualConcluido === 100 ? "success" : "neutral"}
               detalhe={`${resumo.concluidos} de ${resumo.total} processos`}
               onClick={() => irPara("concluido")}
            />
         </motion.div>

         <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_340px]">
            <div className="grid content-start gap-8">
               <Bloco titulo="Para resolver agora" dica="Atrasados, travados e o que vence nos próximos 7 dias.">
                  {agora.length ? (
                     <Lista itens={agora} onAbrir={abrir} />
                  ) : (
                     <EmptyState
                        size="sm"
                        icon={CheckCircle2}
                        title="Nada urgente por aqui"
                        hint={
                           proximoPrazo && proximoPrazo.diasParaPrazo !== null
                              ? `O próximo prazo ${meuSetor ? `de ${nomeSetor(meuSetor)} ` : ""}é ${proximoPrazo.id} (${proximoPrazo.nome}), ${distanciaEmDias(proximoPrazo.diasParaPrazo)}.`
                              : "Nenhum prazo próximo."
                        }
                        actions={
                           proximoPrazo ? (
                              <Button variant="outline" size="sm" onClick={() => abrir(proximoPrazo.id)}>
                                 Ver o próximo prazo
                              </Button>
                           ) : null
                        }
                     />
                  )}
               </Bloco>

               <Bloco
                  titulo={`Próximos ${DIAS_PROXIMOS} dias`}
                  acao={
                     <Button variant="link" size="sm" onClick={() => navigate(`/processos?${filtroSetor}`)} className="h-auto p-0">
                        Ver todos
                     </Button>
                  }
               >
                  {proximos.length ? (
                     <Lista itens={proximos} onAbrir={abrir} />
                  ) : (
                     <p className="rounded-xl border border-dashed bg-surface px-4 py-6 text-center text-sm text-muted-foreground">
                        Nenhum prazo entre 8 e 30 dias a partir de hoje.
                     </p>
                  )}
               </Bloco>
            </div>

            <div className="grid content-start gap-8">
               <Bloco titulo="No calendário acadêmico" dica="Eventos que os processos estão preparando.">
                  <ol className="divide-y overflow-hidden rounded-xl border bg-card shadow-sm">
                     {eventosAFrente.map(e => {
                        const faltam = diasEntre(hoje, e.inicio);
                        return (
                           <li key={e.id} className="flex items-start gap-3 px-4 py-3">
                              <span
                                 className={`mt-1.5 size-2 shrink-0 rounded-full ${e.tipo === "rematricula" ? "bg-primary" : "bg-accent"}`}
                                 aria-hidden
                              />
                              <div className="min-w-0 flex-1">
                                 <p className="text-[13px] font-medium leading-snug">{e.nome}</p>
                                 <p className="mt-0.5 text-xs text-muted-foreground">
                                    {intervalo(e.inicio, e.fim)} · {faltam > 0 ? distanciaEmDias(faltam) : "acontecendo agora"}
                                 </p>
                              </div>
                           </li>
                        );
                     })}
                  </ol>
               </Bloco>

               {semData.length ? (
                  <Bloco titulo="Ainda sem data" dica="Precisam de data antes de entrar na linha do tempo.">
                     <Link
                        to={`/processos?${filtroSetor}situacao=sem-data`}
                        className="flex items-center gap-3 rounded-xl border bg-card px-4 py-3 shadow-sm transition-colors hover:border-border-strong"
                     >
                        <ListTodo className="size-4 text-muted-foreground" aria-hidden />
                        <span className="flex-1 text-sm">
                           <span className="font-medium tabular">{semData.length}</span> {semData.length === 1 ? "processo" : "processos"}{" "}
                           sem data
                        </span>
                        <span className="text-xs text-primary">Ver</span>
                     </Link>
                  </Bloco>
               ) : null}
            </div>
         </div>
      </div>
   );
}
