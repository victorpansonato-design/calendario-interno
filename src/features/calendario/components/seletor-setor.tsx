import { Select, SelectContent, SelectItem, SelectSeparator, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SETORES_REAIS } from "@/features/calendario/data/catalogo";
import { usePreferenciasStore } from "@/features/calendario/stores/preferencias.store";
import { cn } from "@/lib/utils";

const TODOS = "todos-os-setores";

/** "Meu setor": define o recorte padrão do painel. Fica salvo neste navegador. */
export function SeletorSetor({ className, compacto }: { className?: string; compacto?: boolean }) {
   const meuSetor = usePreferenciasStore(s => s.meuSetor);
   const setMeuSetor = usePreferenciasStore(s => s.setMeuSetor);

   return (
      <Select value={meuSetor ?? TODOS} onValueChange={v => setMeuSetor(v === TODOS ? null : v)}>
         <SelectTrigger className={cn("w-full", compacto && "h-8 text-xs", className)} aria-label="Meu setor">
            <SelectValue />
         </SelectTrigger>
         <SelectContent className="max-h-80">
            <SelectItem value={TODOS}>Todos os setores</SelectItem>
            <SelectSeparator />
            {SETORES_REAIS.map(s => (
               <SelectItem key={s.id} value={s.id}>
                  {s.nome}
               </SelectItem>
            ))}
         </SelectContent>
      </Select>
   );
}
