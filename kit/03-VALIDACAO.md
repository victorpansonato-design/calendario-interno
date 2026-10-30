# Referências selecionadas — 29/10/2026

## Recomendação para este sistema

Começar pelo que já existe no repositório. A combinação sugerida é a consistência de navegação de produtos como Linear, a flexibilidade de filtros/visualizações do Notion e o acesso rápido do Raycast, usando componentes adequados à stack atual. Isso é uma recomendação de design para o Anchieta, não uma afirmação de que esses produtos usam a mesma implementação.

O resultado desejado é previsível: encontrar, filtrar, abrir, entender, agir e voltar sem perder o contexto. Os recursos avançados devem diminuir esforço, não acrescentar uma camada de aprendizagem.

## Bibliotecas, componentes e projetos com código

| Projeto e fonte primária | O que oferece | Aplicação recomendada | Natureza e limites |
| --- | --- | --- | --- |
| [shadcn/ui](https://github.com/shadcn-ui/ui) · [documentação](https://ui.shadcn.com/) | Componentes componíveis para construir uma biblioteca própria | Sidebar, filtros, menus, painel lateral, seletor de data, estados e controles consistentes | Base de componentes, não sistema completo. Consultar a documentação correspondente à base e à versão usadas. |
| [Big Calendar](https://github.com/lramos33/big-calendar) | Aplicação de referência com agenda, ano, mês, semana e dia; arraste e filtros | Boa primeira referência de calendário aproveitável para um projeto React com shadcn | O README descreve Next.js 14 e Tailwind 3. Adaptar sem copiar configuração antiga por cima do projeto atual. Não fornece o backend do Anchieta. |
| [DayFlow](https://github.com/dayflow-js/calendar) | Biblioteca de calendário para múltiplos frameworks, várias visualizações e arquitetura de plugins | Explorar uma apresentação de calendário mais refinada e interações de seleção/detalhe | MIT. Candidata a motor, sujeita a teste de compatibilidade, teclado, datas, desempenho e manutenção. A pesquisa não executou uma integração. |
| [Kibo UI](https://github.com/shadcnblocks/kibo) · [Gantt](https://www.kibo-ui.com/components/gantt) · [Calendar](https://www.kibo-ui.com/components/calendar) | Componentes mais complexos para o ecossistema shadcn, incluindo agenda, Gantt, lista e tabela | Referência forte para linha do tempo, detalhes e composição de visualizações | MIT. São blocos de construção; integração e acessibilidade do resultado final precisam ser verificadas. Não transformar prazos sem início em intervalos fictícios. |
| [shadcn-admin](https://github.com/satnaing/shadcn-admin) | Template administrativo com sidebar, busca global, páginas e comportamento responsivo | Referência pronta de navegação e organização de um sistema corporativo | MIT. Aproveitar padrões e componentes selecionados, preservando o projeto existente. Não importar autenticação, mocks e rotas desnecessários. |
| [TanStack Table](https://github.com/TanStack/table) | Lógica sem aparência imposta para ordenar, filtrar, agrupar e selecionar linhas | Tabelas de processos se a complexidade justificar | MIT. Não é uma tabela pronta com todo o visual. Pode ser desnecessária para uma lista curta. Não migrar de versão só por tendência. |
| [cmdk](https://github.com/dip/cmdk) | Componente React de menu de comandos/combobox com filtragem | Busca global e navegação rápida, com botão visível além do atalho | MIT. A biblioteca não conecta dados nem cria busca global sozinha. É preciso definir o escopo real de resultados. |
| [Lucide](https://github.com/lucide-icons/lucide) · [ícones](https://lucide.dev/) | Família consistente de ícones SVG e pacotes por framework | Ícones de calendário, busca, filtro, andamento e navegação | ISC. Preferir a família já instalada; não instalar várias coleções para ações equivalentes. |
| [Phosphor React](https://github.com/phosphor-icons/react) | Família alternativa de ícones para React | Alternativa visual se o projeto já usar Phosphor | Escolher uma família predominante. O objetivo é reconhecimento e consistência, não quantidade de ícones. |
| [Sonner](https://github.com/emilkowalski/sonner) | Componente de toast para React | Feedback de ações e salvamento | Complementar o feedback no contexto; não anunciar persistência sem confirmação nem oferecer reversão inexistente. |
| [Motion](https://github.com/motiondivision/motion) | Biblioteca de animação | Explicar abertura de detalhe e mudanças de estado quando houver necessidade | Opcional. Preferir CSS ou a solução já presente se suficientes. Respeitar redução de movimento. |
| [React Aria / React Spectrum](https://github.com/adobe/react-spectrum) | Bibliotecas para experiências adaptáveis e acessíveis | Referência para teclado, foco, seleções e interação com datas | Alternativa de primitives; não combinar indiscriminadamente com a base já escolhida. A integração ainda precisa de testes. |

## Alternativas de calendário e condições importantes

- [Schedule-X](https://github.com/schedule-x/schedule-x) oferece calendário extensível, internacionalização e design responsivo. O núcleo é MIT, mas o [plugin de drag and drop](https://schedule-x.dev/docs/calendar/plugins/drag-and-drop) consultado exige licença premium. Não prometer esse recurso gratuitamente.
- [FullCalendar](https://github.com/fullcalendar/fullcalendar) é outra opção de calendário de eventos. A [licença oficial](https://fullcalendar.io/license) distingue Standard, com componentes não premium sob MIT, de Premium. A política consultada não inclui universidades na licença gratuita para entidades sem fins lucrativos. Não presumir gratuidade de recursos Premium por se tratar de instituição de ensino.
- [Origin UI Experiments](https://github.com/origin-space/ui-experiments) reúne layouts e experimentos de calendário/dashboard. Seus termos permitem uso em projetos pessoais e comerciais, mas proíbem redistribuição ou revenda, mesmo parcial. Foi mantido como referência visual, sem copiar código para este pacote. O link de demo Event Calendar fornecido pelo README retornou 404 nesta pesquisa; o repositório continuou acessível.
- O [Calendar do shadcn](https://ui.shadcn.com/docs/components/base/calendar) é um seletor de data ou intervalo. Ele não equivale sozinho a um agendador de eventos com diferentes visualizações.

## Skills e ferramentas para o agente de código

Estas são instruções e ferramentas para melhorar o trabalho do agente. Elas não acrescentam recursos ao sistema automaticamente e não substituem a inspeção do projeto.

| Referência | Papel neste trabalho | Prioridade sugerida |
| --- | --- | --- |
| [shadcn skill oficial](https://ui.shadcn.com/docs/skills) | Usa contexto do projeto, componentes e APIs adequadas ao ecossistema shadcn | Alta se o projeto usa shadcn |
| [Interface Design](https://github.com/Dammyjay93/interface-design) | Direção, consistência e memória de decisões de interface; foco explícito em dashboards, apps e painéis | Minha primeira opção para orientar a consistência de um sistema corporativo |
| [Impeccable](https://github.com/pbakaus/impeccable) | Crítica, auditoria e acabamento do design; documentação contempla Codex | Complemento para revisar e simplificar o resultado |
| [Vercel Agent Skills](https://github.com/vercel-labs/agent-skills) | web-design-guidelines para revisão de interface e react-best-practices para desempenho React/Next | Revisão técnica conforme a stack |
| [UI/UX Pro Max](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) | Referências estruturadas de estilos, paletas, tipografia e orientação de UX | Consulta complementar; preservar a identidade existente |
| [Frontend Design da Anthropic](https://github.com/anthropics/skills/blob/main/skills/frontend-design/SKILL.md) | Direção estética intencional e revisão de padrões visuais genéricos | Alternativa; não é necessário acumular todas as skills de direção criativa |
| [TanStack Intent](https://github.com/TanStack/table) | O README atual documenta skills alinhadas à versão da biblioteca nos adapters da Table v9+ | Usar apenas se essa geração da biblioteca já fizer parte do projeto |
| [shadcn MCP](https://ui.shadcn.com/docs/mcp) | Busca, consulta e instalação de componentes de registries | Muito útil para usar componentes reais e reduzir APIs inventadas |
| [Playwright MCP](https://github.com/microsoft/playwright-mcp) | Inspeção e interação de navegador para verificar o resultado | Para verificar fluxos; testes automatizados do projeto também podem ser suficientes |
| [React Grab](https://github.com/aidenybai/react-grab) | Seleção de elementos de UI para fornecer contexto ao agente | Ferramenta opcional para iterações no ambiente de desenvolvimento |

Recomendação de sequência: uma skill de direção principal → documentação/skill dos componentes → revisão técnica → validação em navegador. Evitar várias skills de direção dando ordens divergentes ao mesmo tempo.

### Comandos de instalação documentados nas fontes consultadas

São referências para execução pelo usuário no projeto local; nada foi instalado por este pacote. Consulte o README atual antes de executar, pois nomes e instaladores podem mudar.

```bash
# Skill oficial do shadcn; o instalador permite selecionar o agente.
npx skills add shadcn/ui

# Coleção Vercel; selecionar as skills aplicáveis ao projeto.
npx skills add vercel-labs/agent-skills

# Interface Design direcionada ao Codex, no escopo padrão do instalador.
npx skills add https://github.com/dammyjay93/interface-design --skill interface-design --agent codex

# Impeccable: instalador oficial documentado no README.
npx impeccable install

# UI/UX Pro Max: alternativa de direção/consulta, sem necessidade de instalar todas.
npx ui-ux-pro-max-cli init --ai codex
```

Os comandos reproduzem rotas de instalação descritas pelos autores, mas não foram executados nesta pesquisa. O pacote não contém skills instaláveis modificadas, nem uma configuração MCP pronta para sobrescrever a configuração do usuário.

## Padrões de produto que vale estudar

| Produto/fonte | Padrão útil para o Anchieta | Tradução sugerida |
| --- | --- | --- |
| [Linear](https://linear.app/features) | Organização de trabalho e acesso consistente às entidades | A mesma seleção e o mesmo detalhe acessíveis a partir de diferentes telas |
| [Notion — views, filters, sorts & groups](https://www.notion.com/help/views-filters-and-sorts) | Diferentes maneiras de consultar a mesma base | Alternar visualização mantendo filtros compatíveis e mostrando o escopo |
| [Raycast](https://www.raycast.com/) | Acesso rápido e comandos pesquisáveis | Busca global descoberta por botão e acelerada por teclado |

Essas traduções são propostas de design para este projeto, não uma auditoria das interfaces internas desses serviços.

## O que foi observado no calendário publicado

Fontes: interface em modo demonstração nas rotas [painel](https://calendario-interno.vercel.app/painel), [processos](https://calendario-interno.vercel.app/processos), [linha do tempo](https://calendario-interno.vercel.app/linha-do-tempo) e [calendário](https://calendario-interno.vercel.app/calendario), além da abertura de um detalhe a partir da lista. Observações limitadas a apresentação e interação; os conteúdos de negócio não foram auditados.

| Observação de interface | Oportunidade de usabilidade |
| --- | --- |
| O painel apresenta um seletor de setor no topo e outro na orientação inicial | Verificar se ambos controlam o mesmo estado e reduzir redundância |
| Busca, filtros e agrupamentos já estão disponíveis na lista | Refinar visibilidade do filtro ativo e continuidade entre visualizações |
| O processo já abre em drawer e acrescenta o identificador à URL | Melhorar contexto, foco, retorno e navegação entre itens; não recriar o recurso do zero |
| A linha do tempo utiliza pontos; alguns ficam muito próximos ou sobrepostos | Agrupar com contagem e abrir lista acessível dos itens correspondentes |
| O calendário tem grade mensal e área lateral que começa com instruções | Oferecer ponto de partida útil e acesso mais direto à agenda |
| A hierarquia atual já é limpa e consistente em diversos controles | Evoluir principalmente integração, legibilidade e eficiência das tarefas |

Persistência de filtros, comportamento mobile, permissão de edição e tratamento de erros precisam ser confirmados no repositório e na validação. A ausência de um controle na área observada não prova ausência da funcionalidade.
