import { Loader2 } from "lucide-react";
import { lazy, Suspense } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";

import { env } from "@/config/env";
import MainLayout from "@/layout/main-layout";
import PrivateRoute from "@/routes/private-route";

// Cada página é carregada só quando a pessoa abre a rota.
const PainelPage = lazy(() => import("@/pages/protected/painel"));
const ProcessosPage = lazy(() => import("@/pages/protected/processos"));
const LinhaDoTempoPage = lazy(() => import("@/pages/protected/linha-do-tempo"));
const CalendarioPage = lazy(() => import("@/pages/protected/calendario"));
const SetoresPage = lazy(() => import("@/pages/protected/setores"));
const RematriculaPage = lazy(() => import("@/pages/protected/rematricula"));
const ContratoPage = lazy(() => import("@/pages/protected/contrato"));
const PontosDeAtencaoPage = lazy(() => import("@/pages/protected/pontos-de-atencao"));
const ComoFuncionaPage = lazy(() => import("@/pages/protected/como-funciona"));

function Carregando() {
   return (
      <div className="flex h-64 items-center justify-center" aria-busy="true">
         <Loader2 className="size-6 animate-spin text-muted-foreground" aria-label="Carregando" />
      </div>
   );
}

export default function AppRoute() {
   return (
      <BrowserRouter basename={env.baseUrl}>
         <Toaster position="top-center" richColors closeButton />
         <Suspense fallback={<Carregando />}>
            <Routes>
               <Route path="/" element={<Navigate to="/painel" replace />} />

               {/* Rotas protegidas (no modo demo, o usuário de demonstração entra direto) */}
               <Route element={<PrivateRoute />}>
                  <Route element={<MainLayout />}>
                     <Route path="/painel" element={<PainelPage />} />
                     <Route path="/processos" element={<ProcessosPage />} />
                     <Route path="/linha-do-tempo" element={<LinhaDoTempoPage />} />
                     <Route path="/calendario" element={<CalendarioPage />} />
                     <Route path="/setores" element={<SetoresPage />} />
                     <Route path="/rematricula" element={<RematriculaPage />} />
                     <Route path="/contrato" element={<ContratoPage />} />
                     <Route path="/pontos-de-atencao" element={<PontosDeAtencaoPage />} />
                     <Route path="/como-funciona" element={<ComoFuncionaPage />} />
                  </Route>
               </Route>

               <Route path="*" element={<Navigate to="/painel" replace />} />
            </Routes>
         </Suspense>
      </BrowserRouter>
   );
}
