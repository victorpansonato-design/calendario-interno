# Prompt para colar no Codex do VS Code

Atue como product designer sênior e engenheiro de frontend especializado em sistemas corporativos. Implemente uma evolução real da usabilidade do Calendário Interno do Grupo Anchieta neste repositório. Referência publicada: https://calendario-interno.vercel.app/painel.

## Objetivo e limites

Quero uma experiência refinada, intuitiva e rápida, compreensível tanto para usuários ocasionais quanto para usuários experientes. A direção está definida: ambiente corporativo claro, identidade Anchieta, controles reconhecíveis, boa hierarquia, densidade confortável e interações que preservam contexto. A originalidade deve aparecer na qualidade da interação e na integração entre as telas.

Trabalhe exclusivamente na apresentação e na interação com funcionalidades existentes. Preserve informações, registros, datas, nomes, descrições, setores, status, regras de negócio, permissões, contratos de API e cálculos. Não invente dados, indicadores, critérios de urgência, dependências, responsáveis, integrações ou funcionalidades de backend. Textos de orientação e rótulos de controles podem ser simplificados se preservarem integralmente o significado e os termos do domínio. Não crie uma nova arquitetura ou migre de framework para realizar o redesign.

## 1. Entenda o projeto antes de editar

Leia AGENTS.md e as instruções locais aplicáveis. Examine package.json, lockfile, rotas, componentes compartilhados, estilos/tokens, estado de filtros e datas, painel de detalhe e camada de dados. Identifique a stack real e as bibliotecas já utilizadas; não deduza a stack a partir da aparência do site.

Execute a aplicação conforme as instruções do projeto e percorra seus fluxos. Se não puder usar navegador, registre essa limitação e prossiga com as verificações disponíveis, sem afirmar que validou visualmente.

Produza um diagnóstico curto, baseado em arquivos e telas reais, e implemente as melhorias priorizadas. Não pare apenas em uma proposta. Antes de adicionar uma dependência, verifique se um componente existente resolve o problema e se a biblioteca pretendida é compatível com as versões instaladas.

Na pesquisa da interface publicada, já foram observados busca e filtros, agrupamento da lista, sidebar, detalhes laterais, link de processo e controles de zoom na linha do tempo. Verifique a implementação atual e refine o que já existe, evitando duplicação. As observações da pesquisa não substituem a leitura do repositório.

## 2. Torne a navegação contínua

- Estabeleça um lugar previsível para contexto, busca, filtros e ação principal. Diferencie claramente o filtro global de setor dos filtros locais. Reduza seletores redundantes que controlam a mesma coisa.
- Ao alternar entre lista, calendário e linha do tempo, preserve os filtros compatíveis e o período quando fizer sentido. Deixe qualquer mudança de escopo explícita. Mantenha rotas e links existentes funcionando.
- Mostre os filtros ativos como chips legíveis, com remoção individual e opção de limpar. Diferencie visualmente filtros de ações e de indicadores.
- Faça voltar/avançar do navegador e links diretos reproduzirem o contexto suportado. Ao fechar um detalhe, preserve filtro, ordenação, posição de rolagem e foco. Não coloque notas ou outros conteúdos privados na URL.
- Se houver benefício e os dados existentes permitirem, ofereça atalhos de filtros frequentes e lembre a preferência de visualização localmente. Evite uma nova tela de configuração para isso.

## 3. Faça o painel orientar o próximo passo

Reduza espaços que atrasam o acesso ao trabalho relevante. Mantenha a ação principal visível e os indicadores existentes conectados à lista correspondente, com o mesmo escopo e a mesma regra já utilizados pelo sistema. Um estado sem urgências deve ser compacto e oferecer o próximo caminho real disponível. Não crie urgência artificial, novos KPIs, gráficos decorativos ou métricas inferidas.

## 4. Refine lista e detalhe como uma experiência única

