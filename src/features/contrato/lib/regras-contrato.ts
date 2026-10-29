/**
 * Regras do novo contrato de EAD e híbrido (diretriz de 29/10/2026, aprovada pelo Jurídico).
 *
 * O ano tem 4 entradas. As disciplinas do ano são lançadas de uma vez e cada
 * aluno recebe os módulos da sua entrada em diante. O contrato inicial dura
 * o tempo que falta até janeiro, quando todos têm reajuste.
 */
export type NumeroEntrada = 1 | 2 | 3 | 4;

export interface RegraEntrada {
   entrada: NumeroEntrada;
   /** Código usado internamente para a entrada. */
   codigo: string;
   duracaoMeses: number;
   viradaEmJaneiro: "renovação" | "reajuste";
   modulos: NumeroEntrada[];
}

export const ENTRADAS: NumeroEntrada[] = [1, 2, 3, 4];

const CODIGOS: Record<NumeroEntrada, string> = { 1: "21/71", 2: "22/72", 3: "23/73", 4: "24/74" };
const DURACAO: Record<NumeroEntrada, number> = { 1: 12, 2: 9, 3: 6, 4: 3 };

/** Aluno novo: quem entra na entrada N recebe os módulos N, N+1, ... 4. */
export function regraDaEntrada(entrada: NumeroEntrada): RegraEntrada {
   return {
      entrada,
      codigo: CODIGOS[entrada],
      duracaoMeses: DURACAO[entrada],
      viradaEmJaneiro: entrada === 1 ? "renovação" : "reajuste",
      modulos: ENTRADAS.filter(m => m >= entrada),
   };
}

/** Concluinte: na rematrícula de janeiro, carregar só as entradas que faltam (1 até N). */
export function modulosDoConcluinte(entradasRestantes: NumeroEntrada): NumeroEntrada[] {
   return ENTRADAS.filter(m => m <= entradasRestantes);
}

export function listarModulos(modulos: NumeroEntrada[]): string {
   if (modulos.length === 1) return `só o ${modulos[0]}`;
   return `${modulos.slice(0, -1).join(", ")} e ${modulos[modulos.length - 1]}`;
}
