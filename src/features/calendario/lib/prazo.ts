/**
 * Regras de prazo: transforma o processo bruto + o que o setor registrou
 * em uma visão pronta para a tela (status, urgência, dias para o prazo).
 * Funções puras: fáceis de testar e iguais no front e, no futuro, no backend.
 */
import { diasEntre } from "@/features/calendario/lib/datas";
import type { EstadoProcesso, Processo, ProcessoInput, Status, Urgencia } from "@/features/calendario/types/calendario.schema";

export const DIAS_ESTA_SEMANA = 7;
export const DIAS_PROXIMOS = 30;

export function calcularUrgencia(status: Status, prazoTipo: ProcessoInput["prazoTipo"], diasParaPrazo: number | null): Urgencia {
   if (status === "concluido") return "concluido";
   if (status === "bloqueado") return "bloqueado";
   if (prazoTipo === "continuo") return "continuo";
   if (prazoTipo === "sem-data" || diasParaPrazo === null) return "sem-data";
   if (diasParaPrazo < 0) return "atrasado";
   if (diasParaPrazo <= DIAS_ESTA_SEMANA) return "esta-semana";
   if (diasParaPrazo <= DIAS_PROXIMOS) return "proximo";
   return "no-prazo";
}

export function montarProcesso(base: ProcessoInput, estado: EstadoProcesso | undefined, hoje: string): Processo {
   const ajuste = estado?.ajuste ?? null;
   const atual: ProcessoInput = ajuste ? { ...base, ...ajuste } : base;
   const status: Status = estado?.status ?? "a-fazer";
   const diasParaPrazo = atual.prazoTipo === "data" && atual.prazo ? diasEntre(hoje, atual.prazo) : null;

   return {
      ...atual,
      status,
      urgencia: calcularUrgencia(status, atual.prazoTipo, diasParaPrazo),
      diasParaPrazo,
      alterado: ajuste !== null && Object.keys(ajuste).length > 0,
      original: base,
      historico: estado?.historico ?? [],
   };
}

/** Ordem natural de leitura: atrasados, depois por prazo, sem data por último. */
export function compararPorPrazo(a: Processo, b: Processo): number {
   const peso = (p: Processo) => (p.prazoTipo === "data" && p.prazo ? 0 : p.prazoTipo === "sem-data" ? 1 : 2);
   const pa = peso(a);
   const pb = peso(b);
   if (pa !== pb) return pa - pb;
   if (a.prazo && b.prazo && a.prazo !== b.prazo) return a.prazo < b.prazo ? -1 : 1;
   return a.id.localeCompare(b.id, "pt-BR", { numeric: true });
}

export interface Resumo {
   total: number;
   concluidos: number;
   atrasados: number;
   estaSemana: number;
   proximos: number;
   emAndamento: number;
   travados: number;
   semData: number;
   percentualConcluido: number;
}

export function resumir(processos: Processo[]): Resumo {
   const r: Resumo = {
      total: processos.length,
      concluidos: 0,
      atrasados: 0,
      estaSemana: 0,
      proximos: 0,
      emAndamento: 0,
      travados: 0,
      semData: 0,
      percentualConcluido: 0,
   };
   for (const p of processos) {
      if (p.status === "concluido") r.concluidos += 1;
      if (p.status === "em-andamento") r.emAndamento += 1;
      if (p.urgencia === "atrasado") r.atrasados += 1;
      if (p.urgencia === "esta-semana") r.estaSemana += 1;
      if (p.urgencia === "proximo") r.proximos += 1;
      if (p.urgencia === "bloqueado") r.travados += 1;
      if (p.prazoTipo === "sem-data") r.semData += 1;
   }
   r.percentualConcluido = r.total ? Math.round((r.concluidos / r.total) * 100) : 0;
   return r;
}

export function doSetor(processos: Processo[], setorId: string | null): Processo[] {
   if (!setorId) return processos;
   return processos.filter(p => p.responsaveis.includes(setorId));
}
