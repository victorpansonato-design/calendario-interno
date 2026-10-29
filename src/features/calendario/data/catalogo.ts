/**
 * Catálogo fixo: setores, etapas do semestre e os rótulos em linguagem simples.
 * Todo texto que aparece na tela para esses códigos sai daqui.
 */
import type { Dependencia, Origem, PrazoTipo, Status, Urgencia } from "@/features/calendario/types/calendario.schema";

export interface Setor {
   id: string;
   nome: string;
   /** Nome completo ou observação, mostrado como dica. */
   descricao?: string;
   /** Não é um setor de verdade (ex.: "A definir"). */
   especial?: boolean;
}

export const SETORES: Setor[] = [
   { id: "assistentes-coordenacao", nome: "Assistentes de Coordenação" },
   { id: "biblioteca", nome: "Biblioteca", descricao: "Biblioteca e Arquivos" },
   { id: "cas", nome: "CAS", descricao: "Central Acadêmica de Serviços" },
   { id: "comercial-presencial", nome: "Comercial Presencial e Semi" },
   { id: "comercial-ead", nome: "Comercial e Relacionamento EAD" },
   { id: "curadoria", nome: "Curadoria" },
   { id: "estudios", nome: "Estúdios", descricao: "Rádio, Podcast, TV e Fotografia" },
   { id: "financeiro", nome: "Financeiro", descricao: "Contas a Receber" },
   { id: "laboratorios", nome: "Laboratórios" },
   { id: "processos-academicos", nome: "Processos Acadêmicos" },
   { id: "secretaria-geral", nome: "Secretaria Geral", descricao: "Secretaria Geral e Acadêmica" },
   { id: "suporte-aluno", nome: "Suporte ao Aluno" },
   { id: "ti-sistemas", nome: "TI Sistemas", descricao: "Na planilha v1: TI Desenvolvimento" },
   { id: "ti-suporte", nome: "TI Suporte" },
   { id: "marketing", nome: "Marketing", descricao: "Entrou pelo fluxo da rematrícula" },
   { id: "acordos", nome: "Acordos", descricao: "Equipe de cobrança · fluxo da rematrícula" },
   { id: "ti-receptivo", nome: "TI e Receptivo", descricao: "Como aparece no organograma da rematrícula" },
   { id: "todos", nome: "Todos os setores", especial: true },
   { id: "a-definir", nome: "A definir", descricao: "Responsável ainda não definido", especial: true },
];

const SETOR_POR_ID = new Map(SETORES.map(s => [s.id, s]));

export function nomeSetor(id: string): string {
   return SETOR_POR_ID.get(id)?.nome ?? id;
}

export function getSetor(id: string): Setor | undefined {
   return SETOR_POR_ID.get(id);
}

/** Setores que podem ser escolhidos como "meu setor". */
export const SETORES_REAIS = SETORES.filter(s => !s.especial);

export interface Bloco {
   id: string;
   nome: string;
   descricao: string;
}

/** Etapas do semestre, na ordem em que acontecem. */
export const BLOCOS: Bloco[] = [
   { id: "preparacao", nome: "Preparação do semestre", descricao: "Grade, período letivo, materiais e professores." },
   { id: "matricula", nome: "Matrícula e rematrícula", descricao: "Ingresso, rematrícula, fichas e boletos." },
   { id: "rematricula-fluxo", nome: "Fluxo da rematrícula", descricao: "Passos do organograma de rematrícula, que se repetem todo ano." },
   { id: "contrato", nome: "Novo contrato EAD e híbrido", descricao: "Diretriz do contrato com duração pela entrada." },
   { id: "primeiro-dia", nome: "Tudo pronto para o 1º dia", descricao: "AVA, turmas, salas, acessos e acolhimento." },
   { id: "primeiras-semanas", nome: "Ajustes das primeiras semanas", descricao: "Enturmação definitiva e pendências do início." },
   { id: "provas-1", nome: "Provas do 1º bimestre", descricao: "P1, provas EaD e semipresencial e substitutivas." },
   { id: "modulo-2", nome: "2º módulo", descricao: "Virada do 2º módulo e provas intermediárias." },
   { id: "provas-2", nome: "Provas do 2º bimestre", descricao: "P2, provas EaD e semipresencial e substitutivas." },
   { id: "encerramento", nome: "Recuperação e fechamento", descricao: "Recuperação, notas finais, colação e diplomas." },
   { id: "proximo-semestre", nome: "Preparação de 2027-2", descricao: "Grade e rematrícula do próximo semestre." },
   { id: "rotinas", nome: "Rotinas do semestre todo", descricao: "Trabalho contínuo, sem um dia fixo." },
];

const BLOCO_POR_ID = new Map(BLOCOS.map(b => [b.id, b]));

export function nomeBloco(id: string): string {
   return BLOCO_POR_ID.get(id)?.nome ?? id;
}

