/**
 * Contratos do calendário interno.
 *
 * Zod é a fonte única da verdade: os tipos usados na tela, no formulário de
 * "novo processo" e na leitura do armazenamento derivam daqui. Quando a API
 * existir, as mesmas validações protegem a resposta do backend.
 */
import { z } from "zod";

const DataIso = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Use o formato AAAA-MM-DD");

/** Situação de trabalho que o setor informa. */
export const STATUS = ["a-fazer", "em-andamento", "concluido", "bloqueado"] as const;
export const StatusSchema = z.enum(STATUS);
export type Status = z.infer<typeof StatusSchema>;

/** Como o processo se relaciona com o evento acadêmico. */
export const DependenciaSchema = z.enum(["trava", "paralela", "continua"]);
export type Dependencia = z.infer<typeof DependenciaSchema>;

/** data = prazo fixo · continuo = rotina do semestre todo · sem-data = ainda vai ser definido. */
export const PrazoTipoSchema = z.enum(["data", "continuo", "sem-data"]);
export type PrazoTipo = z.infer<typeof PrazoTipoSchema>;

export const OrigemSchema = z.enum([
   "planilha-v1",
   "organograma-2026",
   "diretriz-contrato",
   "diretriz-bianca",
   "ajuste-rematricula",
   "manual",
]);
export type Origem = z.infer<typeof OrigemSchema>;

export const ProcessoInputSchema = z.object({
   id: z.string().min(1),
   /** Nome simples, usado em toda a interface. */
   nome: z.string().min(1),
   /** Nome técnico original da planilha (rastreabilidade com as cadeias de processos). */
   nomeTecnico: z.string().nullable(),
   bloco: z.string().min(1),
   /** Ids de setor (ver `setores.ts`). */
   responsaveis: z.array(z.string()).min(1),
   prazo: DataIso.nullable(),
   prazoTipo: PrazoTipoSchema,
   /** Prazo sugerido que ainda precisa de confirmação. */
   prazoProposto: z.boolean(),
   /** Quando não há data exata: texto curto ("Na rematrícula de janeiro"). */
   quando: z.string().nullable(),
   ajusteData: z.string().nullable(),
   dependencia: DependenciaSchema,
   antecessor: z.string().nullable(),
   eventoId: z.string().nullable(),
   diasAntesEvento: z.number().int().nullable(),
   formatos: z.string(),
   entregavel: z.string(),
   subprocesso: z.object({ codigo: z.string(), nome: z.string() }).nullable(),
   origem: OrigemSchema,
   observacao: z.string().nullable(),
   canais: z.array(z.string()),
});
export type ProcessoInput = z.infer<typeof ProcessoInputSchema>;

export const EventoSchema = z.object({
   id: z.string(),
   nome: z.string(),
   inicio: DataIso,
   fim: DataIso.nullable(),
   formatos: z.string(),
   fonte: z.string(),
   tipo: z.enum(["academico", "rematricula"]),
   /** Quantos processos da planilha v1 apontam para este evento. */
   marcosNaPlanilha: z.number().int().nullable(),
});
export type Evento = z.infer<typeof EventoSchema>;

export const JanelaCriticaSchema = z.object({
   id: z.string(),
   tipo: z.string(),
   ponto: z.string(),
   evidencia: z.string(),
   impacto: z.string(),
   recomendacao: z.string(),
});
export type JanelaCritica = z.infer<typeof JanelaCriticaSchema>;

// ---------------------------------------------------------------------------
// Estado editável (o que cada setor registra)
// ---------------------------------------------------------------------------

export const RegistroSchema = z.object({
   em: z.string(),
   por: z.string(),
   tipo: z.enum(["status", "nota", "edicao", "criacao"]),
   texto: z.string(),
   /** Novo status, quando `tipo` = "status". */
   status: StatusSchema.optional(),
});
export type Registro = z.infer<typeof RegistroSchema>;

/** Campos que podem ser ajustados sem perder o valor original. */
export const AjusteSchema = z.object({
   nome: z.string().min(1).optional(),
   prazo: DataIso.nullable().optional(),
   prazoTipo: PrazoTipoSchema.optional(),
   quando: z.string().nullable().optional(),
   responsaveis: z.array(z.string()).min(1).optional(),
   entregavel: z.string().optional(),
});
export type Ajuste = z.infer<typeof AjusteSchema>;

export const EstadoProcessoSchema = z.object({
   status: StatusSchema,
   ajuste: AjusteSchema.nullable(),
   historico: z.array(RegistroSchema),
});
export type EstadoProcesso = z.infer<typeof EstadoProcessoSchema>;

export const DecisaoJanelaSchema = z.object({
   situacao: z.enum(["pendente", "decidido"]),
   responsavel: z.string(),
   decisao: z.string(),
   atualizadoEm: z.string().nullable(),
});
export type DecisaoJanela = z.infer<typeof DecisaoJanelaSchema>;

export const ArmazenamentoSchema = z.object({
   versao: z.literal(1),
   estados: z.record(z.string(), EstadoProcessoSchema),
   criados: z.array(ProcessoInputSchema),
   decisoes: z.record(z.string(), DecisaoJanelaSchema),
});
export type Armazenamento = z.infer<typeof ArmazenamentoSchema>;

// ---------------------------------------------------------------------------
// Visão pronta para a tela
// ---------------------------------------------------------------------------

/** Urgência calculada a partir do prazo e do status (nunca salva). */
export type Urgencia = "concluido" | "bloqueado" | "atrasado" | "esta-semana" | "proximo" | "no-prazo" | "continuo" | "sem-data";

export type Processo = ProcessoInput & {
   status: Status;
   urgencia: Urgencia;
   /** Dias até o prazo (negativo = atrasado). `null` sem data. */
   diasParaPrazo: number | null;
   alterado: boolean;
   original: ProcessoInput;
   historico: Registro[];
};

// ---------------------------------------------------------------------------
// Formulário "novo processo"
// ---------------------------------------------------------------------------

export const NovoProcessoSchema = z
   .object({
      nome: z.string().trim().min(5, "Escreva o que precisa ser feito (mínimo 5 letras)"),
      responsaveis: z.array(z.string()).min(1, "Escolha pelo menos um setor"),
      bloco: z.string().min(1, "Escolha a etapa do semestre"),
      temData: z.boolean(),
      prazo: z.string().optional(),
      quando: z.string().trim().optional(),
      dependencia: DependenciaSchema,
      eventoId: z.string().optional(),
      entregavel: z.string().trim().min(5, "Diga o que precisa estar pronto no fim"),
      observacao: z.string().trim().optional(),
   })
   .refine(v => !v.temData || (v.prazo && /^\d{4}-\d{2}-\d{2}$/.test(v.prazo)), {
      message: "Informe a data do prazo",
      path: ["prazo"],
   });
export type NovoProcessoInput = z.infer<typeof NovoProcessoSchema>;

/** Filtros de lista: vivem na URL. */
export interface FiltrosProcessos {
   busca: string;
   setores: string[];
   blocos: string[];
   urgencias: Urgencia[];
}