- Use alinhamento estável para título, setor, data e situação. Favoreça a leitura dos títulos longos e reduza repetição visual. Preserve a possibilidade de consultar o texto completo.
- Mantenha busca e filtros acessíveis durante a exploração; use agrupamentos recolhíveis se reduzirem rolagem sem esconder resultados inesperadamente. Exiba contagem correta após filtragem.
- Avalie um padrão mestre-detalhe no desktop: lista e detalhe visíveis juntos onde houver espaço suficiente. Em telas menores, use painel/modal adequado, preservando a experiência e a acessibilidade. Não é obrigatório substituir o drawer atual: escolha com base no espaço e na implementação existente.
- Reutilize o mesmo componente de detalhe em todos os pontos de entrada. Torne ações claras, respeitando as permissões atuais. Se criar navegação anterior/próximo, siga exatamente o conjunto e a ordem visíveis após os filtros.
- Se houver encadeamentos reais, permita explorá-los sem acumular modais ou perder o caminho de volta. Não desenhe relações inferidas.
- Diferencie visualmente navegação, seleção e alteração de dados. Uma linha clicável não deve conter controles interativos aninhados de forma inválida.

## 5. Evolua o calendário e a linha do tempo

- Priorize as visualizações que a estrutura de datas existente sustenta. Uma agenda por dia pode complementar o mês, especialmente no celular. Não acrescente grade de horas a processos que só têm data.
- Exiba mês e ano claramente, navegação anterior/próximo, retorno a Hoje e acesso direto ao período quando útil. Preserve a distinção entre hoje, dia selecionado e dias fora do mês.
- No desktop, considere títulos curtos ou contagem legível nos dias, com detalhe do dia ao lado. No celular, use mês compacto e agenda abaixo, ou agenda como visualização inicial caso os testes sustentem a escolha.
- Reduza o painel vazio de instruções: ofereça um ponto de partida útil e explícito, sem escolher ou alterar dados do usuário silenciosamente.
- Para vários itens na mesma data ou posição, use agrupamento com contagem e abertura da lista correspondente. Todos os itens precisam continuar alcançáveis por teclado e toque.
- Na linha do tempo, preserve nomes de setores e referência temporal durante a rolagem quando possível. Ofereça controles de período/zoom com significado claro. Mostre o item selecionado e sua data de maneira legível, sem depender apenas de ponto colorido ou hover.
- Um prazo isolado é um marco. Um intervalo exige início e fim reais. Não invente duração para transformar marcos em barras de Gantt.
- Arrastar para alterar prazo só pode existir se essa edição já for suportada e autorizada pelo modelo atual. Deve haver alternativa por formulário, cancelamento e tratamento de erro. Se isso exigir regra ou backend novo, mantenha a navegação e a consulta, sem adicionar a alteração por arraste.
- Preserve a semântica das datas: datas sem horário não podem mudar de dia por conversão UTC. Reutilize a política de fuso/locale do projeto e teste virada de mês e ano.

## 6. Adicione conveniência sem exigir treinamento

Se viável com os dados e ações existentes, implemente uma busca global visível, também acessível por Ctrl/Cmd+K. Ela deve pesquisar entidades reais e navegar para telas existentes. Use agrupamento de resultados, estado sem resultados, setas, Enter, Escape e retorno de foco. Atalhos não devem interferir na digitação. Toda ação acessível por atalho precisa ter caminho por mouse/toque. Não adicione chat de IA, assistente fictício ou busca semântica que dependa de serviço inexistente.

Use feedback de carregamento, erro e sucesso coerente. Só confirme persistência depois do retorno correto, ou use atualização otimista com rollback quando já houver suporte seguro. A ação Desfazer só pode aparecer se existir reversão real. Erros relevantes devem continuar disponíveis no contexto, sem depender apenas de toast que desaparece.

## 7. Preserve identidade e acessibilidade

Extraia tokens dos estilos existentes e consolide espaçamento, tipografia, bordas, superfícies, estados e cores. Preserve logo e identidade do Grupo Anchieta. Use a cor primária institucional existente e confirme-a nos arquivos antes de alterá-la. Prefira tipografia de leitura para conteúdo longo e números alinhados quando necessário.

