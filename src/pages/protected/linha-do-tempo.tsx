import { Link } from "react-router-dom";

import { PageHeader } from "@/components/ui/page-header";
import {
   ComDados,
   filtrarProcessos,
   FiltrosProcessos,
   LinhaDoTempo,
   useCalendario,
   useFiltrosProcessos,
   useProcessoAberto,
} from "@/features/calendario";

function Conteudo() {
   const { visao, hoje } = useCalendario();
   const { filtros } = useFiltrosProcessos();
   const { abrir } = useProcessoAberto();
   if (!visao) return null;
   const lista = filtrarProcessos(visao.processos, filtros);
   const semData = lista.filter(p => p.prazoTipo !== "data").length;
   return (
      <div className="grid gap-4">
         <LinhaDoTempo processos={lista} eventos={visao.eventos} hoje={hoje} onAbrir={abrir} />
         {semData ? (
            <p className="text-sm text-muted-foreground">
               {semData} processos sem data ou contínuos não aparecem aqui.{" "}
               <Link to="/processos?situacao=sem-data,continuo" className="font-medium text-primary hover:underline">
                  Ver a lista
               </Link>
            </p>
         ) : null}
      </div>
   );
}

export default function LinhaDoTempoPage() {
   return (
      <div className="space-y-6">
         <PageHeader
            eyebrow="Calendário operacional · Graduação 2027-1"
            title="Linha do tempo"
            description="Cada linha é um setor e cada ponto é um prazo. Use para ver quem está carregado em cada semana e o que cada entrega está preparando no calendário acadêmico."
         />
         <FiltrosProcessos />
         <ComDados>
            <Conteudo />
         </ComDados>
      </div>
   );
}
