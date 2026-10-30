import { Link, useLocation } from "react-router-dom";

import { PageHeader } from "@/components/ui/page-header";
import {
   ComDados,
   filtrarProcessos,
   FiltrosProcessos,
   LinhaDoTempo,
   useCalendario,
   useFiltrosProcessos,
   useProcessoAberto,
   contextoConsulta,
} from "@/features/calendario";

function Conteudo() {
   const { visao, hoje } = useCalendario();
   const { filtros } = useFiltrosProcessos();
   const { abrir } = useProcessoAberto();
   const { search } = useLocation();
   if (!visao) return null;
   const lista = filtrarProcessos(visao.processos, filtros);
   const semData = lista.filter(p => p.prazoTipo !== "data").length;
   const contextoSemData = contextoConsulta(search);
   contextoSemData.set("situacao", "sem-data,continuo");
   return (
      <div className="grid gap-4">
         <p className="text-xs leading-relaxed text-muted-foreground">
            Os filtros se aplicam aos processos. Eventos acadêmicos e rematrícula seguem visíveis. Cada ponto representa um prazo; os
            números reúnem prazos próximos na escala atual.
         </p>
         <LinhaDoTempo processos={lista} eventos={visao.eventos} hoje={hoje} onAbrir={abrir} />
         {semData ? (
            <p className="text-sm text-muted-foreground">
               {semData} processos sem data ou contínuos não aparecem aqui.{" "}
               <Link to={`/processos?${contextoSemData}`} className="font-medium text-primary hover:underline">
                  Ver a lista
               </Link>
            </p>
         ) : null}
      </div>
   );
}

export default function LinhaDoTempoPage() {
   return (
      <div className="space-y-4">
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
