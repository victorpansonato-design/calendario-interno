import { listarModulos, modulosDoConcluinte, regraDaEntrada } from "@/features/contrato/lib/regras-contrato";
import { describe, expect, it } from "vitest";

describe("regraDaEntrada", () => {
   it.each([
      [1, "21/71", 12, [1, 2, 3, 4], "renovação"],
      [2, "22/72", 9, [2, 3, 4], "reajuste"],
      [3, "23/73", 6, [3, 4], "reajuste"],
      [4, "24/74", 3, [4], "reajuste"],
   ] as const)("entrada %i → código %s, %i meses", (entrada, codigo, meses, modulos, virada) => {
      expect(regraDaEntrada(entrada)).toEqual({ entrada, codigo, duracaoMeses: meses, modulos, viradaEmJaneiro: virada });
   });
});

describe("modulosDoConcluinte", () => {
   it("carrega só as entradas que faltam, a partir da 1", () => {
      expect(modulosDoConcluinte(2)).toEqual([1, 2]);
      expect(modulosDoConcluinte(4)).toEqual([1, 2, 3, 4]);
   });
});

describe("listarModulos", () => {
   it("escreve a lista em português", () => {
      expect(listarModulos([4])).toBe("só o 4");
      expect(listarModulos([2, 3, 4])).toBe("2, 3 e 4");
   });
});
