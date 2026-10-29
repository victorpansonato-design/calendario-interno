import { StatusBadge, UrgenciaBadge } from "@/features/calendario/components/badges";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

describe("badges do calendário", () => {
   it("mostra quantos dias faltam quando o prazo está perto", () => {
      render(<UrgenciaBadge urgencia="esta-semana" dias={3} />);
      expect(screen.getByText("Vence em 3 dias")).toBeInTheDocument();
   });

   it("mostra há quantos dias venceu", () => {
      render(<UrgenciaBadge urgencia="atrasado" dias={-2} />);
      expect(screen.getByText("Atrasado (venceu há 2 dias)")).toBeInTheDocument();
   });

   it("usa o nome simples do status", () => {
      render(<StatusBadge status="bloqueado" />);
      expect(screen.getByText("Travado")).toBeInTheDocument();
   });
});
