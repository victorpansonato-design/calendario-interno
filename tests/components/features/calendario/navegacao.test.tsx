import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, useLocation } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { FiltrosProcessos } from "@/features/calendario/components/filtros-processos";
import { CalendarioMensal } from "@/features/calendario/components/calendario-mensal";
import { useProcessoAberto } from "@/features/calendario/hooks/use-processo-aberto";

function Localizacao() {
   const location = useLocation();
   return (
      <output aria-label="URL de teste">
         {location.pathname}
         {location.search}
      </output>
   );
}
function DetalheTeste() {
   const { aberto, abrir } = useProcessoAberto();
   return (
      <>
         <button onClick={() => abrir("A1.01")}>Abrir primeiro</button>
         <button onClick={() => abrir("A1.02")}>Abrir relacionado</button>
         <button onClick={() => abrir(null)}>Fechar</button>
         <span>{aberto}</span>
         <Localizacao />
      </>
   );
}

describe("consulta sem perda de contexto", () => {
   it("mantém a instância e o foco da busca enquanto atualiza a URL", () => {
      render(
         <MemoryRouter initialEntries={["/processos"]}>
            <FiltrosProcessos />
            <Localizacao />
         </MemoryRouter>,
      );
      const campo = screen.getByRole("searchbox", { name: "Buscar processo" });
      campo.focus();
      for (const value of ["L", "Ly", "Lyc"]) fireEvent.change(campo, { target: { value } });
      expect(screen.getByRole("searchbox", { name: "Buscar processo" })).toBe(campo);
      expect(campo).toHaveFocus();
      expect(screen.getByLabelText("URL de teste")).toHaveTextContent("busca=Lyc");
   });
   it("remove filtros sem apagar dia, agrupamento ou processo aberto", () => {
      render(
         <MemoryRouter
            initialEntries={["/processos?busca=abc&status=em-andamento&mes=2027-01&dia=2027-01-31&agrupar=setor&processo=A1.01"]}
         >
            <FiltrosProcessos />
            <Localizacao />
         </MemoryRouter>,
      );
      fireEvent.click(screen.getByRole("button", { name: "Limpar filtros" }));
      const url = screen.getByLabelText("URL de teste").textContent!;
      expect(url).toContain("dia=2027-01-31");
      expect(url).toContain("agrupar=setor");
      expect(url).toContain("processo=A1.01");
      expect(url).not.toContain("busca=");
      expect(url).not.toContain("status=");
   });
   it("fecha toda a exploração de relacionados e volta ao contexto de origem", async () => {
      render(
         <MemoryRouter initialEntries={["/processos?busca=matricula&agrupar=setor"]}>
            <DetalheTeste />
         </MemoryRouter>,
      );
      fireEvent.click(screen.getByText("Abrir primeiro"));
      fireEvent.click(screen.getByText("Abrir relacionado"));
      expect(screen.getByLabelText("URL de teste")).toHaveTextContent("processo=A1.02");
      fireEvent.click(screen.getByText("Fechar"));
      await waitFor(() => expect(screen.getByLabelText("URL de teste").textContent).toBe("/processos?busca=matricula&agrupar=setor"));
   });
   it("fecha link direto sem precisar de uma entrada anterior no histórico", () => {
      render(
         <MemoryRouter initialEntries={["/processos?processo=A1.01&busca=matricula"]}>
            <DetalheTeste />
         </MemoryRouter>,
      );
      fireEvent.click(screen.getByText("Fechar"));
      expect(screen.getByLabelText("URL de teste")).toHaveTextContent("/processos?busca=matricula");
   });
   it("fecha os relacionados de um link direto sem reabrir o processo raiz", () => {
      render(
         <MemoryRouter initialEntries={["/processos?processo=A1.01&busca=matricula"]}>
            <DetalheTeste />
         </MemoryRouter>,
      );
      fireEvent.click(screen.getByText("Abrir relacionado"));
      fireEvent.click(screen.getByText("Fechar"));
      expect(screen.getByLabelText("URL de teste")).toHaveTextContent("/processos?busca=matricula");
      expect(screen.getByLabelText("URL de teste").textContent).not.toContain("processo=");
   });
});

describe("agenda por dia", () => {
   it("atravessa a virada do ano por teclado e Hoje seleciona o dia real", () => {
      render(
         <MemoryRouter initialEntries={["/calendario?mes=2026-12&dia=2026-12-31"]}>
            <CalendarioMensal processos={[]} eventos={[]} hoje="2026-10-29" onAbrir={() => undefined} />
            <Localizacao />
         </MemoryRouter>,
      );
      const dia = screen.getByRole("button", { name: /quinta-feira, 31 de dezembro de 2026/ });
      fireEvent.keyDown(dia, { key: "ArrowRight" });
      expect(screen.getByLabelText("URL de teste")).toHaveTextContent("dia=2027-01-01");
      expect(screen.getByRole("button", { name: /sexta-feira, 1 de janeiro de 2027/ })).toHaveAttribute("aria-pressed", "true");
      fireEvent.click(screen.getByRole("button", { name: "Hoje" }));
      expect(screen.getByLabelText("URL de teste")).toHaveTextContent("mes=2026-10&dia=2026-10-29");
      expect(screen.getByRole("button", { name: /quinta-feira, 29 de outubro de 2026/ })).toHaveAttribute("aria-current", "date");
   });
});
