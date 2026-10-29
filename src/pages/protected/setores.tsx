import { PageHeader } from "@/components/ui/page-header";
import { ComDados, VisaoSetores } from "@/features/calendario";

export default function SetoresPage() {
   return (
      <div className="space-y-8">
         <PageHeader
            eyebrow="Calendário operacional · Graduação 2027-1"
            title="Por setor"
            description="Como está cada área: quanto já foi concluído, o que está atrasado e qual é o próximo prazo."
         />
         <ComDados>
            <VisaoSetores />
         </ComDados>
      </div>
   );
}
