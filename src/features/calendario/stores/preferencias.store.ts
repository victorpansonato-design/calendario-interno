/**
 * Preferências da pessoa (ficam neste navegador):
 * - `meuSetor`: abre o painel já filtrado pelo setor de quem está usando.
 * - `dataSimulada`: para testar o calendário "como se hoje fosse" outra data.
 */
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type PreferenciasState = {
   meuSetor: string | null;
   dataSimulada: string | null;
   setMeuSetor: (setor: string | null) => void;
   setDataSimulada: (data: string | null) => void;
};

export const usePreferenciasStore = create<PreferenciasState>()(
   persist(
      set => ({
         meuSetor: null,
         dataSimulada: null,
         setMeuSetor: meuSetor => set({ meuSetor }),
         setDataSimulada: dataSimulada => set({ dataSimulada }),
      }),
      { name: "calendario-interno:preferencias", storage: createJSONStorage(() => localStorage) },
   ),
);
