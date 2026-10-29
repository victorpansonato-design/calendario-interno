import { PageHeader } from "@/components/ui/page-header";
import { ComDados } from "@/features/calendario";
import { RegrasContrato } from "@/features/contrato";

export default function ContratoPage() {
   return (
      <div className="space-y-8">
         <PageHeader
            eyebrow="Ciclo 2027-1 · EAD e híbrido"
            title="Novo contrato"
            description="Como funciona o contrato com duração pela entrada do aluno, o que muda na rematrícula e o que o sistema precisa bloquear."
         />
         <ComDados>
            <RegrasContrato />
         </ComDados>
      </div>
   );
}
