import { CHAVE_ARMAZENAMENTO, criarRepositorioLocal } from "@/features/calendario/api/calendario.repository";
import { BLOCOS, SETORES } from "@/features/calendario/data/catalogo";
import { beforeEach, describe, expect, it } from "vitest";

function memoria(): Storage {
   const dados = new Map<string, string>();
   return {
      get length() {
         return dados.size;
      },
      clear: () => dados.clear(),
      getItem: k => dados.get(k) ?? null,
      key: i => [...dados.keys()][i] ?? null,
      removeItem: k => void dados.delete(k),
      setItem: (k, v) => void dados.set(k, v),
   };
}

describe("dados iniciais", () => {
   it("todos os processos têm nome simples, setor e etapa conhecidos", async () => {
      const { processos, eventos } = await criarRepositorioLocal(memoria()).carregar();
      const setores = new Set(SETORES.map(s => s.id));
      const blocos = new Set(BLOCOS.map(b => b.id));
      const eventosIds = new Set(eventos.map(e => e.id));
      const ids = processos.map(p => p.id);

      expect(new Set(ids).size).toBe(ids.length);
      for (const p of processos) {
         expect(p.nome.length).toBeGreaterThan(3);
         expect(blocos.has(p.bloco)).toBe(true);
         p.responsaveis.forEach(r => expect(setores.has(r)).toBe(true));
         if (p.eventoId) expect(eventosIds.has(p.eventoId)).toBe(true);
         if (p.prazoTipo === "data") expect(p.prazo).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      }
   });

   it("a limpeza de ficha está dividida por modalidade, depois de cada prorrogação", async () => {
      const { processos } = await criarRepositorioLocal(memoria()).carregar();
      const limpeza = Object.fromEntries(processos.filter(p => p.id.startsWith("A1.23")).map(p => [p.id, p.prazo]));
      expect(limpeza).toEqual({ "A1.23-P": "2027-02-24", "A1.23-E": "2027-03-03", "A1.23-H": "2027-02-22" });
   });
});

describe("registros do setor", () => {
   let storage: Storage;
   beforeEach(() => {
      storage = memoria();
   });

   it("muda o status e guarda no histórico", async () => {
      const repo = criarRepositorioLocal(storage);
      await repo.mudarStatus("A1.04", "em-andamento", "Teste · Curadoria");
      const { estados } = await repo.carregar();
      expect(estados["A1.04"].status).toBe("em-andamento");
      expect(estados["A1.04"].historico[0]).toMatchObject({ tipo: "status", status: "em-andamento", por: "Teste · Curadoria" });
   });

   it("ajusta e volta ao original", async () => {
      const repo = criarRepositorioLocal(storage);
      await repo.ajustar("A1.04", { prazo: "2026-12-01" }, "Teste", "Alterou prazo.");
      expect((await repo.carregar()).estados["A1.04"].ajuste).toEqual({ prazo: "2026-12-01" });
      await repo.restaurarOriginal("A1.04", "Teste");
      const estado = (await repo.carregar()).estados["A1.04"];
      expect(estado.ajuste).toBeNull();
      expect(estado.historico).toHaveLength(2);
   });

   it("inclui e exclui um processo novo", async () => {
      const repo = criarRepositorioLocal(storage);
      const antes = (await repo.carregar()).processos.length;
      await repo.criarProcesso(
         {
            id: "N.01",
            nome: "Processo incluído",
            nomeTecnico: null,
            bloco: "contrato",
            responsaveis: ["ti-sistemas"],
            prazo: null,
            prazoTipo: "sem-data",
            prazoProposto: false,
            quando: null,
            ajusteData: null,
            dependencia: "paralela",
            antecessor: null,
            eventoId: null,
            diasAntesEvento: null,
            formatos: "",
            entregavel: "Pronto",
            subprocesso: null,
            origem: "manual",
            observacao: null,
            canais: [],
         },
         "Teste",
      );
      expect((await repo.carregar()).processos).toHaveLength(antes + 1);
      await repo.excluirProcessoCriado("N.01");
      expect((await repo.carregar()).processos).toHaveLength(antes);
   });

   it("ignora dados corrompidos no navegador", async () => {
      storage.setItem(CHAVE_ARMAZENAMENTO, "{isto não é json");
      const { estados } = await criarRepositorioLocal(storage).carregar();
      expect(estados).toEqual({});
   });
});
