/**
 * "Alimentar o sistema": qualquer setor inclui um processo que estava faltando.
 * Ele entra com a origem "Incluído no sistema" e aparece em todas as telas.
 */
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";

import { MultiSelect } from "@/components/core/multi-select";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useCriarProcesso } from "@/features/calendario/api/calendario.mutations";
import { BLOCOS, DEPENDENCIA_DICA, DEPENDENCIA_LABEL, SETORES } from "@/features/calendario/data/catalogo";
import { useAutor } from "@/features/calendario/hooks/use-autor";
import { useCalendario } from "@/features/calendario/hooks/use-calendario";
import { useProcessoAberto } from "@/features/calendario/hooks/use-processo-aberto";
import { dataCurta } from "@/features/calendario/lib/datas";
import { usePreferenciasStore } from "@/features/calendario/stores/preferencias.store";
import { NovoProcessoSchema, type NovoProcessoInput, type ProcessoInput } from "@/features/calendario/types/calendario.schema";

const SEM_EVENTO = "nenhum";

interface NovoProcessoDialogProps {
   open: boolean;
   onOpenChange: (open: boolean) => void;
}

export function NovoProcessoDialog({ open, onOpenChange }: NovoProcessoDialogProps) {
   const criar = useCriarProcesso();
   const autor = useAutor();
   const meuSetor = usePreferenciasStore(s => s.meuSetor);
   const { visao } = useCalendario();
   const { abrir } = useProcessoAberto();

   const form = useForm<NovoProcessoInput>({
      resolver: zodResolver(NovoProcessoSchema),
      defaultValues: {
         nome: "",
         responsaveis: meuSetor ? [meuSetor] : [],
         bloco: "",
         temData: true,
         prazo: "",
         quando: "",
         dependencia: "paralela",
         eventoId: SEM_EVENTO,
         entregavel: "",
         observacao: "",
      },
   });
   const temData = useWatch({ control: form.control, name: "temData" });
   const dependencia = useWatch({ control: form.control, name: "dependencia" });

   function proximoId(): string {
      const usados = (visao?.processos ?? []).filter(p => p.id.startsWith("N.")).map(p => Number(p.id.slice(2)) || 0);
      const proximo = (usados.length ? Math.max(...usados) : 0) + 1;
      return `N.${String(proximo).padStart(2, "0")}`;
   }

   function onSubmit(v: NovoProcessoInput) {
      const processo: ProcessoInput = {
         id: proximoId(),
         nome: v.nome,
         nomeTecnico: null,
         bloco: v.bloco,
         responsaveis: v.responsaveis,
         prazo: v.temData ? (v.prazo ?? null) : null,
         prazoTipo: v.temData ? "data" : "sem-data",
         prazoProposto: false,
         quando: v.temData ? null : v.quando || null,
         ajusteData: null,
         dependencia: v.dependencia,
         antecessor: null,
         eventoId: v.eventoId && v.eventoId !== SEM_EVENTO ? v.eventoId : null,
         diasAntesEvento: null,
         formatos: "",
         entregavel: v.entregavel,
         subprocesso: null,
         origem: "manual",
         observacao: v.observacao || null,
         canais: [],
      };
      criar.mutate(
         { processo, autor },
         {
            onSuccess: () => {
               toast.success("Processo incluído", { description: `${processo.id} · ${processo.nome}` });
               form.reset();
               onOpenChange(false);
               abrir(processo.id);
            },
            onError: () => toast.error("Não foi possível incluir o processo"),
         },
      );
   }

   return (
      <Dialog open={open} onOpenChange={onOpenChange}>
         <DialogContent className="max-h-[90svh] overflow-y-auto sm:max-w-lg">
            <DialogHeader>
               <DialogTitle>Incluir processo</DialogTitle>
               <DialogDescription>
                  Encontrou algo que precisa estar no calendário? Inclua aqui e todos os setores passam a ver.
               </DialogDescription>
            </DialogHeader>
            <Form {...form}>
               <form id="novo-processo" onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
                  <FormField
                     control={form.control}
                     name="nome"
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>O que precisa ser feito</FormLabel>
                           <FormControl>
                              <Input placeholder="Ex.: Conferir os cards vitrine antes de publicar" {...field} />
                           </FormControl>
                           <FormMessage />
                        </FormItem>
                     )}
                  />
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
                     name="bloco"
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>Etapa do semestre</FormLabel>
                           <Select value={field.value} onValueChange={field.onChange}>
                              <FormControl>
                                 <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Escolha a etapa" />
                                 </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                 {BLOCOS.map(b => (
                                    <SelectItem key={b.id} value={b.id}>
                                       {b.nome}
                                    </SelectItem>
                                 ))}
                              </SelectContent>
                           </Select>
                           <FormMessage />
                        </FormItem>
                     )}
                  />
                  <div className="grid gap-3 rounded-lg bg-surface p-3">
                     <FormField
                        control={form.control}
                        name="temData"
                        render={({ field }) => (
                           <FormItem className="flex items-center justify-between gap-3">
                              <FormLabel className="m-0">Já tem data</FormLabel>
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
                                    <Input placeholder="Ex.: antes de abrir a rematrícula" {...field} value={field.value ?? ""} />
                                 </FormControl>
                              </FormItem>
                           )}
                        />
                     )}
                  </div>
                  <FormField
                     control={form.control}
                     name="eventoId"
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>Serve para qual evento (opcional)</FormLabel>
                           <Select value={field.value} onValueChange={field.onChange}>
                              <FormControl>
                                 <SelectTrigger className="w-full">
                                    <SelectValue />
                                 </SelectTrigger>
                              </FormControl>
                              <SelectContent className="max-h-72">
                                 <SelectItem value={SEM_EVENTO}>Nenhum evento específico</SelectItem>
                                 {(visao?.eventos ?? []).map(e => (
                                    <SelectItem key={e.id} value={e.id}>
                                       {dataCurta(e.inicio)} · {e.nome}
                                    </SelectItem>
                                 ))}
                              </SelectContent>
                           </Select>
                        </FormItem>
                     )}
                  />
                  <FormField
                     control={form.control}
                     name="dependencia"
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>Se atrasar</FormLabel>
                           <Select value={field.value} onValueChange={field.onChange}>
                              <FormControl>
                                 <SelectTrigger className="w-full">
                                    <SelectValue />
                                 </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                 {(["trava", "paralela", "continua"] as const).map(d => (
                                    <SelectItem key={d} value={d}>
                                       {DEPENDENCIA_LABEL[d]}
                                    </SelectItem>
                                 ))}
                              </SelectContent>
                           </Select>
                           <FormDescription>{DEPENDENCIA_DICA[dependencia]}</FormDescription>
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
                              <Textarea rows={2} placeholder="Ex.: todos os cards conferidos e corrigidos" {...field} />
                           </FormControl>
                           <FormMessage />
                        </FormItem>
                     )}
                  />
                  <FormField
                     control={form.control}
                     name="observacao"
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>Observação (opcional)</FormLabel>
                           <FormControl>
                              <Textarea rows={2} {...field} />
                           </FormControl>
                        </FormItem>
                     )}
                  />
               </form>
            </Form>
            <DialogFooter>
               <Button variant="ghost" onClick={() => onOpenChange(false)}>
                  Cancelar
               </Button>
               <Button type="submit" form="novo-processo" disabled={criar.isPending}>
                  {criar.isPending ? "Incluindo..." : "Incluir processo"}
               </Button>
            </DialogFooter>
         </DialogContent>
      </Dialog>
   );
}
