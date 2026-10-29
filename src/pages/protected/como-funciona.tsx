import { FlaskConical, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Callout } from "@/components/ui/callout";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/ui/page-header";
import {
   DEPENDENCIA_DICA,
   DEPENDENCIA_LABEL,
   STATUS_DICA,
   STATUS_LABEL,
   StatusBadge,
   UrgenciaBadge,
   useApagarRegistros,
   usePreferenciasStore,
   type Status,
   type Urgencia,
} from "@/features/calendario";

const URGENCIAS: { u: Urgencia; texto: string }[] = [
   { u: "atrasado", texto: "Passou do prazo e ainda não foi concluído." },
   { u: "esta-semana", texto: "Vence nos próximos 7 dias." },
   { u: "proximo", texto: "Vence entre 8 e 30 dias." },
   { u: "no-prazo", texto: "Vence daqui a mais de 30 dias." },
   { u: "sem-data", texto: "Ainda não tem data: precisa ser definida pelo setor." },
   { u: "continuo", texto: "Rotina que acontece o semestre todo." },
];

const GLOSSARIO: { termo: string; significado: string }[] = [
   { termo: "Lyceum", significado: "Sistema acadêmico onde ficam a grade, o período letivo, as matrículas e as notas." },
   { termo: "AVA", significado: "Ambiente Virtual de Aprendizagem (D2L), onde ficam as disciplinas EaD, híbridas e digitais." },
   { termo: "CAS", significado: "Central Acadêmica de Serviços." },
   { termo: "Enturmação", significado: "Colocar cada aluno na sua turma." },
   { termo: "Ensalamento", significado: "Definir a sala de cada turma." },
   { termo: "Malote", significado: "Pacote com as provas impressas e as atas, entregue para a aplicação." },
   { termo: "Blip", significado: "Canal usado para disparar mensagens aos alunos." },
   { termo: "Metabase", significado: "Painel usado para acompanhar as metas de rematrícula." },
   { termo: "SPTrans", significado: "Cadastro do transporte estudantil dos alunos." },
   { termo: "Entrada", significado: "Cada uma das 4 janelas de ingresso do ano no EAD e no híbrido." },
   {
      termo: "Evento acadêmico",
      significado: "Data do calendário dos alunos (início das aulas, provas, recuperação) que os processos preparam.",
   },
];

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

function SimularData() {
   const dataSimulada = usePreferenciasStore(s => s.dataSimulada);
   const setDataSimulada = usePreferenciasStore(s => s.setDataSimulada);
   const [valor, setValor] = useState(dataSimulada ?? "2027-01-20");

   return (
      <div className="grid gap-3 rounded-xl border bg-card p-5 shadow-sm">
         <div className="flex items-start gap-3">
            <FlaskConical className="mt-0.5 size-4 text-muted-foreground" aria-hidden />
            <div>
               <p className="text-sm font-medium">Simular outra data</p>
               <p className="text-sm text-muted-foreground">
                  Para testar como o sistema vai se comportar no meio do semestre. Atrasos e “vence em 7 dias” passam a ser calculados para
                  a data escolhida.
               </p>
            </div>
         </div>
         <div className="flex flex-wrap items-center gap-2">
            <Input type="date" value={valor} onChange={e => setValor(e.target.value)} className="w-44" aria-label="Data para simular" />
            <Button size="sm" onClick={() => (setDataSimulada(valor || null), toast.success("Simulação ativada"))} disabled={!valor}>
               Simular
            </Button>
            {dataSimulada ? (
               <Button size="sm" variant="ghost" onClick={() => setDataSimulada(null)}>
                  Voltar para hoje
               </Button>
            ) : null}
         </div>
      </div>
   );
}

