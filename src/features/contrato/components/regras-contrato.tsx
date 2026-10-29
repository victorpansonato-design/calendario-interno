/**
 * Página de referência do novo contrato de EAD e híbrido, em linguagem simples,
 * com uma consulta rápida e os processos do calendário que colocam a regra em prática.
 */
import { Ban, CheckCircle2, FileSignature, Repeat, Scale, ShieldCheck, Undo2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

import { Segmented } from "@/components/core/segmented";
import { Callout } from "@/components/ui/callout";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ProcessoLinha, useCalendario, useProcessoAberto } from "@/features/calendario";
import { ENTRADAS, listarModulos, modulosDoConcluinte, regraDaEntrada, type NumeroEntrada } from "@/features/contrato/lib/regras-contrato";
import { emphasis } from "@/lib/motion";
import { cn } from "@/lib/utils";

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

function Regra({
   icon: Icon,
   titulo,
   children,
}: {
   icon: React.ComponentType<{ className?: string }>;
   titulo: string;
   children: React.ReactNode;
}) {
   return (
      <li className="flex gap-3 rounded-xl border bg-card p-4 shadow-sm">
         <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-primary-soft text-primary" aria-hidden>
            <Icon className="size-4" />
         </span>
         <div>
            <p className="text-sm font-medium">{titulo}</p>
            <p className="mt-0.5 text-sm leading-relaxed text-muted-foreground">{children}</p>
         </div>
      </li>
   );
}

function ModuloPilulas({ ativos }: { ativos: NumeroEntrada[] }) {
   return (
      <div className="flex gap-1.5" aria-label={`Módulos carregados: ${listarModulos(ativos)}`}>
         {ENTRADAS.map(m => {
            const ativo = ativos.includes(m);
            return (
               <motion.span
                  key={m}
                  layout
                  initial={false}
                  animate={{ opacity: ativo ? 1 : 0.35, scale: ativo ? 1 : 0.94 }}
                  transition={{ duration: 0.22, ease: emphasis }}
                  className={cn(
                     "grid size-9 place-items-center rounded-lg font-mono text-sm font-medium",
                     ativo ? "bg-primary text-primary-foreground" : "border border-dashed text-muted-foreground",
                  )}
               >
                  {m}
               </motion.span>
            );
         })}
      </div>
   );
}

function ConsultaRapida() {
   const [tipo, setTipo] = useState<"novo" | "concluinte">("novo");
   const [entrada, setEntrada] = useState<NumeroEntrada>(1);
   const [restantes, setRestantes] = useState<NumeroEntrada>(2);
   const regra = regraDaEntrada(entrada);
   const modulosConcluinte = modulosDoConcluinte(restantes);
   const opcoesNumero = ENTRADAS.map(n => ({ value: String(n), label: `${n}ª` }));

   return (
      <div className="grid gap-5 rounded-xl border bg-card p-5 shadow-sm">
         <Segmented
            layoutId="consulta-tipo"
            ariaLabel="Tipo de aluno"
            value={tipo}
            onChange={setTipo}
            opcoes={[
               { value: "novo", label: "Aluno novo" },
               { value: "concluinte", label: "Aluno concluindo o curso" },
            ]}
         />
         <AnimatePresence mode="wait" initial={false}>
            {tipo === "novo" ? (
               <motion.div
                  key="novo"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.18 }}
                  className="grid gap-4"
               >
                  <div className="flex flex-wrap items-center gap-3">
                     <span className="text-sm text-muted-foreground">Entrou na</span>
                     <Segmented
                        layoutId="consulta-entrada"
                        ariaLabel="Entrada do aluno"
                        size="sm"
                        value={String(entrada)}
                        onChange={v => setEntrada(Number(v) as NumeroEntrada)}
                        opcoes={opcoesNumero}
                     />
                     <span className="text-sm text-muted-foreground">entrada</span>
                  </div>
                  <dl className="grid gap-4 sm:grid-cols-3">
                     <div>
                        <dt className="text-[11px] font-semibold uppercase tracking-[0.06em] text-muted-foreground">Contrato inicial</dt>
                        <dd className="mt-1 font-display text-2xl">{regra.duracaoMeses} meses</dd>
                        <dd className="text-xs text-muted-foreground">
                           Código {regra.codigo} ·{" "}
                           {regra.viradaEmJaneiro === "renovação" ? "renovação no janeiro seguinte" : "reajuste em janeiro"}
                        </dd>
                     </div>
                     <div className="sm:col-span-2">
                        <dt className="text-[11px] font-semibold uppercase tracking-[0.06em] text-muted-foreground">
                           Módulos que carregamos
                        </dt>
                        <dd className="mt-2">
                           <ModuloPilulas ativos={regra.modulos} />
                        </dd>
                        <dd className="mt-1.5 text-xs text-muted-foreground">Módulos {listarModulos(regra.modulos)} do ano.</dd>
                     </div>
                  </dl>
               </motion.div>
            ) : (
               <motion.div
                  key="concluinte"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.18 }}
                  className="grid gap-4"
               >
                  <div className="flex flex-wrap items-center gap-3">
                     <span className="text-sm text-muted-foreground">Faltam</span>
                     <Segmented
                        layoutId="consulta-restantes"
                        ariaLabel="Entradas que faltam para concluir"
                        size="sm"
                        value={String(restantes)}
                        onChange={v => setRestantes(Number(v) as NumeroEntrada)}
                        opcoes={ENTRADAS.map(n => ({ value: String(n), label: String(n) }))}
                     />
                     <span className="text-sm text-muted-foreground">{restantes === 1 ? "entrada" : "entradas"} para concluir</span>
                  </div>
                  <dl className="grid gap-4 sm:grid-cols-3">
                     <div>
                        <dt className="text-[11px] font-semibold uppercase tracking-[0.06em] text-muted-foreground">Contrato</dt>
                        <dd className="mt-1 font-display text-xl">Proporcional</dd>
                        <dd className="text-xs text-muted-foreground">ao período que falta, e não de 12 meses</dd>
                     </div>
                     <div className="sm:col-span-2">
                        <dt className="text-[11px] font-semibold uppercase tracking-[0.06em] text-muted-foreground">
                           Na rematrícula de janeiro, carregamos
                        </dt>
                        <dd className="mt-2">
                           <ModuloPilulas ativos={modulosConcluinte} />
                        </dd>
                        <dd className="mt-1.5 text-xs text-muted-foreground">Módulos {listarModulos(modulosConcluinte)}.</dd>
                     </div>
                  </dl>
               </motion.div>
            )}
         </AnimatePresence>
      </div>
   );
}

