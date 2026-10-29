/**
 * API PÚBLICA do slice `calendario`.
 * Páginas e outras features importam SOMENTE daqui (regra validada pelo ESLint).
 */
export { useApagarRegistros } from "@/features/calendario/api/calendario.mutations";
export { BannerDataSimulada } from "@/features/calendario/components/banner-data-simulada";
export { ComDados } from "@/features/calendario/components/com-dados";
export { CalendarioMensal } from "@/features/calendario/components/calendario-mensal";
export { DependenciaTag, PrazoPropostoTag, SetorChip, Setores, StatusBadge, UrgenciaBadge } from "@/features/calendario/components/badges";
export { FiltrosProcessos } from "@/features/calendario/components/filtros-processos";
export { LinhaDoTempo } from "@/features/calendario/components/linha-do-tempo";
export { ListaProcessos, type Agrupamento } from "@/features/calendario/components/lista-processos";
export { MeuPainel } from "@/features/calendario/components/meu-painel";
export { NovoProcessoDialog } from "@/features/calendario/components/novo-processo-dialog";
export { PontosAtencao } from "@/features/calendario/components/pontos-atencao";
export { ProcessoLinha } from "@/features/calendario/components/processo-linha";
export { ProcessoPainel } from "@/features/calendario/components/processo-painel";
export { SeletorSetor } from "@/features/calendario/components/seletor-setor";
export { VisaoSetores } from "@/features/calendario/components/visao-setores";
export {
   BLOCOS,
   DEPENDENCIA_DICA,
   DEPENDENCIA_LABEL,
   FERIADOS_2027,
   JANELAS_REMATRICULA,
   nomeBloco,
   nomeSetor,
   SETORES,
   STATUS_DICA,
   STATUS_LABEL,
   URGENCIA_LABEL,
} from "@/features/calendario/data/catalogo";
export { useCalendario, useHoje } from "@/features/calendario/hooks/use-calendario";
export { filtrarProcessos, useFiltrosProcessos } from "@/features/calendario/hooks/use-filtros-processos";
export { useProcessoAberto } from "@/features/calendario/hooks/use-processo-aberto";
export { dataCurta, dataPorExtenso, diaMes, diasEntre, intervalo } from "@/features/calendario/lib/datas";
export { baixarCsv, processosParaCsv } from "@/features/calendario/lib/exportar";
export { doSetor, resumir } from "@/features/calendario/lib/prazo";
export { usePreferenciasStore } from "@/features/calendario/stores/preferencias.store";
export type { Evento, Processo, Status, Urgencia } from "@/features/calendario/types/calendario.schema";
