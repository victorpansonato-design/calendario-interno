/**
 * Dados iniciais do calendário (seed). Quando a API existir, estes dados passam a vir dela.
 * Fonte: aba Janelas Críticas da planilha v1 (28/10/2026).
 */
import type { JanelaCritica } from "@/features/calendario/types/calendario.schema";

export const JANELAS_SEED: JanelaCritica[] = [
   {
      id: "JC-01",
      tipo: "Regra D-7 inexequível",
      ponto: "Prova complementar do 1º bimestre EaD (07/04) a 3 dias do fim da prova oficial (03/04)",
      evidencia:
         "A prova oficial encerra no sábado 03/04 e a complementar inicia na quarta 07/04. Restam 2 dias úteis (05 e 06/04), e 06/04 é o próprio início do 2º módulo. O D-7 da complementar cairia em 31/03, antes do fim da prova oficial.",
      impacto:
         "A confirmação de notas, a identificação dos elegíveis e a liberação automática da complementar não cabem em 7 dias. Erro de liberação atinge diretamente o aluno abaixo da média.",
      recomendacao:
         "Tratar a janela como SLA em horas, não em dias: fechar as regras de apuração e o roteiro de liberação automática até o D-7 do evento ANTECESSOR (23/03) e reservar 05 e 06/04 exclusivamente para processamento e conferência, sem concorrência com a virada do 2º módulo.",
   },
   {
      id: "JC-02",
      tipo: "Regra D-7 inexequível",
      ponto: "Prova complementar do 1º módulo semipresencial (21/04) a 4 dias do fim da prova oficial (17/04), com feriado no primeiro dia da janela",
      evidencia:
         "A prova oficial encerra em 17/04 e a complementar inicia em 21/04, que é Tiradentes. A janela efetiva de aplicação passa a ser 22 a 26/04, e só há 2 dias úteis de processamento (19 e 20/04).",
      impacto: "Além do processamento comprimido, há risco de aluno comparecer em 21/04 por leitura literal do calendário publicado.",
      recomendacao:
         "Antecipar a apuração para o D-7 da prova oficial (06/04) e comunicar explicitamente, no calendário e nos canais de atendimento, que a janela efetiva começa em 22/04.",
   },
   {
      id: "JC-03",
      tipo: "Regra D-7 inexequível",
      ponto: "Prova complementar do 2º bimestre EaD e Digital (09/06) a 4 dias do fim da prova oficial (05/06)",
      evidencia:
         "A prova oficial encerra em 05/06 e a complementar inicia em 09/06. Restam 2 dias úteis (07 e 08/06). O D-7 da complementar cairia em 02/06, em plena semana de prova oficial.",
      impacto:
         "Mesma exposição da JC-01, agravada pela concomitância com a P2 presencial (31/05 a 10/06) e pela substitutiva de Ed. Física e Eng. de Controle (08 a 10/06).",
      recomendacao:
         "Fixar o roteiro de apuração e liberação no D-7 da prova oficial (25/05) e proteger 07 e 08/06 como janela exclusiva de processamento, com escala dedicada em Curadoria e TI.",
   },
   {
      id: "JC-04",
      tipo: "Regra D-7 inexequível",
      ponto: "Prova complementar do 2º módulo semipresencial (23/06) a 4 dias do fim da prova oficial (19/06)",
      evidencia:
         "A prova oficial encerra no sábado 19/06 e a complementar inicia na quarta 23/06. Restam 2 dias úteis (21 e 22/06), que coincidem com o início da semana de recuperação presencial (21 a 25/06).",
      impacto:
         "Três ciclos de avaliação disputam a mesma equipe de Assistentes de Coordenação e a mesma estrutura de salas na mesma semana.",
      recomendacao:
         "Antecipar as listas de recuperação do semipresencial para o D-7 da prova oficial (08/06) e separar fisicamente a operação da recuperação presencial da operação do semipresencial nessa semana.",
   },
   {
      id: "JC-05",
      tipo: "Risco de capacidade",
      ponto: "A semana que antecede a P2 tem apenas 3 dias úteis para os cursos presenciais",
      evidencia:
         "A P2 inicia em 31/05. O D-7 é 24/05, e a semana de 24 a 28/05 perde 27/05 (Corpus Christi) e 28/05 (emenda, exclusiva dos presenciais). Restam 24, 25 e 26/05.",
      impacto:
         "Emissão de atas, impressão, identificação e montagem de malotes de duas semanas de prova em três dias úteis. É o ponto de maior pressão de todo o ciclo nos Assistentes de Coordenação.",
      recomendacao:
         "Puxar a impressão e a identificação (D1.08) para 17/05 em vez de 21/05 e tratar a montagem de malotes como entrega escalonada por prédio, iniciando em 20/05.",
   },
   {
      id: "JC-06",
      tipo: "Sobreposição de ciclos",
      ponto: "O 2º módulo inicia em 06/04, dentro da segunda semana da P1 presencial (29/03 a 09/04)",
      evidencia:
         "O D-7 do início do 2º módulo é 30/03, que coincide com o primeiro dia útil da P1 e com o início da prova oficial EaD (30/03 a 03/04).",
      impacto:
         "Curadoria, CAS e TI precisam executar simultaneamente a aplicação de três ciclos de avaliação e a virada do 2º módulo. É a janela com maior concentração de dependências do semestre.",
      recomendacao:
         "Antecipar a configuração e a liberação do 2º módulo (C1.03, C1.04, C1.08) para a semana de 22 a 26/03, antes do início das provas, deixando 30/03 apenas para conferência final.",
   },
   {
      id: "JC-07",
      tipo: "Janela apertada",
      ponto: "A semana de recuperação presencial (21/06) depende das notas da P2, que encerra em 10/06",
      evidencia:
         "O D-7 da recuperação é 14/06. Entre o fim da P2 (10/06) e esse prazo há apenas 2 dias úteis (11/06 e 14/06) para lançar notas, apurar médias e consolidar a relação de alunos em recuperação.",
      impacto:
         "Atraso no lançamento de notas por qualquer coordenação desloca a produção das provas de recuperação para dentro da própria semana de aplicação.",
      recomendacao:
         "Estabelecer prazo contratual de lançamento de notas em até 48 horas após a aplicação de cada prova da P2, com apuração parcial progressiva, em vez de apuração única após 10/06.",
   },
   {
      id: "JC-08",
      tipo: "Exceção formal à regra D-7",
      ponto: "Nos cursos presenciais intensivos, sala e prédio são comunicados um dia antes da prova",
      evidencia:
         "O calendário oficial determina que a sala e o prédio das avaliações de sábado (24/04, 15/05, 19/06 e 26/06) sejam enviados em D-1.",
      impacto:
         "A regra institucional sobrepõe-se à regra D-7 apenas na comunicação. Se a reserva do espaço também for feita em D-1, não há margem para contingência.",
      recomendacao:
         "Separar formalmente os dois atos: a reserva do espaço (B5.01, D5.01) permanece em D-7 e apenas a comunicação ao aluno (B5.04) ocorre em D-1.",
   },
   {
      id: "JC-09",
      tipo: "Premissa a validar",
      ponto: "O D-30 do início das aulas cai dentro do recesso institucional de fim de ano",
      evidencia:
         "O início das aulas em 01/02 e 02/02 coloca o D-30 em 02/01/2027, um sábado precedido pelo feriado de 01/01 e pelo recesso presumido de 24/12 a 01/01.",
      impacto:
         "Todos os marcos de fechamento de matrícula e rematrícula foram antecipados para 23/12/2026. Se o recesso tiver outra data, todo o bloco 1 se desloca.",
      recomendacao:
         "Confirmar com a Mantenedora a janela exata do recesso 2026-2027 e, se houver plantão, decidir formalmente quais marcos podem ocorrer nele.",
   },
   {
      id: "JC-10",
      tipo: "Risco de capacidade",
      ponto: "A segunda semana letiva tem apenas 2 dias úteis por causa do Carnaval",
      evidencia: "As aulas iniciam em 01 e 02/02 e a semana de 08 a 12/02 perde 08, 09 e 10/02 (Carnaval e Quarta-feira de Cinzas).",
      impacto:
         "O primeiro ciclo de ajustes de matrícula, troca de turno, enturmação de retardatários e correção de acesso concentra-se em 2 dias úteis, com fila acumulada de 4 dias.",
      recomendacao:
         "Reforçar a escala de Suporte ao Aluno, CAS e TI Suporte em 11 e 12/02 e antecipar a comunicação de autosserviço (secretaria virtual) para a primeira semana.",
   },
   {
      id: "JC-11",
      tipo: "Sobreposição de ciclos",
      ponto: "O planejamento de 2027-2 ocorre dentro do pico de avaliação de 2027-1",
      evidencia:
         "A revisão de matrizes e a abertura da rematrícula de 2027-2 vencem em 01/06 e o planejamento da oferta em 15/06, exatamente entre a P2 (31/05 a 10/06) e a prova oficial do semipresencial (15 a 19/06).",
      impacto: "Processos Acadêmicos, Curadoria, CAS e Suporte ao Aluno operam dois ciclos ao mesmo tempo, com a mesma equipe.",
      recomendacao:
         "Decidir explicitamente a prioridade entre os dois ciclos nessa janela e, se possível, antecipar a revisão de matrizes de 2027-2 para maio, antes do início da P2.",
   },
   {
      id: "JC-12",
      tipo: "Dependência externa",
      ponto: "As provas presenciais do EaD e do semipresencial dependem da capacidade dos polos parceiros",
      evidencia:
         "Os ingressantes de 2026 e 2027 do EaD e todos os ingressantes do semipresencial fazem prova presencial na sede ou nos polos, com agendamento pelo aplicativo ou pelo AVA.",
      impacto:
         "A capacidade de salas, a escala de aplicadores e a logística de malotes nos polos não estão sob controle direto da IES e não aparecem nas cadeias de processos vigentes dos 14 setores do núcleo.",
      recomendacao:
         "Formalizar com a Gestão de Polos Parceiros um SLA de confirmação de capacidade em D-14 e de confirmação de escala em D-10, e incorporar esses marcos ao calendário operacional da próxima versão.",
   },
];
