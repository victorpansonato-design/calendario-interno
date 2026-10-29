import { PageHeader } from "@/components/ui/page-header";
import {
   CalendarioMensal,
   ComDados,
   filtrarProcessos,
   FiltrosProcessos,
   useCalendario,
   useFiltrosProcessos,
   useProcessoAberto,
} from "@/features/calendario";

function Conteudo() {
   const { visao, hoje } = useCalendario();
   const { filtros } = useFiltrosProcessos();
   const { abrir } = useProcessoAberto();
   if (!visao) return null;
   return <CalendarioMensal processos={filtrarProcessos(visao.processos, filtros)} eventos={visao.eventos} hoje={hoje} onAbrir={abrir} />;
}

export default function CalendarioPage() {
   return (
      <div className="space-y-6">
         <PageHeader
            eyebrow="Calendário operacional · Graduação 2027-1"
            title="Calendário"
            description="Os prazos de cada dia, junto com os eventos do calendário acadêmico, as janelas de rematrícula e os feriados."
         />
         <FiltrosProcessos />
         <ComDados>
            <Conteudo />
         </ComDados>
      </div>
   );
}
