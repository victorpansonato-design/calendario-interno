import { AuthProvider } from "@/contexts/auth/auth-context";
import { QueryProvider } from "@/providers/query-provider";
import AppRoute from "@/routes/app.routes";
import "@/stores/theme.store";
import { MotionConfig } from "motion/react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

createRoot(document.getElementById("root")!).render(
   <StrictMode>
      <MotionConfig reducedMotion="user">
         <QueryProvider>
            <AuthProvider>
               <AppRoute />
            </AuthProvider>
         </QueryProvider>
      </MotionConfig>
   </StrictMode>,
);
