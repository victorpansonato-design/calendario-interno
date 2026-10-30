import { CalendarDays, GanttChart, ListChecks, X } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { useLayoutEffect, useRef } from "react";

import { MultiSelect } from "@/components/core/multi-select";
import { Button } from "@/components/ui/button";
import { SearchInput } from "@/components/ui/search-input";
import { BLOCOS, SETORES, STATUS_LABEL, URGENCIA_LABEL } from "@/features/calendario/data/catalogo";
import { useFiltrosProcessos } from "@/features/calendario/hooks/use-filtros-processos";
import type { Status, Urgencia } from "@/features/calendario/types/calendario.schema";
import { destinoComContexto } from "@/features/calendario/lib/contexto-navegacao";
import { cn } from "@/lib/utils";

const URGENCIAS: Urgencia[] = ["atrasado", "esta-semana", "proximo", "no-prazo", "bloqueado", "concluido", "sem-data", "continuo"];

export function FiltrosProcessos({ mostrarSetor = true }: { mostrarSetor?: boolean }) {
   const toolbar = useRef<HTMLElement>(null);
   useLayoutEffect(() => {
      const elemento = toolbar.current;
      const canvas = elemento?.closest<HTMLElement>("[data-scroll-canvas]");
      if (!elemento || !canvas) return;
      const atualizar = () => canvas.style.setProperty("--altura-consulta", `${elemento.offsetHeight + 16}px`);
      atualizar();
      const observer = typeof ResizeObserver !== "undefined" ? new ResizeObserver(atualizar) : null;
      observer?.observe(elemento);
      return () => {
         observer?.disconnect();
         canvas.style.removeProperty("--altura-consulta");
      };
   }, []);
   const { filtros, ativos, setBusca, setSetores, setBlocos, setUrgencias, setStatus, limpar } = useFiltrosProcessos();
   const { search, pathname } = useLocation();
   const chips = [
      ...(filtros.busca ? [{ chave: "busca", valor: filtros.busca, rotulo: `Busca: ${filtros.busca}`, remover: () => setBusca("") }] : []),
      ...filtros.setores.map(valor => ({
         chave: "setor",
         valor,
         rotulo: `Setor: ${SETORES.find(s => s.id === valor)?.nome ?? valor}`,
         remover: () => setSetores(filtros.setores.filter(v => v !== valor)),
      })),
      ...filtros.blocos.map(valor => ({
         chave: "etapa",
         valor,
         rotulo: `Etapa: ${BLOCOS.find(b => b.id === valor)?.nome ?? valor}`,
         remover: () => setBlocos(filtros.blocos.filter(v => v !== valor)),
      })),
      ...filtros.urgencias.map(valor => ({
         chave: "situacao",
         valor,
         rotulo: `Situação: ${URGENCIA_LABEL[valor] ?? valor}`,
         remover: () => setUrgencias(filtros.urgencias.filter(v => v !== valor)),
      })),
      ...(filtros.status ?? []).map(valor => ({
         chave: "status",
         valor,
         rotulo: `Status: ${STATUS_LABEL[valor] ?? valor}`,
         remover: () => setStatus((filtros.status ?? []).filter(v => v !== valor)),
      })),
   ];

   return (
      <section ref={toolbar} aria-label="Consulta de processos" className="consulta-toolbar sticky top-0 bg-canvas py-3">
         <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
            <nav aria-label="Visualização dos processos" className="flex items-center gap-1 rounded-lg bg-muted p-1">
               {[
                  { to: "/processos", label: "Lista", icon: ListChecks },
                  { to: "/calendario", label: "Calendário", icon: CalendarDays },
                  { to: "/linha-do-tempo", label: "Linha do tempo", icon: GanttChart },
               ].map(({ to, label, icon: Icon }) => (
                  <NavLink
                     key={to}
                     to={destinoComContexto(to, search)}
                     className={cn(
                        "inline-flex min-h-9 items-center gap-2 rounded-md px-3 text-xs font-medium",
                        pathname === to ? "bg-card text-primary shadow-xs" : "text-muted-foreground hover:text-foreground",
                     )}
                  >
                     <Icon className="size-4" aria-hidden />
                     {label}
                  </NavLink>
               ))}
            </nav>
            <span className="text-xs text-muted-foreground">Filtros mantidos entre visualizações</span>
         </div>
         <div className="flex flex-wrap items-center gap-2">
            <SearchInput
               value={filtros.busca}
               onChange={e => setBusca(e.target.value)}
               placeholder="Buscar por código, nome ou entrega"
               containerClassName="w-full sm:w-80"
               className="h-10"
               aria-label="Buscar processo"
            />
            {mostrarSetor ? (
               <MultiSelect
                  label="Setor"
                  opcoes={SETORES.map(s => ({ value: s.id, label: s.nome, hint: s.descricao }))}
                  selecionados={filtros.setores}
                  onChange={setSetores}
               />
            ) : null}
            <MultiSelect
               label="Etapa"
               opcoes={BLOCOS.map(b => ({ value: b.id, label: b.nome, hint: b.descricao }))}
               selecionados={filtros.blocos}
               onChange={setBlocos}
            />
            <MultiSelect
               label="Situação"
               opcoes={URGENCIAS.map(u => ({ value: u, label: URGENCIA_LABEL[u] }))}
               selecionados={filtros.urgencias}
               onChange={v => setUrgencias(v as Urgencia[])}
            />
            <MultiSelect
               label="Status do setor"
               opcoes={Object.entries(STATUS_LABEL).map(([value, label]) => ({ value, label }))}
               selecionados={filtros.status ?? []}
               onChange={v => setStatus(v as Status[])}
            />
            {ativos > 0 ? (
               <Button variant="ghost" size="sm" onClick={limpar} className="text-muted-foreground">
                  <X className="size-3.5" />
                  Limpar filtros
               </Button>
            ) : null}
         </div>
         {ativos > 0 ? (
            <div aria-label="Filtros ativos" className="mt-3 flex flex-wrap gap-2">
               {chips.map(chip => (
                  <Button
                     key={`${chip.chave}-${chip.valor}`}
                     variant="secondary"
                     size="sm"
                     onClick={chip.remover}
                     aria-label={`Remover ${chip.rotulo}`}
                     className="h-auto min-h-9 max-w-full whitespace-normal text-left"
                  >
                     <span className="min-w-0 break-words">{chip.rotulo}</span>
                     <X data-icon="inline-end" aria-hidden />
                  </Button>
               ))}
            </div>
         ) : null}
      </section>
   );
}
