import { env } from "@/config/env";
import MainLayout from "@/layout/main-layout";
import ProtectedHome from "@/pages/protected/home";
import UsersPage from "@/pages/protected/users";
import PrivateRoute from "@/routes/private-route";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";

export default function AppRoute() {
   return (
      <BrowserRouter basename={env.baseUrl}>
         <Toaster position="top-center" />
         <Routes>
            {/* Sem sessão válida, o interceptor redireciona ao SSO automaticamente */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />

            {/* Rotas protegidas */}
            <Route element={<PrivateRoute />}>
               <Route element={<MainLayout />}>
                  <Route path="/dashboard" element={<ProtectedHome />} />
                  <Route path="/users" element={<UsersPage />} />
               </Route>
            </Route>

            <Route path="*" element={<Navigate to="/dashboard" replace />} />
         </Routes>
      </BrowserRouter>
   );
}
