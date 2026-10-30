param([string]$BaseUrl = 'http://localhost:4173/calendario-interno', [string]$BrowserExecutable = 'agent-browser')
$ErrorActionPreference = 'Stop'
function Browser {
   $browserArguments = @($args)
   & $BrowserExecutable --session anchieta-final @browserArguments
   if ($LASTEXITCODE -ne 0) { throw "Falha no navegador: $browserArguments" }
}
function AssertUi([string]$Script) {
   $Script | & $BrowserExecutable --session anchieta-final eval --stdin
   if ($LASTEXITCODE -ne 0) { throw 'Falha na verificação da interface' }
}

foreach ($largura in @(390, 768, 1280, 1440)) {
   Browser set viewport $largura 1000
   Browser open "$BaseUrl/processos?busca=Lyceum&setor=ti-sistemas"
   Browser wait .consulta-toolbar
   Browser click "section.consulta-toolbar nav a[href*='/calendario']"
   AssertUi "if(!location.search.includes('busca=Lyceum')||!location.search.includes('setor=ti-sistemas'))throw Error('Filtro perdido no calendário'); 'Contexto da consulta preservado'"
   Browser click "section.consulta-toolbar nav a[href*='/linha-do-tempo']"
   AssertUi "if(!location.search.includes('busca=Lyceum')||!location.search.includes('setor=ti-sistemas'))throw Error('Filtro perdido na linha do tempo'); 'Contexto temporal preservado'"
   Browser open "$BaseUrl/processos?busca=Lyceum"
   Browser wait "button[data-processo-id='A1.04']"
   Browser click "button[data-processo-id='A1.04']"
   AssertUi "window.__qaScroll=document.querySelector('[data-scroll-canvas]').scrollTop; if(!document.querySelector('[data-processo-detalhe]'))throw Error('Detalhe ausente'); 'Detalhe aberto'"
   Browser press Tab
   AssertUi "if(!document.activeElement.closest('[role=dialog]'))throw Error('Foco saiu do drawer'); 'Tab contido no drawer'"
   Browser press Shift+Tab
   Browser screenshot "artifacts/usabilidade/detalhe-$largura.png"
   Browser press Escape
   Browser wait --fn "!document.querySelector('[data-processo-detalhe]')"
   AssertUi "if(document.activeElement.getAttribute('data-processo-id')!=='A1.04')throw Error('Foco não restaurado'); if(Math.abs(document.querySelector('[data-scroll-canvas]').scrollTop-window.__qaScroll)>1)throw Error('Scroll alterado'); if(!location.search.includes('busca=Lyceum'))throw Error('Busca perdida'); 'Origem, foco e rolagem restaurados'"
   Browser open "$BaseUrl/calendario?mes=2027-01&dia=2027-01-18"
   Browser wait "button[data-dia='2027-01-18']"
   Browser focus "button[data-dia='2027-01-18']"
   Browser press ArrowRight
   AssertUi "if(document.activeElement.getAttribute('data-dia')!=='2027-01-19'||!location.search.includes('dia=2027-01-19'))throw Error('Navegação de dia incorreta'); 'Data e foco avançaram por teclado'"
   Browser focus "button[aria-label^='Pr']"
   Browser click "button[aria-label^='Pr']"
   AssertUi "if(!location.search.includes('mes=2027-02'))throw Error('Mês não avançou'); 'Mês avançou'"
   Browser open "$BaseUrl/linha-do-tempo"
   Browser wait "button[aria-label*='prazos agrupados']"
   Browser focus "button[aria-label*='prazos agrupados']"
   Browser find first "button[aria-label*='prazos agrupados']" click
   Browser wait '[data-slot=popover-content]'
   AssertUi "if(!document.querySelector('[data-slot=popover-content] [data-processo-id]'))throw Error('Grupo vazio'); 'Todos os itens do grupo disponíveis'"
   Browser click "[data-slot='popover-content'] button[data-processo-id]:first-of-type"
   Browser wait '[data-processo-detalhe]'
   Browser wait --fn "!document.querySelector('[data-slot=popover-content]')"
   AssertUi "if(document.querySelectorAll('[role=dialog]').length!==1)throw Error('Overlays acumulados'); 'Um único detalhe aberto pelo grupo'"
   Browser press Escape
   Browser wait --fn "!document.querySelector('[data-processo-detalhe]')"
   AssertUi "if(!document.activeElement.getAttribute('aria-label')?.includes('prazos agrupados'))throw Error('Foco não retornou ao grupo'); 'Foco retornou ao grupo'"
   Browser press Control+k
   Browser fill "[role='combobox'][aria-label='Busca global']" K.04
   Browser press Enter
   Browser wait '[data-processo-detalhe]'
   AssertUi "if(!location.search.includes('processo=K.04')||document.querySelectorAll('[role=dialog]').length!==1)throw Error('Busca global não abriu o destino'); 'Busca global encontrou e abriu K.04'"
   Browser press Escape
   Browser wait --fn "!document.querySelector('[data-processo-detalhe]')"
   AssertUi "if(document.activeElement.getAttribute('aria-label')!=='Busca global')throw Error('Foco da busca global não restaurado'); 'Foco retornou à busca global'"
}
Browser errors
