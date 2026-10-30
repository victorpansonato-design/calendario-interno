/** Somente contexto de consulta: nunca notas, dados de edição ou o detalhe aberto. */
export const CHAVES_FILTROS = ["busca", "setor", "etapa", "situacao", "status"] as const;
const CHAVES_CONTEXTO = [...CHAVES_FILTROS, "mes", "dia", "agrupar", "zoom"];
export const VISOES_PROCESSOS = ["/processos", "/calendario", "/linha-do-tempo"];

export function contextoConsulta(search: string | URLSearchParams): URLSearchParams {
   const origem = new URLSearchParams(search);
   const contexto = new URLSearchParams();
   for (const chave of CHAVES_CONTEXTO) {
      const valor = origem.get(chave);
      if (valor) contexto.set(chave, valor);
   }
   return contexto;
}

export function destinoComContexto(path: string, search: string | URLSearchParams): string {
   const query = contextoConsulta(search).toString();
   return `${path}${query ? `?${query}` : ""}`;
}

export function normalizarBusca(texto: string): string {
   return texto
      .normalize("NFD")
      .replace(/\p{Diacritic}/gu, "")
      .toLowerCase();
}
