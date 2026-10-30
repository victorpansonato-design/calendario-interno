# Critérios para concluir a evolução

## Fluxos essenciais

- Encontrar um processo por busca, abri-lo e voltar ao mesmo resultado, mantendo contexto e foco.
- Filtrar por setor/situação; alternar para uma visualização temporal e conferir o escopo aplicado.
- Remover um filtro por chip e limpar todos; a contagem deve acompanhar os resultados.
- Abrir um link direto de processo e usar voltar/avançar sem quebrar a tela.
- Consultar um dia com vários itens e alcançar todos eles por mouse, toque e teclado.
- Consultar sobreposições na linha do tempo sem depender de acertar um ponto minúsculo.
- Abrir e fechar detalhes; se houver encadeamentos, navegar entre eles e retornar sem acumular overlays.
- Pesquisar pela busca global, se implementada, e abrir um resultado real. Testar ausência de resultados e Escape.
- Realizar uma ação existente em ambiente de teste; confirmar sucesso real e testar falha sem mostrar confirmação enganosa.

## Responsividade e acessibilidade

- Verificar 390, 768, 1280 e 1440 px; registrar o que realmente foi testado.
- Verificar zoom de 200% no desktop.
- Evitar rolagem horizontal na página; uma linha do tempo pode ter rolagem horizontal dentro de região identificada e utilizável.
- Manter visíveis cabeçalho, fechamento e ações importantes do detalhe, sem esconder conteúdo atrás do teclado virtual.
- Usar rótulos explícitos e alvos de toque confortáveis. Não depender de hover.
- Verificar navegação por Tab, Shift+Tab, Enter, Espaço, Escape e setas nos componentes que as exigem.
- Restaurar foco ao fechar modal/drawer; garantir que o foco não fique atrás de um overlay modal aberto.
- Conferir nomes acessíveis e semântica de botões, busca, seleção de data, filtros e indicadores.
- Conferir estados por texto/ícone além da cor, contraste e redução de movimento.

## Estados e datas

- Testar título longo e muitos itens na mesma data.
- Testar lista vazia, nenhum resultado filtrado, carregamento e erro com recuperação.
- Testar virada de mês e ano e datas sem horário. A mesma data deve aparecer de forma consistente em lista, detalhe, calendário e linha do tempo.
- Preservar regras existentes para itens sem data e rotinas contínuas. Não inventar datas nem durações para preencher visualizações.
- Testar comportamento de filtros quando uma visualização não suporta um deles; isso deve ser explicado, sem descarte silencioso de contexto.

## Evidência de conclusão

- Build, tipos e lint conforme scripts disponíveis; anotar falhas preexistentes separadamente.
- Verificação funcional dos caminhos alterados e capturas antes/depois se disponíveis.
- Lista curta de alterações, arquivos principais, decisões de dependência e limitações reais.
- Garantir que fixtures e conteúdo de demonstração não substituam dados reais nem vazem para a aplicação publicada.
- Não declarar que a interface foi validada com usuários sem realizar esse trabalho.
- Não publicar/deployar automaticamente: a entrega aqui é a implementação local revisável.
