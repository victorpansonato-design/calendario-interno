/**
 * O processo aberto no painel lateral fica na URL (`?processo=A1.04`):
 * dá para mandar o link para outro setor e ele abre direto no mesmo item.
 */
import { useCallback } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { lembrarOrigemDetalhe, restaurarOrigemDetalhe } from "@/features/calendario/lib/retorno-detalhe";

export function useProcessoAberto() {
   const [params, setParams] = useSearchParams();
   const aberto = params.get("processo");
   const location = useLocation();
   const navigate = useNavigate();
   const passos: number = location.state?.processoPassos ?? 0;
   const raizDireta: boolean = location.state?.processoRaizDireta ?? false;

   const abrir = useCallback(
      (id: string | null) => {
         if (id === aberto) return;
         if (id && !aberto) lembrarOrigemDetalhe(id);
         if (!id && passos > 0 && !raizDireta) {
            navigate(-passos);
            return;
         }
         setParams(
            prev => {
               const next = new URLSearchParams(prev);
               if (id) next.set("processo", id);
               else next.delete("processo");
               return next;
            },
            {
               replace: !id,
               state: {
                  ...location.state,
                  processoPassos: id ? passos + 1 : 0,
                  processoRaizDireta: id ? raizDireta || (!!aberto && passos === 0) : false,
               },
            },
         );
      },
      [aberto, passos, raizDireta, navigate, setParams, location.state],
   );

   return {
      aberto,
      abrir,
      restaurarFoco: restaurarOrigemDetalhe,
      podeVoltar: passos > 1 || (raizDireta && passos > 0),
      voltar: () => navigate(-1),
   };
}
