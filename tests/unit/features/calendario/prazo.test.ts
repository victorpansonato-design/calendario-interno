import { calcularUrgencia, compararPorPrazo, montarProcesso, resumir } from "@/features/calendario/lib/prazo";
import type { ProcessoInput } from "@/features/calendario/types/calendario.schema";
import { describe, expect, it } from "vitest";

function processo(parcial: Partial<ProcessoInput> = {}): ProcessoInput {
   return {
      id: "X.01",
      nome: "Processo de teste",
      nomeTecnico: null,
      bloco: "preparacao",
      responsaveis: ["curadoria"],
      prazo: "2027-01-20",
      prazoTipo: "data",
      prazoProposto: false,
      quando: null,
      ajusteData: null,
      dependencia: "paralela",
      antecessor: null,
      eventoId: null,
      diasAntesEvento: null,
      formatos: "",
      entregavel: "Algo pronto",
      subprocesso: null,
      origem: "planilha-v1",
      observacao: null,
      canais: [],
      ...parcial,
   };
}

describe("calcularUrgencia", () => {
   it.each([
      ["a-fazer", -1, "atrasado"],
      ["a-fazer", 0, "esta-semana"],
      ["em-andamento", 7, "esta-semana"],
      ["a-fazer", 8, "proximo"],
      ["a-fazer", 30, "proximo"],
      ["a-fazer", 31, "no-prazo"],
   ] as const)("status %s com %i dias → %s", (status, dias, esperado) => {
      expect(calcularUrgencia(status, "data", dias)).toBe(esperado);
   });

   it("concluído e travado vencem qualquer prazo", () => {
      expect(calcularUrgencia("concluido", "data", -10)).toBe("concluido");
      expect(calcularUrgencia("bloqueado", "data", 40)).toBe("bloqueado");
   });

   it("sem data e contínuo não têm atraso", () => {
      expect(calcularUrgencia("a-fazer", "sem-data", null)).toBe("sem-data");
      expect(calcularUrgencia("a-fazer", "continuo", null)).toBe("continuo");
   });
});

describe("montarProcesso", () => {
   it("calcula dias e urgência a partir de hoje", () => {
      const p = montarProcesso(processo({ prazo: "2027-01-25" }), undefined, "2027-01-20");
      expect(p.diasParaPrazo).toBe(5);
      expect(p.urgencia).toBe("esta-semana");
      expect(p.status).toBe("a-fazer");
      expect(p.alterado).toBe(false);
   });

   it("aplica o ajuste sem perder o original", () => {
      const base = processo({ prazo: "2027-01-25" });
      const p = montarProcesso(base, { status: "em-andamento", ajuste: { prazo: "2027-02-10" }, historico: [] }, "2027-01-20");
      expect(p.prazo).toBe("2027-02-10");
      expect(p.original.prazo).toBe("2027-01-25");
      expect(p.alterado).toBe(true);
      expect(p.urgencia).toBe("proximo");
   });
});

describe("resumir e ordenar", () => {
   const hoje = "2027-01-20";
   const lista = [
      montarProcesso(processo({ id: "B", prazo: "2027-01-10" }), undefined, hoje),
      montarProcesso(processo({ id: "C", prazo: null, prazoTipo: "sem-data" }), undefined, hoje),
      montarProcesso(processo({ id: "A", prazo: "2027-01-22" }), { status: "concluido", ajuste: null, historico: [] }, hoje),
   ];

   it("conta atrasados e concluídos", () => {
      const r = resumir(lista);
      expect(r.total).toBe(3);
      expect(r.atrasados).toBe(1);
      expect(r.concluidos).toBe(1);
      expect(r.semData).toBe(1);
      expect(r.percentualConcluido).toBe(33);
   });

   it("ordena por prazo e deixa sem data por último", () => {
      expect([...lista].sort(compararPorPrazo).map(p => p.id)).toEqual(["B", "A", "C"]);
   });
});