export function RegrasContrato() {
   const { visao } = useCalendario();
   const { abrir } = useProcessoAberto();
   const ligados = (visao?.processos ?? []).filter(p => p.bloco === "contrato" || p.id === "R.02");

   return (
      <div className="grid gap-10">
         <div className="grid gap-3 lg:grid-cols-2">
            <Callout tone="success" icon={ShieldCheck} title="Modelo aprovado pelo Jurídico">
               Vale para matrículas e rematrículas de EAD e híbrido.
            </Callout>
            <Callout tone="info" icon={Scale} title="Presencial: sem mudança">
               Continua com renovação semestral e reajuste em janeiro.
            </Callout>
         </div>

         <Secao titulo="Consulta rápida" dica="Escolha o caso para ver a duração do contrato e quais módulos carregar.">
            <ConsultaRapida />
         </Secao>

         <Secao
            titulo="Contrato inicial das matrículas novas"
            dica="Valor proporcional e duração definida pela entrada do aluno. As quatro entradas do ano são lançadas de uma vez."
         >
            <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
               <Table>
                  <TableHeader>
                     <TableRow>
                        <TableHead className="pl-4">Entrada</TableHead>
                        <TableHead>Código</TableHead>
                        <TableHead>Duração do contrato</TableHead>
                        <TableHead>Em janeiro</TableHead>
                        <TableHead className="pr-4">Módulos carregados</TableHead>
                     </TableRow>
                  </TableHeader>
                  <TableBody>
                     {ENTRADAS.map(n => {
                        const r = regraDaEntrada(n);
                        return (
                           <TableRow key={n}>
                              <TableCell className="pl-4 font-medium">{n}ª entrada</TableCell>
                              <TableCell className="font-mono tabular">{r.codigo}</TableCell>
                              <TableCell className="tabular">{r.duracaoMeses} meses</TableCell>
                              <TableCell>{r.viradaEmJaneiro === "renovação" ? "Renovação" : "Reajuste"}</TableCell>
                              <TableCell className="pr-4">{listarModulos(r.modulos)}</TableCell>
                           </TableRow>
                        );
                     })}
                  </TableBody>
               </Table>
            </div>
         </Secao>

         <Secao titulo="Regras gerais">
            <ul className="grid gap-3 md:grid-cols-2">
               <Regra icon={Repeat} titulo="Rematrícula">
                  Toda rematrícula de EAD e híbrido tem reajuste em janeiro, seja qual for a entrada. Só o contrato inicial muda conforme a
                  entrada.
               </Regra>
               <Regra icon={FileSignature} titulo="Reanálise por dispensa de disciplina">
                  O aluno que entrou no primeiro período e passou por reanálise recebe um novo contrato, que passa a ser o válido, com as
                  mesmas regras.
               </Regra>
               <Regra icon={CheckCircle2} titulo="Conclusão de curso">
                  Quem conclui no início do ano (por exemplo, até março ou abril) recebe contrato proporcional ao período restante, e não de
                  12 meses.
               </Regra>
               <Regra icon={Undo2} titulo="Alunos no modelo antigo">
                  Recebem o novo formato na rematrícula de janeiro de 2027, com reajuste em janeiro. Casos de discordância são tratados um a
                  um.
               </Regra>
            </ul>
         </Secao>

         <Secao titulo="Ajustes de sistema (TI Sistemas)">
            <ul className="grid gap-3 md:grid-cols-3">
               <Regra icon={Ban} titulo="Sem assinatura e pagamento, não segue">
                  Na rematrícula anual, o aluno não continua no curso enquanto não assinar o contrato e pagar.
               </Regra>
               <Regra icon={Ban} titulo="Sem contrato manual">
                  As equipes de atendimento não geram contratos manualmente.
               </Regra>
               <Regra icon={Repeat} titulo="Só reenvio">
                  O atendimento pode apenas reenviar o contrato que já foi gerado.
               </Regra>
            </ul>
         </Secao>

         <Secao titulo="Processos do calendário ligados ao contrato" dica="Abra cada um para ver prazo, responsável e status.">
            <div className="divide-y overflow-hidden rounded-xl border bg-card shadow-sm">
               {ligados.map(p => (
                  <ProcessoLinha key={p.id} processo={p} onAbrir={abrir} />
               ))}
            </div>
         </Secao>
      </div>
   );
}
