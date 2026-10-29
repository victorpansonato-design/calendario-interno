import { useEffect, useRef } from "react";

import { Building2, User } from "lucide-react";
import { motion } from "motion/react";
import { Outlet, useLocation } from "react-router-dom";

import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
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
               <div className="ml-auto hidden flex-col items-end text-muted-foreground sm:flex">
                  <div className="flex items-center gap-1 text-xs">
                     <User className="h-3 w-3" />
                     <span>{user?.nome}</span>
                  </div>
                  {user?.setor ? (
                     <div className="flex items-center gap-1 text-[0.65rem] leading-tight">
                        <Building2 className="h-2.5 w-2.5" />
                        <span>{user.setor}</span>
                     </div>
                  ) : null}
               </div>
            </header>

            <div ref={canvasRef} className="flex-1 overflow-y-auto overscroll-contain">
               <div className="px-8 pb-12 pt-2">
                  <motion.div
                     key={pathname}
                     initial={{ opacity: 0, y: 10 }}
                     animate={{ opacity: 1, y: 0 }}
                     transition={{ duration: 0.35, ease: "easeOut" }}
                     className="mx-auto"
                  >
                     <Outlet />
                  </motion.div>
               </div>
            </div>
         </SidebarInset>
      </SidebarProvider>
   );
}