export const STATUS_LABEL: Record<Status, string> = {
   "a-fazer": "A fazer",
   "em-andamento": "Em andamento",
   concluido: "Concluído",
   bloqueado: "Travado",
};

export const STATUS_DICA: Record<Status, string> = {
   "a-fazer": "Ainda não começou.",
   "em-andamento": "O setor já está trabalhando nisso.",
   concluido: "Entregue e conferido.",
   bloqueado: "Parado esperando outra área ou uma decisão.",
};

export const URGENCIA_LABEL: Record<Urgencia, string> = {
   concluido: "Concluído",
   bloqueado: "Travado",
   atrasado: "Atrasado",
   "esta-semana": "Vence em até 7 dias",
   proximo: "Vence em até 30 dias",
   "no-prazo": "No prazo",
   continuo: "Rotina contínua",
   "sem-data": "Sem data",
};

export const URGENCIA_TOM: Record<Urgencia, "neutral" | "primary" | "success" | "warning" | "danger"> = {
   concluido: "success",
   bloqueado: "danger",
   atrasado: "danger",
   "esta-semana": "warning",
   proximo: "primary",
   "no-prazo": "neutral",
   continuo: "neutral",
   "sem-data": "neutral",
};

export const DEPENDENCIA_LABEL: Record<Dependencia, string> = {
   trava: "Trava o evento",
   paralela: "Pode correr em paralelo",
   continua: "Contínua",
};

export const DEPENDENCIA_DICA: Record<Dependencia, string> = {
   trava: "Se atrasar, o evento acadêmico não acontece como previsto.",
   paralela: "Pode ser feito junto com outros processos da mesma etapa.",
   continua: "Rotina que atravessa o semestre ou vários setores.",
};

export const PRAZO_TIPO_LABEL: Record<PrazoTipo, string> = {
   data: "Com data",
   continuo: "Rotina contínua",
   "sem-data": "Sem data definida",
};

export const ORIGEM_LABEL: Record<Origem, string> = {
   "planilha-v1": "Planilha v1 (Escritório de Processos)",
   "organograma-2026": "Organograma da rematrícula 2026",
   "diretriz-contrato": "Diretriz do novo contrato",
   "diretriz-bianca": "Diretriz de 29/10/2026",
   "ajuste-rematricula": "Ajuste pelas janelas de rematrícula",
   manual: "Incluído no sistema",
};

/** Janelas de rematrícula 2027-1 por modalidade (informadas em 29/10/2026). */
export const JANELAS_REMATRICULA = [
   {
      modalidade: "Presencial",
      inicio: "2026-12-15",
      fimIdeal: "2027-01-31",
      fimProrrogacao: "2027-02-23",
      nota: "Idealmente até 31/01, com prorrogação até 23/02.",
   },
   {
      modalidade: "EaD",
      inicio: "2026-12-15",
      fimIdeal: "2027-02-01",
      fimProrrogacao: "2027-03-02",
      nota: "Até 01/02, com prorrogação até 02/03.",
   },
   {
      modalidade: "Híbrido",
      inicio: "2026-12-15",
      fimIdeal: "2027-02-19",
      fimProrrogacao: null,
      nota: "Até 19/02, sem prorrogação: depois disso o aluno perde encontro presencial.",
   },
] as const;

/** Setores que a planilha v1 deixou fora do escopo. */
export const FORA_DO_ESCOPO = [
   "RH",
   "Compras",
   "Jurídico",
   "Marketing",
   "Serviços Gerais",
   "Procuradoria Institucional",
   "Estágios",
   "Pós-Graduação",
   "Clínicas",
   "NPJ",
   "Contabilidade",
   "Ouvidoria",
   "Gestão de Polos Parceiros",
];

export const PREMISSAS = [
   {
      titulo: "Recesso de fim de ano",
      texto: "A planilha presumiu recesso de 24/12/2026 a 01/01/2027 e antecipou para 23/12 os prazos que caíam nele. Confirmar com a Mantenedora.",
   },
   { titulo: "Início de 2027-2", texto: 'Presumido em agosto de 2027, o que posiciona a etapa "Preparação de 2027-2". Confirmar.' },
   {
      titulo: "Emenda de 28/05",
      texto: "Vale só para os cursos presenciais. Foi tratada como dia sem expediente para os prazos administrativos.",
   },
];

export const FERIADOS_2027 = [
   { data: "2027-01-01", nome: "Confraternização Universal" },
   { data: "2027-02-08", nome: "Carnaval" },
   { data: "2027-02-09", nome: "Carnaval" },
   { data: "2027-02-10", nome: "Quarta-feira de Cinzas" },
   { data: "2027-03-26", nome: "Paixão de Cristo" },
   { data: "2027-03-27", nome: "Sábado de Aleluia" },
   { data: "2027-04-21", nome: "Tiradentes" },
   { data: "2027-05-01", nome: "Dia do Trabalho" },
   { data: "2027-05-27", nome: "Corpus Christi" },
   { data: "2027-05-28", nome: "Emenda de Corpus Christi (só presenciais)" },
];
