/**
 * Datas em pt-BR. Todas as datas do calendário são "datas de parede"
 * (AAAA-MM-DD, sem fuso): convertemos sempre para meia-noite local.
 */
import { differenceInCalendarDays, format, isValid, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

export function paraData(iso: string): Date {
   return parseISO(iso);
}

export function paraIso(data: Date): string {
   return format(data, "yyyy-MM-dd");
}

export function hojeIso(agora: Date = new Date()): string {
   return paraIso(agora);
}

/** 17/11/2026 */
export function dataCurta(iso: string | null | undefined): string {
   if (!iso) return "—";
   const d = paraData(iso);
   return isValid(d) ? format(d, "dd/MM/yyyy") : iso;
}

/** 17/11 */
export function diaMes(iso: string): string {
   return format(paraData(iso), "dd/MM");
}

/** ter, 17 de nov. */
export function dataComSemana(iso: string): string {
   return format(paraData(iso), "EEE, d 'de' MMM", { locale: ptBR });
}

/** terça-feira, 17 de novembro de 2026 */
export function dataPorExtenso(iso: string): string {
   return format(paraData(iso), "EEEE, d 'de' MMMM 'de' yyyy", { locale: ptBR });
}

/** novembro de 2026 */
export function mesAno(data: Date): string {
   return format(data, "MMMM 'de' yyyy", { locale: ptBR });
}

/** nov/26 */
export function mesAbreviado(data: Date): string {
   return format(data, "MMM/yy", { locale: ptBR });
}

export function diasEntre(deIso: string, ateIso: string): number {
   return differenceInCalendarDays(paraData(ateIso), paraData(deIso));
}

/** "hoje", "amanhã", "em 5 dias", "há 3 dias" */
export function distanciaEmDias(dias: number): string {
   if (dias === 0) return "hoje";
   if (dias === 1) return "amanhã";
   if (dias === -1) return "ontem";
   if (dias > 1) return `em ${dias} dias`;
   return `há ${Math.abs(dias)} dias`;
}

export function intervalo(inicio: string, fim: string | null): string {
   if (!fim || fim === inicio) return dataCurta(inicio);
   return `${diaMes(inicio)} a ${dataCurta(fim)}`;
}
