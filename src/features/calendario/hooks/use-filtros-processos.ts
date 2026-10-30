/**
 * Filtros da lista de processos: moram na URL para poder compartilhar
 * ("olha só os atrasados da Curadoria") e sobreviver a um refresh.
 */
import type { FiltrosProcessos, Processo, Status, Urgencia } from "@/features/calendario/types/calendario.schema";
import { CHAVES_FILTROS, normalizarBusca } from "@/features/calendario/lib/contexto-navegacao";
import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";

function lista(valor: string | null): string[] {
   return valor ? valor.split(",").filter(Boolean) : [];
}

export function filtrarProcessos(processos: Processo[], filtros: FiltrosProcessos): Processo[] {
   const termo = normalizarBusca(filtros.busca.trim());
   return processos.filter(p => {
      if (filtros.setores.length && !p.responsaveis.some(r => filtros.setores.includes(r))) return false;
      if (filtros.blocos.length && !filtros.blocos.includes(p.bloco)) return false;
      if (filtros.urgencias.length && !filtros.urgencias.includes(p.urgencia)) return false;
      if (filtros.status?.length && !filtros.status.includes(p.status)) return false;
      if (termo) {
         const texto = normalizarBusca([p.id, p.nome, p.nomeTecnico ?? "", p.entregavel, p.subprocesso?.nome ?? ""].join(" "));
         if (!texto.includes(termo)) return false;
      }
      return true;
   });
}

export function useFiltrosProcessos() {
   const [params, setParams] = useSearchParams();

   const filtros = useMemo<FiltrosProcessos>(
      () => ({
         busca: params.get("busca") ?? "",
         setores: lista(params.get("setor")),
         blocos: lista(params.get("etapa")),
         urgencias: lista(params.get("situacao")) as Urgencia[],
         status: lista(params.get("status")) as Status[],
      }),
      [params],
   );

   const definir = useCallback(
      (chave: "setor" | "etapa" | "situacao" | "status", valores: string[]) => {
         setParams(prev => {
            const next = new URLSearchParams(prev);
            if (valores.length) next.set(chave, valores.join(","));
            else next.delete(chave);
            return next;
         });
      },
      [setParams],
   );

   const setBusca = (busca: string) => {
      setParams(
         prev => {
            const next = new URLSearchParams(prev);
            if (busca) next.set("busca", busca);
            else next.delete("busca");
            return next;
         },
         { replace: true },
      );
   };

   const limpar = useCallback(() => {
      setParams(prev => {
         const next = new URLSearchParams(prev);
         for (const chave of CHAVES_FILTROS) next.delete(chave);
         return next;
      });
   }, [setParams]);

   const ativos =
      filtros.setores.length + filtros.blocos.length + filtros.urgencias.length + (filtros.status?.length ?? 0) + (filtros.busca ? 1 : 0);

   return {
      filtros,
      ativos,
      setBusca,
      setSetores: (v: string[]) => definir("setor", v),
      setBlocos: (v: string[]) => definir("etapa", v),
      setUrgencias: (v: Urgencia[]) => definir("situacao", v),
      setStatus: (v: Status[]) => definir("status", v),
      limpar,
   };
}
