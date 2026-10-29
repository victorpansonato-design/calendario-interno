import { ChevronDown, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
   DropdownMenu,
   DropdownMenuCheckboxItem,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuLabel,
   DropdownMenuSeparator,
   DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export interface OpcaoMultiSelect {
   value: string;
   label: string;
   hint?: string;
}

interface MultiSelectProps {
   label: string;
   opcoes: OpcaoMultiSelect[];
   selecionados: string[];
   onChange: (valores: string[]) => void;
   className?: string;
}

/** Filtro de múltipla escolha em menu suspenso. O menu fica aberto enquanto a pessoa marca. */
export function MultiSelect({ label, opcoes, selecionados, onChange, className }: MultiSelectProps) {
   const quantidade = selecionados.length;
   const resumo =
      quantidade === 0
         ? label
         : quantidade === 1
           ? (opcoes.find(o => o.value === selecionados[0])?.label ?? label)
           : `${label} (${quantidade})`;

   function alternar(valor: string) {
      onChange(selecionados.includes(valor) ? selecionados.filter(v => v !== valor) : [...selecionados, valor]);
   }

   return (
      <DropdownMenu>
         <DropdownMenuTrigger asChild>
            <Button
               variant="outline"
               size="sm"
               className={cn(
                  "max-w-[240px] justify-between gap-2 font-normal",
                  quantidade > 0 && "border-primary/40 bg-primary-soft text-primary hover:bg-primary-soft hover:text-primary",
                  className,
               )}
            >
               <span className="truncate">{resumo}</span>
               <ChevronDown className="size-3.5 shrink-0 opacity-60" aria-hidden />
            </Button>
         </DropdownMenuTrigger>
         <DropdownMenuContent align="start" className="max-h-80 w-72">
            <DropdownMenuLabel className="text-[10px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
               {label}
            </DropdownMenuLabel>
            {opcoes.map(opcao => (
               <DropdownMenuCheckboxItem
                  key={opcao.value}
                  checked={selecionados.includes(opcao.value)}
                  onSelect={event => {
                     event.preventDefault();
                     alternar(opcao.value);
                  }}
               >
                  <span className="flex min-w-0 flex-col">
                     <span className="truncate">{opcao.label}</span>
                     {opcao.hint ? <span className="truncate text-[11px] text-muted-foreground">{opcao.hint}</span> : null}
                  </span>
               </DropdownMenuCheckboxItem>
            ))}
            {quantidade > 0 ? (
               <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onSelect={() => onChange([])} className="text-muted-foreground">
                     <X className="size-3.5" />
                     Limpar seleção
                  </DropdownMenuItem>
               </>
            ) : null}
         </DropdownMenuContent>
      </DropdownMenu>
   );
}
