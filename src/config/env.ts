/**
 * Leitura centralizada e tipada das variáveis de ambiente (`import.meta.env`).
 *
 * Toda a aplicação deve importar daqui em vez de acessar `import.meta.env.VITE_*`
 * diretamente. Isso concentra os fallbacks, facilita o `npm run setup` (que
 * reescreve o base path padrão `/calendario-interno/` neste arquivo) e dá um único ponto
 * de verdade tipado para configuração de runtime.
 *
 * Variáveis usadas pelo frontend precisam ter o prefixo `VITE_`.
 */
export const env = {
   /** URL base do Axios. Mantenha relativa em dev para o proxy do Vite atuar. */
   apiUrl: import.meta.env.VITE_API_URL || "http://localhost:3000/api/",

   /** Base path do Vite e do React Router. Deve terminar com "/". */
   baseUrl: import.meta.env.VITE_BASE_URL || "/calendario-interno/",

   /** URL do SSO para onde o interceptor redireciona no 401. */
   loginUrl: import.meta.env.VITE_LOGIN_URL || "/intranet/intranet/build/index.html#/funcionario",

   /** `true` em desenvolvimento (`vite`), `false` no build de produção. */
   isDev: import.meta.env.DEV,
} as const;
