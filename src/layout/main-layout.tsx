import { Suspense, useLayoutEffect, useRef } from "react";

import { Loader2, User } from "lucide-react";
import { MotionConfig } from "motion/react";
import { Outlet, useLocation, useNavigationType } from "react-router-dom";

import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { BannerDataSimulada, BuscaGlobal, ProcessoPainel, SeletorSetor, usePreferenciasStore } from "@/features/calendario";
import { useAuth } from "@/hooks/use-auth";
import { AppSidebar } from "@/layout/app-sidebar";
import { NavTitle } from "@/layout/nav-title";

export default function MainLayout() {
   const { user } = useAuth();
   const meuSetor = usePreferenciasStore(s => s.meuSetor);
   const { pathname } = useLocation();
   const canvasRef = useRef<HTMLDivElement>(null);
   const posicoes = useRef(new Map<string, number>());
   const tipoNavegacao = useNavigationType();

   // Reposionar o scroll após a mudança de rota.
   useLayoutEffect(() => {
      const canvas = canvasRef.current;
      const mapaPosicoes = posicoes.current;
      if (!canvas) return;
      canvas.scrollTop = tipoNavegacao === "POP" ? (mapaPosicoes.get(pathname) ?? 0) : 0;
      return () => {
         mapaPosicoes.set(pathname, canvas.scrollTop);
      };
      // Abertura do drawer e mudanças de filtro não reiniciam a posição da tela.
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [pathname]);

   return (
      <MotionConfig reducedMotion="user">
         <SidebarProvider className="h-svh overflow-hidden">
            <a href="#conteudo-principal" className="skip-link">
               Ir para o conteúdo
            </a>
            <AppSidebar />

            <SidebarInset className="overflow-hidden bg-canvas text-canvas-foreground md:border md:border-border md:peer-data-[variant=inset]:shadow-elevated">
               <header className="flex min-h-14 shrink-0 items-center gap-2 border-b border-border px-3 sm:gap-3 sm:px-5">
                  <SidebarTrigger
                     aria-label="Abrir ou recolher navegação"
                     className="-ml-1 size-11 cursor-pointer text-muted-foreground hover:text-foreground"
                  />
                  <div className="h-5 w-px bg-border" aria-hidden />
                  <NavTitle />
                  <div className="ml-auto flex items-center gap-3">
                     <BuscaGlobal />
                     {pathname === "/painel" && meuSetor ? (
                        <div className="hidden items-center gap-2 xl:flex">
                           <span className="text-xs text-muted-foreground">Setor do painel</span>
                           <SeletorSetor compacto className="w-52" />
                        </div>
                     ) : null}
                     <div className="hidden items-center gap-1 text-xs text-muted-foreground 2xl:flex">
                        <User className="h-3 w-3" />
                        <span>{user?.nome}</span>
                     </div>
                  </div>
               </header>
               <BannerDataSimulada />

               <div
                  id="conteudo-principal"
                  tabIndex={-1}
                  ref={canvasRef}
                  data-scroll-canvas
                  className="min-w-0 flex-1 overflow-y-auto overscroll-contain"
               >
                  <div className="px-4 pb-12 pt-4 sm:px-6 lg:px-8">
                     <div className="mx-auto min-w-0">
                        <Suspense
                           fallback={
                              <div className="flex h-64 items-center justify-center" aria-busy="true">
                                 <Loader2 className="size-6 animate-spin text-muted-foreground" aria-label="Carregando" />
                              </div>
                           }
                        >
                           <Outlet />
                        </Suspense>
                     </div>
                  </div>
               </div>
               <ProcessoPainel />
            </SidebarInset>
         </SidebarProvider>
      </MotionConfig>
   );
}