function ApagarRegistros() {
   const [aberto, setAberto] = useState(false);
   const apagar = useApagarRegistros();
   return (
      <div className="flex flex-col gap-3 rounded-xl border bg-card p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
         <div>
            <p className="text-sm font-medium">Apagar os registros deste navegador</p>
            <p className="text-sm text-muted-foreground">
               Volta tudo ao estado inicial: status, notas, ajustes, processos incluídos e decisões.
            </p>
         </div>
         <Button
            variant="outline"
            className="text-destructive hover:bg-destructive-soft hover:text-destructive"
            onClick={() => setAberto(true)}
         >
            <Trash2 className="size-4" />
            Apagar registros
         </Button>
         <Dialog open={aberto} onOpenChange={setAberto}>
            <DialogContent>
               <DialogHeader>
                  <DialogTitle>Apagar todos os registros?</DialogTitle>
                  <DialogDescription>
                     Isso não pode ser desfeito. Só afeta este navegador: nada é apagado para as outras pessoas.
                  </DialogDescription>
               </DialogHeader>
               <DialogFooter>
                  <Button variant="ghost" onClick={() => setAberto(false)}>
                     Cancelar
                  </Button>
                  <Button
                     variant="destructive"
                     onClick={() =>
                        apagar.mutate(undefined, {
                           onSuccess: () => {
                              setAberto(false);
                              toast.success("Registros apagados");
                           },
                        })
                     }
                  >
                     Apagar
                  </Button>
               </DialogFooter>
            </DialogContent>
         </Dialog>
      </div>
   );
}

