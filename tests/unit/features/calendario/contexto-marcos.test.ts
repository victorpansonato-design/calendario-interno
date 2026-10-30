import { describe, expect, it } from "vitest";
import { PROCESSOS_SEED } from "@/features/calendario/data/processos.seed";
import { contextoConsulta, destinoComContexto } from "@/features/calendario/lib/contexto-navegacao";
import { agruparMarcos } from "@/features/calendario/lib/marcos";
import { montarProcesso } from "@/features/calendario/lib/prazo";

describe("contexto entre visualizações", () => {
   it("preserva filtros e período, excluindo detalhe e conteúdo privado", () => {
      const query =
         "busca=matrícula&setor=cas&etapa=A1&situacao=proximo&status=em-andamento&mes=2027-01&dia=2027-01-31&zoom=detalhado&agrupar=setor&processo=A1.01&nota=privada";
      const contexto = contextoConsulta(query);
      expect(contexto.get("busca")).toBe("matrícula");
      expect(contexto.get("dia")).toBe("2027-01-31");
      expect(contexto.get("status")).toBe("em-andamento");
      expect(contexto.has("processo")).toBe(false);
      expect(contexto.has("nota")).toBe(false);
      expect(destinoComContexto("/calendario", contexto)).toContain("/calendario?busca=");
      expect(destinoComContexto("/processos", "")).toBe("/processos");
   });
});

describe("marcos com alvos acessíveis", () => {
   const base = montarProcesso(PROCESSOS_SEED[0], undefined, "2026-12-01");
   const itens = [
      { ...base, id: "teste-3", prazo: "2027-01-31" },
      { ...base, id: "teste-1", prazo: "2026-12-31" },
      { ...base, id: "teste-2", prazo: "2027-01-01" },
   ];
   it("reúne colisões reais da escala e preserva todos os itens e suas datas", () => {
      const antes = structuredClone(itens);
      const grupos = agruparMarcos(itens, "2026-12-01", 4);
      expect(grupos).toHaveLength(2);
      expect(grupos[0].itens.map(p => p.id)).toEqual(["teste-1", "teste-2"]);
      expect(grupos.flatMap(g => g.itens)).toHaveLength(itens.length);
      expect(itens).toEqual(antes);
      expect(grupos[1].x - grupos[0].x).toBeGreaterThanOrEqual(48);
   });
   it("separa os marcos quando há espaço e exclui rotinas sem inventar datas", () => {
      expect(agruparMarcos(itens, "2026-12-01", 60)).toHaveLength(3);
      expect(agruparMarcos([{ ...base, prazo: null, prazoTipo: "continuo" }], "2026-12-01", 4)).toEqual([]);
   });
});
