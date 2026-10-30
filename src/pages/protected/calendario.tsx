import { PageHeader } from "@/components/ui/page-header";
import { Link, useLocation } from "react-router-dom";
import {
   CalendarioMensal,
   ComDados,
   filtrarProcessos,
   FiltrosProcessos,
   useCalendario,
   useFiltrosProcessos,
   useProcessoAberto,
   destinoComContexto,
} from "@/features/calendario";

function Conteudo() {
   const { visao, hoje } = useCalendario();
   const { filtros } = useFiltrosProcessos();
   const { abrir } = useProcessoAberto();
   const { search } = useLocation();
   if (!visao) return null;
   const lista = filtrarProcessos(visao.processos, filtros);
   const semData = lista.filter(p => p.prazoTipo !== "data").length;
   return (
      <div className="grid gap-3">
         <p className="text-xs leading-relaxed text-muted-foreground">
            Os filtros se aplicam aos processos. Eventos acadêmicos, rematrícula e feriados seguem visíveis.
         </p>
         <CalendarioMensal processos={lista} eventos={visao.eventos} hoje={hoje} onAbrir={abrir} />
         {semData ? (
            <p className="text-sm text-muted-foreground">
               {semData} processos sem data ou contínuos não ocupam dias no calendário.{" "}
               <Link className="font-medium text-primary underline underline-offset-4" to={destinoComContexto("/processos", search)}>
                  Consultar na lista
               </Link>
            </p>
         ) : null}
      </div>
   );
}

export default function CalendarioPage() {
   return (
      <div className="space-y-4">
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
