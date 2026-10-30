import { filtrarProcessos } from "@/features/calendario/hooks/use-filtros-processos";
import { montarProcesso } from "@/features/calendario/lib/prazo";
import { PROCESSOS_SEED } from "@/features/calendario/data/processos.seed";
import { describe, expect, it } from "vitest";

const processos = PROCESSOS_SEED.map(p => montarProcesso(p, undefined, "2027-01-20"));
const vazio = { busca: "", setores: [], blocos: [], urgencias: [] };

describe("filtrarProcessos", () => {
   it("busca sem diferenciar acentos e maiúsculas", () => {
      const r = filtrarProcessos(processos, { ...vazio, busca: "MATRICULA" });
      expect(r.length).toBeGreaterThan(0);
      expect(r.every(p => /matr[ií]cula/i.test([p.nome, p.nomeTecnico, p.entregavel, p.subprocesso?.nome].join(" ")))).toBe(true);
   });

   it("filtra por setor responsável", () => {
      const r = filtrarProcessos(processos, { ...vazio, setores: ["ti-sistemas"] });
      expect(r.length).toBeGreaterThan(0);
      expect(r.every(p => p.responsaveis.includes("ti-sistemas"))).toBe(true);
   });

   it("encontra pelo código", () => {
      expect(filtrarProcessos(processos, { ...vazio, busca: "K.04" }).map(p => p.id)).toEqual(["K.04"]);
   });
   it("combina o status existente com setor e busca sem mudar a situação calculada", () => {
      const original = processos.find(p => p.responsaveis.includes("ti-sistemas"))!;
      const emAndamento = { ...original, status: "em-andamento" as const };
      const r = filtrarProcessos([emAndamento], { ...vazio, setores: ["ti-sistemas"], busca: original.id, status: ["em-andamento"] });
      expect(r).toEqual([emAndamento]);
      expect(r[0].urgencia).toBe(original.urgencia);
      expect(filtrarProcessos([emAndamento], { ...vazio, status: ["concluido"] })).toEqual([]);
   });
});
