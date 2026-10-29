/**
 * Filtros da lista de processos: moram na URL para poder compartilhar
 * ("olha só os atrasados da Curadoria") e sobreviver a um refresh.
 */
import type { FiltrosProcessos, Processo, Urgencia } from "@/features/calendario/types/calendario.schema";
import { useDebouncedCallback } from "@/hooks/use-debounced-callback";
import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";

function lista(valor: string | null): string[] {
   return valor ? valor.split(",").filter(Boolean) : [];
}

function semAcento(texto: string): string {
   return texto
      .normalize("NFD")
      .replace(/\p{Diacritic}/gu, "")
      .toLowerCase();
}

export function filtrarProcessos(processos: Processo[], filtros: FiltrosProcessos): Processo[] {
   const termo = semAcento(filtros.busca.trim());
   return processos.filter(p => {
      if (filtros.setores.length && !p.responsaveis.some(r => filtros.setores.includes(r))) return false;
      if (filtros.blocos.length && !filtros.blocos.includes(p.bloco)) return false;
      if (filtros.urgencias.length && !filtros.urgencias.includes(p.urgencia)) return false;
      if (termo) {
         const texto = semAcento([p.id, p.nome, p.nomeTecnico ?? "", p.entregavel, p.subprocesso?.nome ?? ""].join(" "));
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
      }),
      [params],
   );

   const definir = useCallback(
      (chave: "setor" | "etapa" | "situacao", valores: string[]) => {
         setParams(prev => {
            const next = new URLSearchParams(prev);
            if (valores.length) next.set(chave, valores.join(","));
            else next.delete(chave);
            return next;
         });
      },
      [setParams],
   );

   const setBusca = useDebouncedCallback((busca: string) => {
      setParams(prev => {
         const next = new URLSearchParams(prev);
         if (busca) next.set("busca", busca);
         else next.delete("busca");
         return next;
      });
   }, 250);

   const limpar = useCallback(() => {
      setParams(prev => {
         const next = new URLSearchParams();
         const processo = prev.get("processo");
         if (processo) next.set("processo", processo);
         return next;
      });
   }, [setParams]);

   const ativos = filtros.setores.length + filtros.blocos.length + filtros.urgencias.length + (filtros.busca ? 1 : 0);

   return {
      filtros,
      ativos,
      setBusca,
      setSetores: (v: string[]) => definir("setor", v),
      setBlocos: (v: string[]) => definir("etapa", v),
      setUrgencias: (v: Urgencia[]) => definir("situacao", v),
      limpar,
   };
}
