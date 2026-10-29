/**
 * Visão pronta do calendário: junta os dados com o que os setores registraram
 * e calcula status e urgência para a data de hoje (ou a data simulada).
 */
import { useDadosCalendario } from "@/features/calendario/api/calendario.queries";
import { hojeIso } from "@/features/calendario/lib/datas";
import { compararPorPrazo, montarProcesso } from "@/features/calendario/lib/prazo";
import { usePreferenciasStore } from "@/features/calendario/stores/preferencias.store";
import type { Evento, Processo } from "@/features/calendario/types/calendario.schema";
import { useMemo } from "react";

export function useHoje(): string {
   const dataSimulada = usePreferenciasStore(s => s.dataSimulada);
   return dataSimulada ?? hojeIso();
}

export function useCalendario() {
   const query = useDadosCalendario();
   const hoje = useHoje();

   const visao = useMemo(() => {
      const dados = query.data;
      if (!dados) return null;
      const processos = dados.processos.map(p => montarProcesso(p, dados.estados[p.id], hoje)).sort(compararPorPrazo);
      const processoPorId = new Map<string, Processo>(processos.map(p => [p.id, p]));
      const eventoPorId = new Map<string, Evento>(dados.eventos.map(e => [e.id, e]));
      /** Quem depende de cada processo (o inverso de `antecessor`). */
      const dependentes = new Map<string, Processo[]>();
      for (const p of processos) {
         if (!p.antecessor) continue;
         dependentes.set(p.antecessor, [...(dependentes.get(p.antecessor) ?? []), p]);
      }
      return {
         processos,
         processoPorId,
         eventoPorId,
         dependentes,
         eventos: dados.eventos,
         janelas: dados.janelas,
         decisoes: dados.decisoes,
      };
   }, [query.data, hoje]);

   return { ...query, hoje, visao };
}
