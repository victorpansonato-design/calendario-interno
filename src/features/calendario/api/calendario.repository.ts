/**
 * Acesso a dados do calendário.
 *
 * Enquanto o sistema é só front, tudo o que os setores registram (status,
 * notas, ajustes, processos novos e decisões) fica salvo NESTE NAVEGADOR
 * (localStorage). A interface `CalendarioRepositorio` é o ponto de troca:
 * quando o TI criar a API, basta implementar a mesma interface com chamadas
 * HTTP (ver `services/api.ts`) e trocar a instância exportada no fim do arquivo.
 * Nenhum componente precisa mudar.
 */
import { EVENTOS_SEED } from "@/features/calendario/data/eventos.seed";
import { JANELAS_SEED } from "@/features/calendario/data/janelas.seed";
import { PROCESSOS_SEED } from "@/features/calendario/data/processos.seed";
import {
   ArmazenamentoSchema,
   EventoSchema,
   JanelaCriticaSchema,
   ProcessoInputSchema,
   type Ajuste,
   type Armazenamento,
   type DecisaoJanela,
   type EstadoProcesso,
   type Evento,
   type JanelaCritica,
   type ProcessoInput,
   type Registro,
   type Status,
} from "@/features/calendario/types/calendario.schema";
import { z } from "zod";

export interface DadosCalendario {
   processos: ProcessoInput[];
   eventos: Evento[];
   janelas: JanelaCritica[];
   estados: Record<string, EstadoProcesso>;
   decisoes: Record<string, DecisaoJanela>;
}

export interface CalendarioRepositorio {
   carregar(): Promise<DadosCalendario>;
   mudarStatus(id: string, status: Status, autor: string, nota?: string): Promise<void>;
   adicionarNota(id: string, texto: string, autor: string): Promise<void>;
   ajustar(id: string, ajuste: Ajuste, autor: string, resumo: string): Promise<void>;
   restaurarOriginal(id: string, autor: string): Promise<void>;
   criarProcesso(processo: ProcessoInput, autor: string): Promise<void>;
   excluirProcessoCriado(id: string): Promise<void>;
   salvarDecisao(id: string, decisao: Omit<DecisaoJanela, "atualizadoEm">): Promise<void>;
   apagarTudo(): Promise<void>;
}

export const CHAVE_ARMAZENAMENTO = "calendario-interno:v1";

const VAZIO: Armazenamento = { versao: 1, estados: {}, criados: [], decisoes: {} };

// Valida os dados iniciais uma única vez: se alguém editar o seed errado, o erro aparece aqui.
const PROCESSOS_BASE = z.array(ProcessoInputSchema).parse(PROCESSOS_SEED);
const EVENTOS = z.array(EventoSchema).parse(EVENTOS_SEED);
const JANELAS = z.array(JanelaCriticaSchema).parse(JANELAS_SEED);

function registro(tipo: Registro["tipo"], texto: string, autor: string, status?: Status): Registro {
   return { em: new Date().toISOString(), por: autor, tipo, texto, ...(status ? { status } : {}) };
}

export function criarRepositorioLocal(storage: Storage = window.localStorage): CalendarioRepositorio {
   function ler(): Armazenamento {
      try {
         const bruto = storage.getItem(CHAVE_ARMAZENAMENTO);
         if (!bruto) return structuredClone(VAZIO);
         const resultado = ArmazenamentoSchema.safeParse(JSON.parse(bruto));
         return resultado.success ? resultado.data : structuredClone(VAZIO);
      } catch {
         return structuredClone(VAZIO);
      }
   }

   function gravar(dados: Armazenamento) {
      storage.setItem(CHAVE_ARMAZENAMENTO, JSON.stringify(dados));
   }

   function estadoDe(dados: Armazenamento, id: string): EstadoProcesso {
      return dados.estados[id] ?? { status: "a-fazer", ajuste: null, historico: [] };
   }

   function alterar(fn: (dados: Armazenamento) => void) {
      const dados = ler();
      fn(dados);
      gravar(dados);
   }

   return {
      async carregar() {
         const dados = ler();
         return {
            processos: [...PROCESSOS_BASE, ...dados.criados],
            eventos: EVENTOS,
            janelas: JANELAS,
            estados: dados.estados,
            decisoes: dados.decisoes,
         };
      },

      async mudarStatus(id, status, autor, nota) {
         alterar(dados => {
            const estado = estadoDe(dados, id);
            dados.estados[id] = { ...estado, status, historico: [registro("status", nota ?? "", autor, status), ...estado.historico] };
         });
      },

      async adicionarNota(id, texto, autor) {
         alterar(dados => {
            const estado = estadoDe(dados, id);
            dados.estados[id] = { ...estado, historico: [registro("nota", texto, autor), ...estado.historico] };
         });
      },

      async ajustar(id, ajuste, autor, resumo) {
         alterar(dados => {
            const estado = estadoDe(dados, id);
            const criado = dados.criados.findIndex(p => p.id === id);
            if (criado >= 0) {
               // Processo incluído no sistema: o ajuste vira o próprio valor.
               dados.criados[criado] = { ...dados.criados[criado], ...ajuste };
               dados.estados[id] = { ...estado, historico: [registro("edicao", resumo, autor), ...estado.historico] };
               return;
            }
            dados.estados[id] = {
               ...estado,
               ajuste: { ...(estado.ajuste ?? {}), ...ajuste },
               historico: [registro("edicao", resumo, autor), ...estado.historico],
            };
         });
      },

      async restaurarOriginal(id, autor) {
         alterar(dados => {
            const estado = estadoDe(dados, id);
            dados.estados[id] = {
               ...estado,
               ajuste: null,
               historico: [registro("edicao", "Voltou para os dados originais.", autor), ...estado.historico],
            };
         });
      },

      async criarProcesso(processo, autor) {
         const valido = ProcessoInputSchema.parse(processo);
         alterar(dados => {
            dados.criados.push(valido);
            dados.estados[valido.id] = {
               status: "a-fazer",
               ajuste: null,
               historico: [registro("criacao", "Processo incluído no sistema.", autor)],
            };
         });
      },

      async excluirProcessoCriado(id) {
         alterar(dados => {
            dados.criados = dados.criados.filter(p => p.id !== id);
            delete dados.estados[id];
         });
      },

      async salvarDecisao(id, decisao) {
         alterar(dados => {
            dados.decisoes[id] = { ...decisao, atualizadoEm: new Date().toISOString() };
         });
      },

      async apagarTudo() {
         storage.removeItem(CHAVE_ARMAZENAMENTO);
      },
   };
}

export const calendarioRepositorio: CalendarioRepositorio = criarRepositorioLocal();