Mantenha uma família de ícones, preferindo a já instalada. Use ícones reconhecíveis e rótulos nas ações menos óbvias. Botões apenas com ícone precisam de nome acessível e ajuda quando apropriado. Cor não pode ser o único indicador de estado.

Verifique contraste, foco visível, ordem de tabulação, semântica, navegação por teclado e gestão de foco nos painéis. Não use papel de checkbox para uma ação que apenas seleciona um dia, salvo se a interação realmente corresponder a uma seleção múltipla. Adote alvos confortáveis para toque, como 44 px nas ações principais, e respeite prefers-reduced-motion. Use animações breves apenas para explicar mudanças de estado.

## 8. Consulte estas referências com finalidade definida

Leia `02-REFERENCIAS.md` e `03-VALIDACAO.md`, se estiverem disponíveis nesta pasta. Fontes principais:

- shadcn/ui: https://github.com/shadcn-ui/ui e https://ui.shadcn.com/docs/skills — composição de controles e APIs corretas. Se o projeto já usa Radix, não misture com Base UI/React Aria sem necessidade.
- Interface Design: https://github.com/Dammyjay93/interface-design — consistência de interfaces de produto.
- Impeccable: https://github.com/pbakaus/impeccable — crítica, simplificação, responsividade e acabamento.
- Vercel Agent Skills: https://github.com/vercel-labs/agent-skills — web-design-guidelines e boas práticas React, quando aplicáveis à stack.
- Big Calendar: https://github.com/lramos33/big-calendar — referência de visualizações de calendário com código adaptável.
- DayFlow: https://github.com/dayflow-js/calendar — referência de interações e apresentação temporal; avalie suporte real e custo de integração antes de usar como motor.
- Kibo UI: https://github.com/shadcnblocks/kibo e https://www.kibo-ui.com/components/gantt — composição de agenda, lista e visualização temporal sem inventar intervalos.
- shadcn-admin: https://github.com/satnaing/shadcn-admin — referência de shell, navegação e busca.
- TanStack Table: https://github.com/TanStack/table — lógica de tabela quando necessária; não adicionar só para uma lista simples.
- cmdk: https://github.com/dip/cmdk — busca e comandos visíveis.
- Lucide: https://github.com/lucide-icons/lucide — iconografia consistente, se compatível com o projeto.
- Sonner: https://github.com/emilkowalski/sonner — feedback discreto; reaproveite se já instalado.
- Motion: https://github.com/motiondivision/motion — somente se CSS ou a solução existente não resolverem a transição necessária.

Linear, Notion e Raycast são referências de padrões de interação, não modelos para copiar marca ou dados: https://linear.app/features ; https://www.notion.com/help/views-filters-and-sorts ; https://www.raycast.com/.

Não instale a lista inteira. Use as skills já disponíveis e a documentação pertinente à versão instalada. Se uma skill não estiver disponível, não afirme que a executou: consulte a fonte ou registre a limitação. Instalações de ferramentas e bibliotecas não são um resultado de usabilidade por si só. Não confunda o seletor de datas Calendar do shadcn com um calendário completo de eventos.

## 9. Implemente e demonstre

Priorize: (1) contexto e filtros; (2) hierarquia de painel/lista/detalhe; (3) calendário e sobreposições; (4) mobile e acessibilidade; (5) conveniências e acabamento. Faça mudanças incrementais e preserve alterações locais preexistentes.

Execute build, checagem de tipos e lint conforme os scripts disponíveis. Verifique os fluxos modificados no navegador em 390, 768, 1280 e 1440 px, além de zoom de 200% em um viewport desktop. Teste conteúdo longo, filtros sem resultados e retorno ao mesmo item após fechar o detalhe. Use fixtures de teste ou os estados de demonstração para situações raras; nunca altere registros reais para fabricar evidência. Não publique nem faça deploy automaticamente.

Entregue a implementação, um resumo curto do que mudou e por quê, arquivos principais, verificações executadas e limitações. Capture antes/depois se o ambiente permitir. Não declare compatibilidade universal ou validação com pessoas que não aconteceu.
