import { PageHeader } from "@/components/ui/page-header";
import { ComDados } from "@/features/calendario";
import { PainelRematricula } from "@/features/rematricula";

export default function RematriculaPage() {
   return (
      <div className="space-y-8">
         <PageHeader
            eyebrow="Ciclo 2027-1"
            title="Rematrícula"
            description="Janelas por modalidade, o passo a passo que se repete todo ano e o que cada setor precisa fazer."
         />
         <ComDados>
            <PainelRematricula />
         </ComDados>
      </div>
   );
}
