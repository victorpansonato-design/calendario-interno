import { Plus } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import { ComDados, dataPorExtenso, MeuPainel, nomeSetor, NovoProcessoDialog, useHoje, usePreferenciasStore } from "@/features/calendario";

export default function PainelPage() {
   const meuSetor = usePreferenciasStore(s => s.meuSetor);
   const hoje = useHoje();
   const [novo, setNovo] = useState(false);

   return (
      <div className="space-y-8">
         <PageHeader
            eyebrow="Calendário operacional · Graduação 2027-1"
            title={meuSetor ? nomeSetor(meuSetor) : "Visão geral"}
            description={`O que precisa da atenção ${meuSetor ? "do seu setor" : "de todos os setores"} hoje, ${dataPorExtenso(hoje)}.`}
            actions={
               <Button onClick={() => setNovo(true)}>
                  <Plus className="size-4" />
                  <span className="hidden sm:inline">Incluir processo</span>
               </Button>
            }
         />
         <ComDados>
            <MeuPainel />
         </ComDados>
         <NovoProcessoDialog open={novo} onOpenChange={setNovo} />
      </div>
   );
}
