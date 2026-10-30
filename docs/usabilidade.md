# Evolução de usabilidade — Calendário Interno

Implementação local de 29 e 30/10/2026. O commit e o deploy foram autorizados posteriormente, em 30/10/2026, após a entrega da implementação para revisão.

## Diagnóstico e escopo

Não havia `AGENTS.md` no repositório ou nas pastas ancestrais consultadas. Foram lidos `package.json`, rotas, estilos, componentes, estado, repositório de dados e o material preexistente em `kit/`. A aplicação foi executada e percorrida antes das alterações.

Stack confirmada: React 19, TypeScript 6, Vite 8, Tailwind 4, Radix/shadcn, cmdk, TanStack Query, Zustand, date-fns, Sonner e Motion. Não foi adicionada dependência ao projeto; `package.json` e lockfile foram preservados.

Os recursos já existentes foram refinados: busca e filtros na URL, lista agrupada, detalhe lateral único, calendário mensal e marcos por setor. Os principais problemas eram perda de filtros na navegação, recriação do campo de busca, ausência de retorno explícito de foco, detalhe com fechamento sujeito à rolagem, dia inicialmente sem agenda e alvos sobrepostos de 12 px na linha do tempo.

## Implementação

- **Contexto de consulta:** lista, calendário e linha do tempo compartilham filtros pela URL, inclusive pelos links da sidebar. Busca, setor, etapa, situação, status, agrupamento, mês, dia e zoom são preservados quando aplicáveis. O detalhe aberto e conteúdo privado não são propagados como contexto de navegação.
- **Filtros ativos:** cada valor tem remoção individual; limpar filtros preserva período, agrupamento e processo aberto. A busca é controlada, sem remontar o campo ou inserir uma entrada de histórico a cada letra.
- **Status do setor:** filtro de apresentação sobre os quatro status existentes. O indicador “Em andamento” agora abre exatamente esse recorte, sem alterar sua contagem ou a regra de urgência.
- **Meu setor:** continua sendo a preferência do painel. O seletor no cabeçalho se limita a esse contexto e aparece quando há uma preferência escolhida, evitando duplicá-lo com o convite inicial.
- **Drawer:** mesmo componente para todos os pontos de entrada; botão de fechar permanente, corpo com rolagem independente, estado de carregamento/erro separado de processo inexistente e retorno ao elemento de origem. Links relacionados usam um único drawer, com caminho de volta e histórico compatível com links diretos.
- **Lista e detalhe no desktop:** foi mantido o drawer modal. Em 1280 px, uma divisão permanente com sidebar e detalhe reduziria demais a coluna de leitura dos títulos. A seleção permanece identificada na lista e o contexto é restaurado ao fechar; não foi criado um segundo componente de detalhe.
- **Calendário:** mês/ano explícitos, acesso direto por mês, Hoje seleciona a data de hoje, navegação por setas/Home/End/PageUp/PageDown e estado na URL. A agenda fica ao lado do mês a partir de 1280 px e abaixo em telas menores, com atalho visível para alcançá-la. Dias mostram quantidade de prazos, eventos e feriados; cada item continua disponível na agenda.
- **Linha do tempo:** marcos que colidiriam no zoom atual são reunidos em grupos com contagem e lista acessível. Os alvos têm 44 px; as datas originais continuam visíveis. Rótulos de setor e meses acompanham a rolagem da região. Eventos usam apenas seus intervalos reais e também têm consulta textual. Nenhum prazo foi transformado em duração fictícia; não foi adicionado arraste de datas.
- **Busca global:** botão permanente e Ctrl/Cmd+K, com processos, eventos e destinos reais. Busca sem acentos, resultados agrupados, setas/Enter/Escape, retorno de foco e caminho para todos os resultados quando há mais de 20 processos. O atalho não é capturado enquanto se digita em um campo ou em outro diálogo.
- **Estados:** mensagens de erro persistem no contexto do detalhe e dos formulários; campos são mantidos em caso de falha. Sucesso continua dependendo da persistência e atualização da consulta. Não foi adicionado Desfazer fictício.
- **Identidade e acessibilidade:** logo e cores institucionais preservados; Inter para leitura e títulos, monoespaçada para códigos/datas; foco visível, link para o conteúdo, alvos de toque e movimento reduzido. A barra fixa comunica sua altura à região de rolagem para não esconder controles focados por teclado.

Os filtros temporais se aplicam aos processos. Eventos acadêmicos, rematrícula e feriados mantêm o escopo original, agora explicado nas telas. Processos sem data e rotinas contínuas são explicitamente encaminhados para a lista.

## Verificações

