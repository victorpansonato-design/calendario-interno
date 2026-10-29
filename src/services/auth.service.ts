import { env } from "@/config/env";
import api from "@/services/api";
import type { ApiResponse } from "@/services/types";
import type { AuthUser } from "@/types/auth.types";

/** Usuário usado enquanto não há backend (VITE_AUTH_MODE=demo). */
const USUARIO_DEMO: AuthUser = {
   usuario: "demonstracao",
   nome: "Modo demonstração",
   email: "",
};

class AuthService {
   async me(): Promise<AuthUser> {
      if (env.authMode === "demo") return USUARIO_DEMO;

      const destinationUrl = new URL(window.location.href);

      const { data } = await api.get<ApiResponse<AuthUser>>("/funcionarios/me", {
         params: { destination: destinationUrl.toString() },
      });
      return data.data;
   }

   async logout(): Promise<void> {
      if (env.authMode === "demo") return;
      await api.post("/logout");
   }
}

export const authService = new AuthService();
