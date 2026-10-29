import { PageHeader } from "@/components/ui/page-header";
import { ComDados, PontosAtencao } from "@/features/calendario";

export default function PontosDeAtencaoPage() {
   return (
      <div className="space-y-8">
         <PageHeader
            eyebrow="Checagem do calendário"
            title="Pontos de atenção"
            description="O que ainda depende de decisão, de responsável ou de data para o calendário ficar completo. Resolva por aqui antes de colocar o sistema para rodar."
         />
         <ComDados>
            <PontosAtencao />
         </ComDados>
      </div>
   );
}
