/**
 * Escrita do calendário. Toda mutação invalida a consulta principal: a tela
 * se atualiza sozinha, sem copiar dados para estado local.
 */
import { calendarioKeys } from "@/features/calendario/api/calendario.keys";
import { calendarioRepositorio } from "@/features/calendario/api/calendario.repository";
import type { Ajuste, DecisaoJanela, ProcessoInput, Status } from "@/features/calendario/types/calendario.schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";

function useInvalidar() {
   const queryClient = useQueryClient();
   return () => queryClient.invalidateQueries({ queryKey: calendarioKeys.all });
}

export function useMudarStatus() {
   const invalidar = useInvalidar();
   return useMutation({
      mutationFn: (v: { id: string; status: Status; autor: string; nota?: string }) =>
         calendarioRepositorio.mudarStatus(v.id, v.status, v.autor, v.nota),
      onSuccess: invalidar,
   });
}

export function useAdicionarNota() {
   const invalidar = useInvalidar();
   return useMutation({
      mutationFn: (v: { id: string; texto: string; autor: string }) => calendarioRepositorio.adicionarNota(v.id, v.texto, v.autor),
      onSuccess: invalidar,
   });
}

export function useAjustarProcesso() {
   const invalidar = useInvalidar();
   return useMutation({
      mutationFn: (v: { id: string; ajuste: Ajuste; autor: string; resumo: string }) =>
         calendarioRepositorio.ajustar(v.id, v.ajuste, v.autor, v.resumo),
      onSuccess: invalidar,
   });
}

export function useRestaurarOriginal() {
   const invalidar = useInvalidar();
   return useMutation({
      mutationFn: (v: { id: string; autor: string }) => calendarioRepositorio.restaurarOriginal(v.id, v.autor),
      onSuccess: invalidar,
   });
}

export function useCriarProcesso() {
   const invalidar = useInvalidar();
   return useMutation({
      mutationFn: (v: { processo: ProcessoInput; autor: string }) => calendarioRepositorio.criarProcesso(v.processo, v.autor),
      onSuccess: invalidar,
   });
}

export function useExcluirProcessoCriado() {
   const invalidar = useInvalidar();
   return useMutation({
      mutationFn: (id: string) => calendarioRepositorio.excluirProcessoCriado(id),
      onSuccess: invalidar,
   });
}

export function useSalvarDecisao() {
   const invalidar = useInvalidar();
   return useMutation({
      mutationFn: (v: { id: string; decisao: Omit<DecisaoJanela, "atualizadoEm"> }) => calendarioRepositorio.salvarDecisao(v.id, v.decisao),
      onSuccess: invalidar,
   });
}

export function useApagarRegistros() {
   const invalidar = useInvalidar();
   return useMutation({
      mutationFn: () => calendarioRepositorio.apagarTudo(),
      onSuccess: invalidar,
   });
}