| Verificação | Resultado |
| --- | --- |
| `npm run build` | Passou |
| `npm run typecheck` | Passou |
| `npm run lint` | Sem erros; 6 avisos preexistentes de Fast Refresh |
| `npm test` | 47 testes passaram em 10 arquivos; eram 35 testes antes |
| 390, 768, 1280 e 1440 px | Lista, calendário, linha do tempo e detalhe examinados |
| Rolagem horizontal | Ausente na página e no canvas nas quatro larguras; intencional dentro da linha do tempo |
| Mouse e teclado nas quatro larguras | Consulta entre telas, detalhe, Tab/Shift+Tab/Escape, agenda, grupos e busca global |
| Retorno após rolagem longa | Mesmo item E3.04 e mesma posição: 23.697, 22.140, 12.997 e 12.997 px respectivamente |
| Toque emulado nas quatro larguras | Busca global, abertura/fechamento, seleção de dia e grupos; eventos nativos com `pointerType: touch` |
| Persistência e falha | Testes de nota salva e nota rejeitada: histórico atualizado apenas após sucesso; texto mantido e sem falso sucesso na falha |
| Datas | Virada de mês/ano e Hoje testados sem conversão UTC |
| Reflow a 200% | Emulação equivalente: 720 × 500 px CSS, escala 2; sem rolagem horizontal da página |
| Auditoria automática do calendário | Axe WCAG 2 A/AA em 1440 px: zero violações nos temas claro e escuro, no dia 18/01/2027 consultado |

Os testes novos cobrem preservação e limpeza de contexto, continuidade de foco da busca, histórico de detalhes e links diretos relacionados, calendário por teclado, agrupamento sem perda de registros e feedback de persistência. Seeds, regras de prazo/contrato, repositório/API, autenticação e permissões não foram editados.

O detector Impeccable encontrou somente um aviso sobre a popularidade de Inter. A fonte existente foi mantida deliberadamente para preservar identidade e legibilidade corporativa. O relatório está em `artifacts/usabilidade/impeccable.json`.

## Evidências e arquivos

- [Capturas e scripts de verificação](../artifacts/usabilidade/)
- [Calendário desktop](../artifacts/usabilidade/depois-1440-calendario.png)
- [Calendário em 390 px](../artifacts/usabilidade/depois-390-calendario.png)
- [Detalhe em 390 px](../artifacts/usabilidade/detalhe-390.png)
- [Resultados de toque](../artifacts/usabilidade/toque.json)
- [Fluxos de mouse e teclado](../artifacts/usabilidade/fluxos.txt)

As capturas “antes” registram o tema do navegador no início do trabalho; as capturas de leitura clara e de detalhe escuro também servem para examinar os dois temas. Não constituem um teste de regressão pixel a pixel entre temas idênticos.

Arquivos centrais: `filtros-processos.tsx`, `busca-global.tsx`, `use-processo-aberto.ts`, `retorno-detalhe.ts`, `calendario-mensal.tsx`, `linha-do-tempo.tsx`, `main-layout.tsx` e os testes em `tests/components/features/calendario/`.

## Referências consultadas

- [shadcn/ui](https://ui.shadcn.com/docs/components/radix/command): composição com cmdk, Sheet e Popover sobre Radix.
- [Big Calendar](https://github.com/lramos33/big-calendar): navegação entre período e agenda.
- [DayFlow](https://github.com/dayflow-js/calendar): seleção de data e consulta temporal.
- [Kibo UI Calendar](https://www.kibo-ui.com/components/calendar): agrupamento de itens por dia.
- [shadcn-admin](https://github.com/satnaing/shadcn-admin): shell e acesso à busca.

Foram aplicadas as orientações disponíveis de Interface Design, Impeccable e Vercel React Best Practices. As referências não foram instaladas como novos motores de calendário.

## Limitações reais

- Validação feita em Chromium automatizado, incluindo toque emulado; não em dispositivos físicos, Safari, Firefox ou com leitores de tela humanos.
- Não houve pesquisa ou teste com usuários reais.
- O reflow a 200% foi emulado por viewport/escala; não foi testado o controle de zoom de um navegador físico.
- A aplicação mantém a arquitetura localStorage existente. Não foi criada sincronização entre usuários ou integração de backend.
- Eventos continuam sem filtro de setor porque o modelo existente não fornece essa relação.
- O drawer permanece modal; lista e detalhe não ficam simultaneamente interativos.
- Os seis avisos de Fast Refresh já existiam em `badge`, `button`, `callout`, `empty-state`, `form` e `sidebar`.
- Arquivos preexistentes de `kit/` foram preservados. Capturas e scripts são artefatos locais, não fixtures carregadas pela aplicação.
