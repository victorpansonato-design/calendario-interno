import { nomeSetor } from "@/features/calendario/data/catalogo";
import { usePreferenciasStore } from "@/features/calendario/stores/preferencias.store";
import { useAuth } from "@/hooks/use-auth";

/** Texto que identifica quem fez cada registro: "Nome · Setor". */
export function useAutor(): string {
   const { user } = useAuth();
   const meuSetor = usePreferenciasStore(s => s.meuSetor);
   const nome = user?.nome ?? "Usuário";
   const setor = meuSetor ? nomeSetor(meuSetor) : user?.setor;
   return setor ? `${nome} · ${setor}` : nome;
}
