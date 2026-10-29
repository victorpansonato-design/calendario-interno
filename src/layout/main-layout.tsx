import { Suspense, useEffect, useRef } from "react";

import { Loader2, User } from "lucide-react";
import { motion } from "motion/react";
import { Outlet, useLocation } from "react-router-dom";

import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { BannerDataSimulada, ProcessoPainel, SeletorSetor } from "@/features/calendario";
import { useAuth } from "@/hooks/use-auth";
import { AppSidebar } from "@/layout/app-sidebar";
import { NavTitle } from "@/layout/nav-title";

export default function MainLayout() {
   const { user } = useAuth();
   const { pathname } = useLocation();
   const canvasRef = useRef<HTMLDivElement>(null);

   // Reposionar o scroll após a mudança de rota.
   useEffect(() => {
      canvasRef.current?.scrollTo({ top: 0 });
   }, [pathname]);

   return (
      <SidebarProvider className="h-svh overflow-hidden">
         <AppSidebar />

         <SidebarInset className="overflow-hidden bg-canvas text-canvas-foreground md:border md:border-border md:peer-data-[variant=inset]:shadow-elevated">
            <header className="flex h-14 shrink-0 items-center gap-3 border-b border-border px-5">
               <SidebarTrigger className="-ml-1 cursor-pointer text-muted-foreground hover:text-foreground" />
               <div className="h-5 w-px bg-border" aria-hidden />
               <NavTitle />
               <div className="ml-auto flex items-center gap-3">
                  <div className="hidden items-center gap-2 lg:flex">
                     <span className="text-[11px] font-semibold uppercase tracking-[0.06em] text-muted-foreground">Meu setor</span>
                     <SeletorSetor compacto className="w-52" />
                  </div>
                  <div className="hidden items-center gap-1 text-xs text-muted-foreground sm:flex">
                     <User className="h-3 w-3" />
                     <span>{user?.nome}</span>
                  </div>
               </div>
            </header>
            <BannerDataSimulada />

            <div ref={canvasRef} className="flex-1 overflow-y-auto overscroll-contain">
               <div className="px-8 pb-12 pt-2">
                  <motion.div
                     key={pathname}
                     initial={{ opacity: 0, y: 10 }}
                     animate={{ opacity: 1, y: 0 }}
                     transition={{ duration: 0.35, ease: "easeOut" }}
                     className="mx-auto"
                  >
                     <Suspense
                        fallback={
                           <div className="flex h-64 items-center justify-center" aria-busy="true">
                              <Loader2 className="size-6 animate-spin text-muted-foreground" aria-label="Carregando" />
                           </div>
                        }
                     >
                        <Outlet />
                     </Suspense>
                  </motion.div>
               </div>
            </div>
            <ProcessoPainel />
         </SidebarInset>
      </SidebarProvider>
   );
}
