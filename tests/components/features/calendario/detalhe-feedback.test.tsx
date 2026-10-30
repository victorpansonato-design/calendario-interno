import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { toast } from "sonner";
import { calendarioRepositorio } from "@/features/calendario/api/calendario.repository";
import { ProcessoPainel } from "@/features/calendario/components/processo-painel";

vi.mock("@/features/calendario/hooks/use-autor", () => ({ useAutor: () => "Teste automatizado" }));

function montar() {
   const client = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } });
   return render(
      <QueryClientProvider client={client}>
         <MemoryRouter initialEntries={["/processos?processo=A1.01"]}>
            <ProcessoPainel />
         </MemoryRouter>
      </QueryClientProvider>,
   );
}

describe("feedback do detalhe", () => {
   beforeEach(() => {
      localStorage.clear();
   });
   it("mantém a nota e apresenta erro persistente quando a gravação falha", async () => {
      vi.spyOn(calendarioRepositorio, "adicionarNota").mockRejectedValue(new Error("Falha de gravação de teste"));
      const sucesso = vi.spyOn(toast, "success");
      montar();
      const campo = await screen.findByRole("textbox", { name: /Registrar uma nota/i });
      fireEvent.change(campo, { target: { value: "Nota de teste que não pode desaparecer" } });
      fireEvent.click(screen.getByRole("button", { name: "Registrar nota" }));
      await screen.findByText("A alteração não foi salva");
      expect(campo).toHaveValue("Nota de teste que não pode desaparecer");
      expect(sucesso).not.toHaveBeenCalled();
   });
   it("só confirma e limpa a nota após a persistência, atualizando o histórico", async () => {
      const sucesso = vi.spyOn(toast, "success");
      montar();
      const campo = await screen.findByRole("textbox", { name: /Registrar uma nota/i });
      fireEvent.change(campo, { target: { value: "Nota de teste persistida" } });
      fireEvent.click(screen.getByRole("button", { name: "Registrar nota" }));
      await waitFor(() => expect(sucesso).toHaveBeenCalledWith("Nota registrada"));
      expect(campo).toHaveValue("");
      expect(await screen.findByText("Nota de teste persistida")).toBeInTheDocument();
   });
});
