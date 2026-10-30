/** Contexto transitório de foco, compartilhado pelas entradas do mesmo drawer. */
let origem: HTMLElement | null = null;
let processoOrigem: string | null = null;
let rolagem: { elemento: HTMLElement; top: number } | null = null;

export function lembrarOrigemDetalhe(id: string, elementoOrigem?: HTMLElement | null) {
   origem = elementoOrigem ?? (document.activeElement instanceof HTMLElement ? document.activeElement : null);
   processoOrigem = id;
   const elemento = document.querySelector<HTMLElement>("[data-scroll-canvas]");
   rolagem = elemento ? { elemento, top: elemento.scrollTop } : null;
}

export function restaurarOrigemDetalhe() {
   const item = [...document.querySelectorAll<HTMLElement>("[data-processo-id]")].find(el => el.dataset.processoId === processoOrigem);
   const destino = origem?.isConnected ? origem : (item ?? document.querySelector<HTMLElement>("[data-scroll-canvas] h1"));
   destino?.focus({ preventScroll: true });
   if (rolagem?.elemento.isConnected) rolagem.elemento.scrollTop = rolagem.top;
}
