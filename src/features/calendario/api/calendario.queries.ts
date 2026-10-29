/**
 * Leitura do calendário. Uma única consulta traz tudo (são poucas centenas de
 * itens); as visões por setor, mês ou urgência são derivadas em memória.
 */
import { calendarioKeys } from "@/features/calendario/api/calendario.keys";
import { calendarioRepositorio } from "@/features/calendario/api/calendario.repository";
import { useQuery } from "@tanstack/react-query";

export function useDadosCalendario() {
   return useQuery({
      queryKey: calendarioKeys.dados(),
      queryFn: () => calendarioRepositorio.carregar(),
      staleTime: 30_000,
   });
}
