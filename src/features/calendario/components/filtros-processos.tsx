import { X } from "lucide-react";

import { MultiSelect } from "@/components/core/multi-select";
import { Button } from "@/components/ui/button";
import { SearchInput } from "@/components/ui/search-input";
import { BLOCOS, SETORES, URGENCIA_LABEL } from "@/features/calendario/data/catalogo";
import { useFiltrosProcessos } from "@/features/calendario/hooks/use-filtros-processos";
import type { Urgencia } from "@/features/calendario/types/calendario.schema";

const URGENCIAS: Urgencia[] = ["atrasado", "esta-semana", "proximo", "no-prazo", "bloqueado", "concluido", "sem-data", "continuo"];

export function FiltrosProcessos({ mostrarSetor = true }: { mostrarSetor?: boolean }) {
   const { filtros, ativos, setBusca, setSetores, setBlocos, setUrgencias, limpar } = useFiltrosProcessos();

   return (
      <div className="flex flex-wrap items-center gap-2">
         <SearchInput
            key={filtros.busca === "" ? "vazio" : "busca"}
            defaultValue={filtros.busca}
            onChange={e => setBusca(e.target.value)}
            placeholder="Buscar por código, nome ou entrega"
            containerClassName="w-full sm:w-72"
            className="h-9"
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
         {ativos > 0 ? (
            <Button variant="ghost" size="sm" onClick={limpar} className="text-muted-foreground">
               <X className="size-3.5" />
               Limpar filtros
            </Button>
         ) : null}
      </div>
   );
}
