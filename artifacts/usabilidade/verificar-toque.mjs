/* global WebSocket, process, setTimeout, clearTimeout, console */
// Chrome DevTools Protocol: toque real emulado, além do alias `tap` do CLI.
// Opera exclusivamente no navegador isolado iniciado pelo agent-browser.
const socket = new WebSocket(process.argv[2]);
await new Promise((resolve, reject) => { socket.addEventListener('open', resolve, { once: true }); socket.addEventListener('error', reject, { once: true }); });
let id = 0;
const pending = new Map();
socket.addEventListener('message', event => {
  const message = JSON.parse(event.data);
  const request = pending.get(message.id);
  if (!request) return;
  clearTimeout(request.timer); pending.delete(message.id);
  if (message.error) request.reject(Error(message.error.message)); else request.resolve(message.result);
});
function send(method, params = {}, sessionId) {
  return new Promise((resolve, reject) => {
    const next = ++id;
    pending.set(next, { resolve, reject, timer: setTimeout(() => { pending.delete(next); reject(Error(`Timeout: ${method}`)); }, 8000) });
    socket.send(JSON.stringify({ id: next, method, params, ...(sessionId ? { sessionId } : {}) }));
  });
}
try {
  const { targetInfos } = await send('Target.getTargets');
  const target = targetInfos.find(target => target.type === 'page' && target.url.startsWith('http://localhost:4173/calendario-interno/'));
  if (!target) throw Error('A aba local de validação não está aberta.');
  const { sessionId } = await send('Target.attachToTarget', { targetId: target.targetId, flatten: true });
  const call = (method, params) => send(method, params, sessionId);
  async function evaluate(expression) {
    const response = await call('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
    if (response.exceptionDetails) throw Error(response.exceptionDetails.exception?.description ?? response.exceptionDetails.text);
    return response.result.value;
  }
  async function waitFor(expression) {
    for (let retry = 0; retry < 80; retry++) {
      try { if (await evaluate(expression)) return; } catch { /* navegação em andamento */ }
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    throw Error(`Condição não alcançada: ${expression}`);
  }
  async function navigate(path, selector) {
    await call('Page.navigate', { url: `http://localhost:4173/calendario-interno/${path}` });
    await waitFor(`document.readyState === 'complete' && !!document.querySelector(${JSON.stringify(selector)})`);
    await evaluate(`window.__touchEvidence = []; document.addEventListener('pointerdown', event => window.__touchEvidence.push(event.pointerType), {capture:true})`);
  }
  async function touch(selector) {
    await evaluate(`document.querySelector(${JSON.stringify(selector)})?.focus()`);
    await waitFor(`(() => { const el=document.querySelector(${JSON.stringify(selector)}); if(!el)return false; const r=el.getBoundingClientRect(); return el.contains(document.elementFromPoint(r.left+r.width/2,r.top+r.height/2)) && !document.getAnimations().some(a=>a.playState==='running' && a.effect?.getComputedTiming().iterations!==Infinity); })()`);
    const point = await evaluate(`(() => { const el = document.querySelector(${JSON.stringify(selector)}); if (!el) throw Error('Alvo ausente'); el.focus(); const r=el.getBoundingClientRect(); const x=r.left+r.width/2, y=r.top+r.height/2; if(!el.contains(document.elementFromPoint(x,y))) throw Error('Alvo de toque encoberto'); return {x,y}; })()`);
    await call('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ ...point, radiusX: 5, radiusY: 5, force: 1 }] });
    await call('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  }
  await call('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 1 });
  const results = [];
  for (const width of [390, 768, 1280, 1440]) {
    await call('Emulation.setDeviceMetricsOverride', { width, height: 1000, deviceScaleFactor: 1, mobile: width === 390 });
    await navigate('processos', 'button[aria-label="Busca global"]');
    await touch('button[aria-label="Busca global"]');
    await waitFor('!!document.querySelector("[cmdk-input]")');
    await call('Input.insertText', { text: 'K.04' });
    await waitFor('[...document.querySelectorAll("[role=option]")].some(el=>el.textContent.includes("K.04"))');
    await touch('[role=option]');
    await waitFor('location.search.includes("processo=K.04") && !!document.querySelector("[data-processo-detalhe]")');
    await touch('[data-processo-detalhe] > button');
    await waitFor('!document.querySelector("[data-processo-detalhe]")');
    const global = await evaluate('window.__touchEvidence');
    await navigate('calendario?mes=2027-01&dia=2027-01-18', 'button[data-dia="2027-01-19"]');
    await touch('button[data-dia="2027-01-19"]');
    await waitFor('location.search.includes("dia=2027-01-19")');
    const calendar = await evaluate('window.__touchEvidence');
    await navigate('linha-do-tempo', 'button[aria-label*="prazos agrupados"]');
    await touch('button[aria-label*="prazos agrupados"]');
    await waitFor('!!document.querySelector("[data-slot=popover-content] [data-processo-id]")');
    const timeline = await evaluate('window.__touchEvidence');
    if (![...global, ...calendar, ...timeline].every(type => type === 'touch')) throw Error('Eventos de toque não confirmados');
    results.push({ width, buscaGlobal: 'passou', calendario: 'passou', grupoDePrazos: 'passou', pointerTypes: { global, calendar, timeline } });
  }
  console.log(JSON.stringify(results, null, 2));
} finally { socket.close(); }
