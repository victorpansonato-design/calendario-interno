# Calendário Interno · Graduação 2027-1

Sistema interno do Grupo Anchieta que mostra **o que cada setor precisa ter pronto, e quando**, para o calendário acadêmico dos alunos acontecer do jeito certo. Ele junta, num lugar só, os prazos administrativos de todas as áreas, o calendário acadêmico, as janelas de rematrícula e as regras do novo contrato de EAD e híbrido.

> **Versão atual: só front (0.1.0).** Não há servidor ainda. O que cada pessoa registra (status, notas, ajustes, processos incluídos, decisões) fica salvo **no próprio navegador**. A troca para uma API está preparada (veja [Ligando a API](#ligando-a-api)).

Construído sobre o template React Anchieta (React 19, TypeScript, Vite, Tailwind v4, shadcn/ui, TanStack Query, Zustand, Zod e Motion), seguindo a arquitetura por features e o design system do template, com movimentos e controles refinados a partir do design system UniAnchieta.

---

## Como rodar

```bash
npm install
cp .env.example .env.local
npm run dev
```

Abra `http://localhost:5173/calendario-interno/`.

| Comando             | O que faz                                 |
| ------------------- | ----------------------------------------- |
| `npm run dev`       | Servidor de desenvolvimento               |
| `npm test`          | Testes (Vitest)                           |
| `npm run typecheck` | Checagem de tipos                         |
| `npm run lint`      | ESLint, incluindo as regras de camada     |
| `npm run format`    | Prettier (use `format:fix` para corrigir) |
| `npm run build`     | Build de produção em `build/`             |

### Variáveis de ambiente

| Variável         | Padrão                        | Para que serve                                                           |
| ---------------- | ----------------------------- | ------------------------------------------------------------------------ |
| `VITE_BASE_URL`  | `/calendario-interno/`        | Caminho onde o sistema é publicado                                       |
| `VITE_AUTH_MODE` | `demo`                        | `demo` entra sem login (versão só front) · `sso` usa o login da intranet |
| `VITE_API_URL`   | `/calendario-interno/api/v1/` | Base da API (quando existir)                                             |
| `VITE_LOGIN_URL` | intranet                      | Para onde o login redireciona no modo `sso`                              |

---

## Telas

| Tela                  | Rota                 | Para quê                                                                                                                                      |
| --------------------- | -------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| **Meu painel**        | `/painel`            | O que o setor precisa resolver agora (atrasados, travados, vence em 7 dias), o que vem nos próximos 30 dias e os próximos eventos acadêmicos. |
| **Processos**         | `/processos`         | Lista completa com busca e filtros por setor, etapa e situação. Agrupa por mês, etapa ou setor. Exporta CSV.                                  |
| **Linha do tempo**    | `/linha-do-tempo`    | Um setor por linha, um ponto por prazo, com o calendário acadêmico e a rematrícula por cima.                                                  |
| **Calendário**        | `/calendario`        | Mês a mês: prazos por dia, eventos acadêmicos e feriados.                                                                                     |
| **Por setor**         | `/setores`           | Um cartão por área: percentual concluído, atrasados e próximo prazo.                                                                          |
| **Rematrícula**       | `/rematricula`       | Janelas por modalidade, limpeza de ficha, fluxo do organograma e metas de referência.                                                         |
| **Novo contrato**     | `/contrato`          | Regras do contrato de EAD e híbrido com consulta rápida (entrada → duração e módulos).                                                        |
| **Pontos de atenção** | `/pontos-de-atencao` | O que falta decidir ou definir: janelas críticas, responsáveis, prazos a confirmar, itens sem data.                                           |
| **Como funciona**     | `/como-funciona`     | Guia de leitura, regras, glossário, fontes dos dados e ferramentas de teste.                                                                  |

Qualquer processo abre num painel lateral (`?processo=CÓDIGO` na URL, então dá para mandar o link). Nele o setor muda o status (**A fazer, Em andamento, Travado, Concluído**), registra notas, ajusta nome, prazo, responsáveis e entrega (o original continua guardado) e vê o encadeamento com outros processos.

Para testar o comportamento no meio do semestre, use **Como funciona → Simular outra data**.

---

## De onde vêm os dados

| Fonte                                                                                  | O que alimenta                                                                   |
| -------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| Calendário Administrativo Operacional 2027-1 (Escritório de Processos, v1, 28/10/2026) | 168 processos em 14 setores, janelas críticas, premissas e feriados              |
| Calendários acadêmicos do 1º semestre de 2027 (Diretoria de Graduação)                 | Eventos acadêmicos                                                               |
| Organograma da rematrícula 2026                                                        | Fluxo da rematrícula (14 passos) e metas de referência                           |
| Diretrizes de 29/10/2026                                                               | Janelas de rematrícula, novo contrato, Metabase, cards vitrine, limpeza de ficha |

Os dados iniciais ficam em `src/features/calendario/data/`:

- `processos.seed.ts`: todos os processos (194).
- `eventos.seed.ts`: eventos acadêmicos e janelas de rematrícula.
- `janelas.seed.ts`: janelas críticas.
- `catalogo.ts`: setores, etapas, rótulos em linguagem simples, janelas de rematrícula, feriados e premissas.

Cada processo guarda o **nome simples** (usado em todas as telas) e o **nome técnico** da planilha com o código do subprocesso (em “Detalhes técnicos e origem”), para manter a rastreabilidade com as cadeias de processos.

---

## Decisões registradas nesta versão

- **Nomes simples** para todos os processos, mantendo o nome técnico original.
- **Setores com os nomes do organograma:** TI Desenvolvimento → TI Sistemas, Central Acadêmica de Serviços → CAS, Financeiro — Contas a Receber → Financeiro, Secretaria Geral e Acadêmica → Secretaria Geral. Entraram Marketing, Acordos e “TI e Receptivo” (como aparece no organograma).
- **Limpeza de ficha dividida por modalidade** (antes A1.23, em 18/01), logo após o fim de cada rematrícula: híbrido 22/02, presencial 24/02, EaD 03/03.
- **Passos do organograma sem data** até cada setor confirmar a data de 2027; a data de 2026 aparece como referência.
- **Novo contrato:** ajustes de sistema e Metabase com TI Sistemas; prazo proposto de 08/12/2026 (7 dias antes de abrir a rematrícula). Itens sem setor definido ficam como “A definir”.
- **Cards vitrine:** conferência pela Curadoria antes da liberação das disciplinas do 1º e do 2º módulo (prazos propostos).
- Todo prazo sugerido aparece com o selo **“prazo a confirmar”** e está listado em Pontos de atenção.

## Pendências para validar

Estão todas na tela **Pontos de atenção**. As principais:

1. Os prazos de rematrícula da planilha v1 (A1.16 e A1.17, em 23/12) não batem com as janelas reais.
2. As 12 janelas críticas seguem sem decisão e sem responsável.
3. Processos sem setor responsável (contrato e organograma).
4. Datas de 2027 dos passos do organograma.
5. Recesso de fim de ano e início de 2027-2 (premissas da planilha).
6. Metas de rematrícula de 2027 (hoje aparece a referência de 2026).

---

## Ligando a API

Todo acesso a dados passa por uma interface única:

```ts
// src/features/calendario/api/calendario.repository.ts
export interface CalendarioRepositorio {
   carregar(): Promise<DadosCalendario>;
   mudarStatus(id, status, autor, nota?): Promise<void>;
   adicionarNota(id, texto, autor): Promise<void>;
   ajustar(id, ajuste, autor, resumo): Promise<void>;
   restaurarOriginal(id, autor): Promise<void>;
   criarProcesso(processo, autor): Promise<void>;
   excluirProcessoCriado(id): Promise<void>;
   salvarDecisao(id, decisao): Promise<void>;
   apagarTudo(): Promise<void>;
}
```

Hoje a implementação é `criarRepositorioLocal()` (localStorage). Para ligar o backend:

1. Implemente a mesma interface com o cliente HTTP de `src/services/api.ts` (os contratos Zod de `types/calendario.schema.ts` validam as respostas).
2. Troque a instância exportada no fim do arquivo (`calendarioRepositorio`).
3. Mude `VITE_AUTH_MODE` para `sso` para usar o login da intranet. O autor de cada registro passa a vir do usuário logado.

Nenhuma tela precisa mudar: as telas usam só os hooks do TanStack Query (`api/calendario.queries.ts` e `api/calendario.mutations.ts`).

### Conversa com o calendário dos alunos

Os eventos acadêmicos seguem o contrato `Evento` (`id`, `nome`, `inicio`, `fim`, `formatos`, `tipo`). Quando o sistema de calendário dos alunos tiver API, `carregar()` pode buscar os eventos de lá em vez do seed. Os processos apontam para os eventos pelo `eventoId`, e o prazo de cada um é calculado em dias antes do evento (regra dos 7 dias), então uma mudança de data no calendário dos alunos pode recalcular os prazos internos.

---

## Estrutura

```text
src/
├── features/
│   ├── calendario/   # processos, prazos, painel, lista, linha do tempo, calendário, setores, pontos de atenção
│   │   ├── api/        # repositório (localStorage hoje), queries e mutations
│   │   ├── components/
│   │   ├── data/       # seed e catálogo
│   │   ├── hooks/
│   │   ├── lib/        # datas, regras de prazo, exportação CSV
│   │   ├── stores/     # preferências (meu setor, data simulada)
│   │   └── types/      # contratos Zod
│   ├── rematricula/  # janelas por modalidade e fluxo do organograma
│   └── contrato/     # regras do novo contrato e consulta rápida
├── components/core/  # multi-select, segmented, stat-tile
├── lib/motion.ts     # curvas e variantes de movimento
├── pages/protected/  # uma página por rota
└── layout/           # shell, sidebar e cabeçalho
```

Leituras complementares: [ARCHITECTURE.md](./ARCHITECTURE.md), [CONTRIBUTING.md](./CONTRIBUTING.md), [TESTING.md](./TESTING.md), [DESIGN-SYSTEM.md](./DESIGN-SYSTEM.md) e o guia original do template em [docs/template.md](./docs/template.md).
