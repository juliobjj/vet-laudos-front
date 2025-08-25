"use client";

import React, { Dispatch, SetStateAction } from "react";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { DialogFooter } from "../ui/dialog";
import { useDeletePatient } from "@/hooks/use-patients";
import { toast } from "sonner";

const formSchema = z.object({
  patientId: z.number(),
});

export default function DeletePatientForm({
  patientId,
  patientName,
  setIsOpen,
  onDeleted,
}: {
  patientId: number;
  patientName: string;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  onDeleted?: () => void;
}) {
  const deletePatient = useDeletePatient();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      patientId: patientId,
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async () => {
    try {
      await deletePatient.mutateAsync(patientId);
      toast.success(`Paciente ${patientName} deletado com sucesso!`);
      if (onDeleted) onDeleted();
      setIsOpen(false);
    } catch (error) {
      console.error("Erro ao deletar paciente:", error);
      toast.error(`Erro ao deletar paciente: ${error}`);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 sm:px-0 px-4"
      >
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Tem certeza que deseja deletar o paciente <strong>{patientName}</strong>?
          </p>
          <p className="text-xs text-red-500 mt-2">
            Esta ação não pode ser desfeita.
          </p>
        </div>
        
        <DialogFooter className="flex justify-end gap-2">
          <Button
            size="lg"
            variant="outline"
            disabled={isLoading}
            className="hidden sm:block"
            type="button"
            onClick={() => setIsOpen(false)}
          >
            Cancelar
          </Button>
          <Button
            size="lg"
            type="submit"
            disabled={isLoading}
            className="bg-red-500 hover:bg-red-400"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deletando
              </>
            ) : (
              <span>Deletar</span>
            )}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}