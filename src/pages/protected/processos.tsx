import { Download, Plus, SearchX } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Segmented } from "@/components/core/segmented";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import {
   baixarCsv,
   ComDados,
   filtrarProcessos,
   FiltrosProcessos,
   ListaProcessos,
   NovoProcessoDialog,
   processosParaCsv,
   useCalendario,
   useFiltrosProcessos,
   useHoje,
   useProcessoAberto,
   type Agrupamento,
} from "@/features/calendario";

function Conteudo({ agrupamento }: { agrupamento: Agrupamento }) {
   const { visao } = useCalendario();
   const { filtros, limpar } = useFiltrosProcessos();
   const { abrir } = useProcessoAberto();
   if (!visao) return null;
   const lista = filtrarProcessos(visao.processos, filtros);
   if (!lista.length) {
      return (
         <EmptyState
            icon={SearchX}
            title="Nenhum processo encontrado"
            hint="Tente outro termo de busca ou tire algum filtro."
            actions={
               <Button variant="outline" size="sm" onClick={limpar}>
                  Limpar filtros
               </Button>
            }
         />
      );
   }
   return <ListaProcessos processos={lista} agrupamento={agrupamento} onAbrir={abrir} />;
}

export default function ProcessosPage() {
   const [agrupamento, setAgrupamento] = useState<Agrupamento>("mes");
   const [novo, setNovo] = useState(false);
   const { visao } = useCalendario();
   const { filtros } = useFiltrosProcessos();
   const hoje = useHoje();
   const total = visao?.processos.length ?? 0;
   const filtrados = visao ? filtrarProcessos(visao.processos, filtros) : [];

   function exportar() {
      baixarCsv(`processos-calendario-2027-1-${hoje}.csv`, processosParaCsv(filtrados));
      toast.success("Planilha gerada", { description: `${filtrados.length} processos exportados com os filtros atuais.` });
   }

   return (
      <div className="space-y-6">
         <PageHeader
            eyebrow="Calendário operacional · Graduação 2027-1"
            title="Processos"
            description="Tudo o que cada setor precisa entregar no semestre. Clique em um processo para ver os detalhes, mudar o status ou registrar uma nota."
            meta={<span className="tabular">{total} processos no calendário</span>}
            actions={
               <div className="flex items-center gap-2">
                  <Button variant="outline" onClick={exportar} disabled={!filtrados.length}>
                     <Download className="size-4" />
                     <span className="hidden sm:inline">Exportar</span>
                  </Button>
                  <Button onClick={() => setNovo(true)}>
                     <Plus className="size-4" />
                     <span className="hidden sm:inline">Incluir processo</span>
                  </Button>
               </div>
            }
         />
         <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <FiltrosProcessos />
            <div className="flex items-center gap-3">
               <span className="text-xs text-muted-foreground tabular">
                  {filtrados.length} de {total}
               </span>
               <Segmented
                  layoutId="agrupar-processos"
                  ariaLabel="Agrupar por"
                  size="sm"
                  value={agrupamento}
                  onChange={setAgrupamento}
                  opcoes={[
                     { value: "mes", label: "Por mês" },
                     { value: "etapa", label: "Por etapa" },
                     { value: "setor", label: "Por setor" },
                  ]}
               />
            </div>
         </div>
         <ComDados>
            <Conteudo agrupamento={agrupamento} />
         </ComDados>
         <NovoProcessoDialog open={novo} onOpenChange={setNovo} />
      </div>
   );
}
