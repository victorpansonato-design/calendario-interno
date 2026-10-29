import { AlertTriangle } from "lucide-react";

import { AsyncState } from "@/components/ui/async-state";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { useCalendario } from "@/features/calendario/hooks/use-calendario";

/** Envolve um bloco que depende dos dados do calendário: carregando → erro → conteúdo. */
export function ComDados({ children }: { children: React.ReactNode }) {
   const { isLoading, isError, refetch } = useCalendario();
   return (
      <AsyncState
         isLoading={isLoading}
         isError={isError}
         loading={
            <div className="grid gap-3" aria-busy="true" aria-label="Carregando o calendário">
               <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                  {[0, 1, 2, 3].map(i => (
                     <Skeleton key={i} className="h-[106px] rounded-xl" />
                  ))}
               </div>
               <Skeleton className="h-64 rounded-xl" />
            </div>
         }
         error={
            <EmptyState
               tone="error"
               icon={AlertTriangle}
               title="Não foi possível carregar o calendário"
               hint="Tente de novo. Se continuar, avise o TI."
               actions={
                  <Button variant="outline" size="sm" onClick={() => void refetch()}>
                     Tentar de novo
                  </Button>
               }
            />
         }
      >
         {children}
      </AsyncState>
   );
}
