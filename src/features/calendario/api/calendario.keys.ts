/** Chaves do React Query do calendário (use sempre estas, nunca arrays soltos). */
export const calendarioKeys = {
   all: ["calendario"] as const,
   dados: () => [...calendarioKeys.all, "dados"] as const,
};
