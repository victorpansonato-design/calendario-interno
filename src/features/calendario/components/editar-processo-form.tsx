/**
 * Ajuste de um processo (nome, prazo, responsáveis, entrega).
 * O valor original da planilha nunca é apagado: o ajuste fica por cima e
 * pode ser desfeito com "Voltar ao original".
 */
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { MultiSelect } from "@/components/core/multi-select";
import { Button } from "@/components/ui/button";
import { Callout } from "@/components/ui/callout";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useAjustarProcesso } from "@/features/calendario/api/calendario.mutations";
import { nomeSetor, SETORES } from "@/features/calendario/data/catalogo";
import { useAutor } from "@/features/calendario/hooks/use-autor";
import { dataCurta } from "@/features/calendario/lib/datas";
import type { Ajuste, Processo } from "@/features/calendario/types/calendario.schema";

const EditarSchema = z
   .object({
      nome: z.string().trim().min(5, "Mínimo de 5 letras"),
      temData: z.boolean(),
      prazo: z.string().optional(),
      quando: z.string().trim().optional(),
      responsaveis: z.array(z.string()).min(1, "Escolha pelo menos um setor"),
      entregavel: z.string().trim().min(5, "Diga o que precisa estar pronto"),
   })
   .refine(v => !v.temData || (v.prazo && /^\d{4}-\d{2}-\d{2}$/.test(v.prazo)), { message: "Informe a data", path: ["prazo"] });

type EditarInput = z.infer<typeof EditarSchema>;

interface EditarProcessoFormProps {
   processo: Processo;
   onConcluir: () => void;
}

export function EditarProcessoForm({ processo, onConcluir }: EditarProcessoFormProps) {
   const ajustar = useAjustarProcesso();
   const autor = useAutor();
   const continuo = processo.prazoTipo === "continuo";

   const form = useForm<EditarInput>({
      resolver: zodResolver(EditarSchema),
      defaultValues: {
         nome: processo.nome,
         temData: processo.prazoTipo === "data",
         prazo: processo.prazo ?? "",
         quando: processo.quando ?? "",
         responsaveis: processo.responsaveis,
         entregavel: processo.entregavel,
      },
   });
   const temData = useWatch({ control: form.control, name: "temData" });

   function onSubmit(v: EditarInput) {
      const ajuste: Ajuste = {};
      const mudancas: string[] = [];
      if (v.nome !== processo.nome) {
         ajuste.nome = v.nome;
         mudancas.push(`nome para "${v.nome}"`);
      }
      if (!continuo) {
         const novoTipo = v.temData ? "data" : "sem-data";
         const novoPrazo = v.temData ? (v.prazo ?? null) : null;
         if (novoTipo !== processo.prazoTipo || novoPrazo !== processo.prazo) {
            ajuste.prazoTipo = novoTipo;
            ajuste.prazo = novoPrazo;
            mudancas.push(novoPrazo ? `prazo para ${dataCurta(novoPrazo)}` : "prazo para sem data");
         }
         const novoQuando = v.temData ? null : v.quando || null;
         if (novoQuando !== processo.quando) {
            ajuste.quando = novoQuando;
            if (novoQuando) mudancas.push(`quando para "${novoQuando}"`);
         }
      }
      if (v.responsaveis.join() !== processo.responsaveis.join()) {
         ajuste.responsaveis = v.responsaveis;
         mudancas.push(`responsáveis para ${v.responsaveis.map(nomeSetor).join(", ")}`);
      }
      if (v.entregavel !== processo.entregavel) {
         ajuste.entregavel = v.entregavel;
         mudancas.push("o que precisa estar pronto");
      }
      if (!mudancas.length) {
         onConcluir();
         return;
      }
      ajustar.mutate(
         { id: processo.id, ajuste, autor, resumo: `Alterou ${mudancas.join("; ")}.` },
         {
            onSuccess: () => {
               toast.success("Ajuste salvo", { description: "O valor original continua guardado." });
               onConcluir();
            },
            onError: () => toast.error("Não foi possível salvar o ajuste"),
         },
      );
   }

   return (
      <Form {...form}>
         <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 rounded-xl border bg-surface p-4">
            {ajustar.isError ? (
               <Callout tone="danger" title="O ajuste não foi salvo">
                  Os campos foram mantidos. Tente salvar novamente.
               </Callout>
            ) : null}
            <FormField
               control={form.control}
               name="nome"
               render={({ field }) => (
                  <FormItem>
                     <FormLabel>O que precisa ser feito</FormLabel>
                     <FormControl>
                        <Input {...field} />
                     </FormControl>
                     <FormMessage />
                  </FormItem>
               )}
            />

            {!continuo ? (
               <div className="grid gap-3">
                  <FormField
                     control={form.control}
                     name="temData"
                     render={({ field }) => (
                        <FormItem className="flex items-center justify-between gap-3">
                           <FormLabel className="m-0">Tem data definida</FormLabel>
                           <FormControl>
                              <Switch checked={field.value} onCheckedChange={field.onChange} />
                           </FormControl>
                        </FormItem>
                     )}
                  />
                  {temData ? (
                     <FormField
                        control={form.control}
                        name="prazo"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>Prazo</FormLabel>
                              <FormControl>
                                 <Input type="date" {...field} value={field.value ?? ""} />
                              </FormControl>
                              <FormMessage />
                           </FormItem>
                        )}
                     />
                  ) : (
                     <FormField
                        control={form.control}
                        name="quando"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>Quando (opcional)</FormLabel>
                              <FormControl>
                                 <Input placeholder="Ex.: na rematrícula de janeiro" {...field} value={field.value ?? ""} />
                              </FormControl>
                           </FormItem>
                        )}
                     />
                  )}
               </div>
            ) : null}

            <FormField
               control={form.control}
               name="responsaveis"
               render={({ field }) => (
                  <FormItem>
                     <FormLabel>Setores responsáveis</FormLabel>
                     <div>
                        <MultiSelect
                           label="Escolher setores"
                           opcoes={SETORES.map(s => ({ value: s.id, label: s.nome, hint: s.descricao }))}
                           selecionados={field.value}
                           onChange={field.onChange}
                           className="max-w-full"
                        />
                     </div>
                     <FormMessage />
                  </FormItem>
               )}
            />

            <FormField
               control={form.control}
               name="entregavel"
               render={({ field }) => (
                  <FormItem>
                     <FormLabel>O que precisa estar pronto no fim</FormLabel>
                     <FormControl>
                        <Textarea rows={3} {...field} />
                     </FormControl>
                     <FormMessage />
                  </FormItem>
               )}
            />

            <div className="flex justify-end gap-2">
               <Button type="button" variant="ghost" size="sm" onClick={onConcluir}>
                  Cancelar
               </Button>
               <Button type="submit" size="sm" disabled={ajustar.isPending}>
                  {ajustar.isPending ? "Salvando..." : "Salvar ajuste"}
               </Button>
            </div>
         </form>
      </Form>
   );
}
