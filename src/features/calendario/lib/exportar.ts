/** Exporta uma lista de processos para CSV (abre no Excel com acentos corretos). */
import { nomeBloco, nomeSetor, STATUS_LABEL, URGENCIA_LABEL } from "@/features/calendario/data/catalogo";
import { dataCurta } from "@/features/calendario/lib/datas";
import type { Processo } from "@/features/calendario/types/calendario.schema";

function celula(valor: string): string {
   return /[";\n]/.test(valor) ? `"${valor.replace(/"/g, '""')}"` : valor;
}

export function processosParaCsv(processos: Processo[]): string {
   const cabecalho = ["Código", "Processo", "Setores", "Etapa", "Prazo", "Status", "Situação", "O que precisa estar pronto"];
   const linhas = processos.map(p => [
      p.id,
      p.nome,
      p.responsaveis.map(nomeSetor).join(", "),
      nomeBloco(p.bloco),
      p.prazoTipo === "data" ? dataCurta(p.prazo) : p.prazoTipo === "continuo" ? "Semestre todo" : (p.quando ?? "Sem data"),
      STATUS_LABEL[p.status],
      URGENCIA_LABEL[p.urgencia],
      p.entregavel,
   ]);
   // Separador ";" porque o Excel em pt-BR usa vírgula como separador decimal.
   return [cabecalho, ...linhas].map(l => l.map(celula).join(";")).join("\r\n");
}

export function baixarCsv(nomeArquivo: string, conteudo: string) {
   const blob = new Blob(["﻿" + conteudo], { type: "text/csv;charset=utf-8" });
   const url = URL.createObjectURL(blob);
   const a = document.createElement("a");
   a.href = url;
   a.download = nomeArquivo;
   a.click();
   URL.revokeObjectURL(url);
}
