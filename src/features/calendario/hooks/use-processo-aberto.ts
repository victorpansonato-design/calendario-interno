/**
 * O processo aberto no painel lateral fica na URL (`?processo=A1.04`):
 * dá para mandar o link para outro setor e ele abre direto no mesmo item.
 */
import { useCallback } from "react";
import { useSearchParams } from "react-router-dom";

export function useProcessoAberto() {
   const [params, setParams] = useSearchParams();
   const aberto = params.get("processo");

   const abrir = useCallback(
      (id: string | null) => {
         setParams(
            prev => {
               const next = new URLSearchParams(prev);
               if (id) next.set("processo", id);
               else next.delete("processo");
               return next;
            },
            { replace: false },
         );
      },
      [setParams],
   );

   return { aberto, abrir };
}