export default function ComoFuncionaPage() {
   return (
      <div className="space-y-10">
         <PageHeader
            eyebrow="Ajuda"
            title="Como funciona"
            description="Para que serve o calendário interno, como ler cada tela e de onde vêm os dados."
         />

         <Callout tone="warning" title="Esta é uma versão de teste, só com a parte visual">
            Ainda não há servidor: o que você registra (status, notas, ajustes, processos incluídos) fica salvo só neste navegador e não
            aparece para as outras pessoas. A próxima etapa, com o TI, é ligar o sistema a uma API, ao login da intranet e ao calendário dos
            alunos.
         </Callout>

         <Secao titulo="Para que serve">
            <div className="max-w-3xl space-y-3 text-sm leading-relaxed text-muted-foreground">
               <p>
                  O calendário dos alunos diz <strong className="text-foreground">quando</strong> cada coisa acontece. Este calendário
                  mostra <strong className="text-foreground">o que cada setor precisa ter pronto antes</strong> para que aconteça do jeito
                  certo.
               </p>
               <p>
                  Cada processo tem um setor responsável, um prazo e o que precisa estar pronto no fim. Quando um setor atualiza o status,
                  todo mundo enxerga se a entrega está andando, travada ou concluída.
               </p>
            </div>
         </Secao>

         <Secao titulo="Situação do prazo" dica="Calculada sozinha a partir do prazo e do status.">
            <ul className="grid gap-2 sm:grid-cols-2">
               {URGENCIAS.map(({ u, texto }) => (
                  <li key={u} className="flex items-center gap-3 rounded-xl border bg-card px-4 py-3 shadow-sm">
                     <UrgenciaBadge urgencia={u} />
                     <span className="text-sm text-muted-foreground">{texto}</span>
                  </li>
               ))}
            </ul>
         </Secao>

         <Secao titulo="Status do setor" dica="Quem atualiza é o setor responsável, no painel de cada processo.">
            <ul className="grid gap-2 sm:grid-cols-2">
               {(Object.keys(STATUS_LABEL) as Status[]).map(s => (
                  <li key={s} className="flex items-center gap-3 rounded-xl border bg-card px-4 py-3 shadow-sm">
                     <StatusBadge status={s} />
                     <span className="text-sm text-muted-foreground">{STATUS_DICA[s]}</span>
                  </li>
               ))}
            </ul>
         </Secao>

         <Secao titulo="Regras do calendário">
            <ul className="grid gap-2">
               <li className="rounded-xl border bg-card px-4 py-3 text-sm shadow-sm">
                  <strong>Tudo pronto 7 dias antes.</strong>{" "}
                  <span className="text-muted-foreground">
                     A última entrega de cada processo termina 7 dias corridos antes do evento acadêmico.
                  </span>
               </li>
               <li className="rounded-xl border bg-card px-4 py-3 text-sm shadow-sm">
                  <strong>Etapas anteriores com mais antecedência.</strong>{" "}
                  <span className="text-muted-foreground">
                     O que vem antes começa de 10 a 76 dias antes do evento, conforme o tempo que cada trabalho leva.
                  </span>
               </li>
               <li className="rounded-xl border bg-card px-4 py-3 text-sm shadow-sm">
                  <strong>Fim de semana e feriado antecipam o prazo.</strong>{" "}
                  <span className="text-muted-foreground">Se o prazo cai num dia sem expediente, ele passa para o dia útil anterior.</span>
               </li>
               <li className="rounded-xl border bg-card px-4 py-3 text-sm shadow-sm">
                  <strong>Exceção do presencial intensivo.</strong>{" "}
                  <span className="text-muted-foreground">
                     A sala e o prédio da prova de sábado são avisados ao aluno 1 dia antes. A reserva da sala continua 7 dias antes.
                  </span>
               </li>
               {(["trava", "paralela", "continua"] as const).map(d => (
                  <li key={d} className="rounded-xl border bg-card px-4 py-3 text-sm shadow-sm">
                     <strong>{DEPENDENCIA_LABEL[d]}.</strong> <span className="text-muted-foreground">{DEPENDENCIA_DICA[d]}</span>
                  </li>
               ))}
            </ul>
         </Secao>

         <Secao titulo="Glossário">
            <dl className="grid gap-x-8 gap-y-3 rounded-xl border bg-card p-5 shadow-sm sm:grid-cols-2">
               {GLOSSARIO.map(g => (
                  <div key={g.termo}>
                     <dt className="text-sm font-medium">{g.termo}</dt>
                     <dd className="text-sm text-muted-foreground">{g.significado}</dd>
                  </div>
               ))}
            </dl>
         </Secao>

         <Secao titulo="De onde vêm os dados">
            <ul className="grid gap-2 text-sm">
               <li className="rounded-xl border bg-card px-4 py-3 shadow-sm">
                  <strong>Calendário Administrativo Operacional 2027-1</strong>{" "}
                  <span className="text-muted-foreground">
                     (Escritório de Processos, versão 1 de 28/10/2026): 168 processos em 14 setores, ligados às cadeias de processos
                     vigentes.
                  </span>
               </li>
               <li className="rounded-xl border bg-card px-4 py-3 shadow-sm">
                  <strong>Calendários acadêmicos do 1º semestre de 2027</strong>{" "}
                  <span className="text-muted-foreground">(Diretoria de Graduação): eventos acadêmicos e feriados.</span>
               </li>
               <li className="rounded-xl border bg-card px-4 py-3 shadow-sm">
                  <strong>Organograma da rematrícula 2026.</strong>{" "}
                  <span className="text-muted-foreground">Os passos da rematrícula, que se repetem em 2027 com novas datas.</span>
               </li>
               <li className="rounded-xl border bg-card px-4 py-3 shadow-sm">
                  <strong>Diretrizes de 29/10/2026.</strong>{" "}
                  <span className="text-muted-foreground">
                     Janelas de rematrícula por modalidade, novo contrato de EAD e híbrido, Metabase, conferência dos cards vitrine e
                     limpeza de ficha no fim da rematrícula.
                  </span>
               </li>
            </ul>
            <p className="px-1 text-xs text-muted-foreground">
               Os nomes dos processos foram simplificados. O nome técnico original continua em “Detalhes técnicos e origem”, dentro de cada
               processo.
            </p>
         </Secao>

         <Secao titulo="Ferramentas de teste">
            <div className="grid gap-3">
               <SimularData />
               <ApagarRegistros />
            </div>
         </Secao>
      </div>
   );
}
