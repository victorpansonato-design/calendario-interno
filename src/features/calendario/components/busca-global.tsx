import { ArrowRight, CalendarDays, FileSearch, Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { useCalendario } from "@/features/calendario/hooks/use-calendario";
import { filtrarProcessos } from "@/features/calendario/hooks/use-filtros-processos";
import { contextoConsulta, destinoComContexto, normalizarBusca } from "@/features/calendario/lib/contexto-navegacao";
import { dataCurta, intervalo } from "@/features/calendario/lib/datas";
import { lembrarOrigemDetalhe } from "@/features/calendario/lib/retorno-detalhe";

const DESTINOS = [
   { nome: "Meu painel", path: "/painel" },
   { nome: "Processos", path: "/processos" },
   { nome: "Calendário", path: "/calendario" },
   { nome: "Linha do tempo", path: "/linha-do-tempo" },
   { nome: "Por setor", path: "/setores" },
   { nome: "Rematrícula", path: "/rematricula" },
   { nome: "Novo contrato", path: "/contrato" },
   { nome: "Pontos de atenção", path: "/pontos-de-atencao" },
   { nome: "Como funciona", path: "/como-funciona" },
];

export function BuscaGlobal() {
   const [open, setOpen] = useState(false);
   const [busca, setBusca] = useState("");
   const { visao, isLoading, isError, refetch } = useCalendario();
   const { search } = useLocation();
   const navigate = useNavigate();
   const trigger = useRef<HTMLButtonElement>(null);
   const destino = useRef<string | null>(null);

   useEffect(() => {
      function atalhos(event: KeyboardEvent) {
         if (event.key.toLowerCase() !== "k" || (!event.ctrlKey && !event.metaKey) || event.altKey || event.isComposing || event.repeat)
            return;
         if (
            event.target instanceof HTMLElement &&
            (event.target.isContentEditable || event.target.closest("input, textarea, select, [role=dialog]"))
         )
            return;
         event.preventDefault();
         setBusca("");
         setOpen(true);
      }
      document.addEventListener("keydown", atalhos);
      return () => document.removeEventListener("keydown", atalhos);
   }, []);

   function selecionar(path: string) {
      destino.current = path;
      setOpen(false);
   }
   const termo = normalizarBusca(busca.trim());
   const processos = termo && visao ? filtrarProcessos(visao.processos, { busca, setores: [], blocos: [], urgencias: [] }) : [];
   const eventos = termo ? (visao?.eventos.filter(e => normalizarBusca(e.nome).includes(termo)) ?? []) : [];
   const telas = DESTINOS.filter(d => normalizarBusca(d.nome).includes(termo));

   return (
      <>
         <Button
            ref={trigger}
            variant="outline"
            onClick={() => {
               setBusca("");
               setOpen(true);
            }}
            aria-label="Busca global"
            aria-keyshortcuts="Control+k Meta+k"
            className="min-h-10 gap-2 sm:min-w-52"
         >
            <Search data-icon="inline-start" aria-hidden />
            <span className="hidden sm:inline">Buscar no calendário</span>
            <span className="sm:hidden">Buscar</span>
            <kbd className="ml-auto hidden rounded border bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground lg:inline">
               Ctrl / ⌘ K
            </kbd>
         </Button>
         <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent
               className="gap-0 overflow-hidden p-0 sm:max-w-2xl"
               onCloseAutoFocus={event => {
                  event.preventDefault();
                  if (destino.current) {
                     const path = destino.current;
                     destino.current = null;
                     navigate(path);
                  } else trigger.current?.focus({ preventScroll: true });
               }}
            >
               <div className="px-4 pb-3 pt-4 pr-12">
                  <DialogTitle>Buscar no calendário</DialogTitle>
                  <DialogDescription className="mt-1">
                     Todos os setores. Encontre processos, eventos acadêmicos e telas existentes.
                  </DialogDescription>
               </div>
               <Command shouldFilter={false}>
                  <CommandInput
                     value={busca}
                     onValueChange={setBusca}
                     placeholder="Código, nome, entrega ou tela…"
                     aria-label="Busca global"
                     className="h-12"
                  />
                  <CommandList className="max-h-[55dvh]" aria-label="Resultados da busca global">
                     <CommandEmpty>Nenhum resultado. Tente um código ou parte do nome.</CommandEmpty>
                     {isLoading ? (
                        <div role="status" className="p-4 text-sm">
                           Carregando processos e eventos…
                        </div>
                     ) : null}
                     {isError ? (
                        <div role="alert" className="p-4 text-sm">
                           Não foi possível carregar os dados.{" "}
                           <Button variant="outline" size="sm" onClick={() => void refetch()}>
                              Tentar de novo
                           </Button>
                        </div>
                     ) : null}
                     {telas.length ? (
                        <CommandGroup heading="Ir para">
                           {telas.map(tela => (
                              <CommandItem
                                 key={tela.path}
                                 value={tela.path}
                                 onSelect={() => selecionar(destinoComContexto(tela.path, search))}
                                 className="min-h-11"
                              >
                                 <ArrowRight aria-hidden />
                                 {tela.nome}
                              </CommandItem>
                           ))}
                        </CommandGroup>
                     ) : null}
                     {processos.length ? (
                        <CommandGroup heading={`Processos · ${processos.length} encontrados`}>
                           {processos.slice(0, 20).map(p => (
                              <CommandItem
                                 key={p.id}
                                 value={p.id}
                                 onSelect={() => {
                                    lembrarOrigemDetalhe(p.id, trigger.current);
                                    const params = contextoConsulta(search);
                                    params.set("processo", p.id);
                                    selecionar(`/processos?${params}`);
                                 }}
                                 className="items-start py-3"
                              >
                                 <FileSearch aria-hidden />
                                 <span className="min-w-0">
                                    <span className="mr-2 font-mono text-xs text-primary">{p.id}</span>
                                    {p.nome}
                                    <span className="mt-1 block text-xs text-muted-foreground">
                                       {p.prazo ? dataCurta(p.prazo) : (p.quando ?? "Sem data")}
                                    </span>
                                 </span>
                              </CommandItem>
                           ))}
                           {processos.length > 20 ? (
                              <CommandItem
                                 value="todos-resultados"
                                 onSelect={() => selecionar(`/processos?busca=${encodeURIComponent(busca)}`)}
                              >
                                 Ver os {processos.length} processos na lista
                                 <ArrowRight aria-hidden />
                              </CommandItem>
                           ) : null}
                        </CommandGroup>
                     ) : null}
                     {eventos.length ? (
                        <CommandGroup heading="Eventos acadêmicos e rematrícula">
                           {eventos.map(e => (
                              <CommandItem
                                 key={e.id}
                                 value={e.id}
                                 onSelect={() => {
                                    const params = contextoConsulta(search);
                                    params.set("mes", e.inicio.slice(0, 7));
                                    params.set("dia", e.inicio);
                                    selecionar(`/calendario?${params}`);
                                 }}
                                 className="items-start py-3"
                              >
                                 <CalendarDays aria-hidden />
                                 <span>
                                    {e.nome}
                                    <span className="mt-1 block text-xs text-muted-foreground">{intervalo(e.inicio, e.fim)}</span>
                                 </span>
                              </CommandItem>
                           ))}
                        </CommandGroup>
                     ) : null}
                  </CommandList>
                  <p className="border-t px-4 py-3 text-xs text-muted-foreground">↑ ↓ navegar · Enter abrir · Esc fechar</p>
               </Command>
            </DialogContent>
         </Dialog>
      </>
   );
}
