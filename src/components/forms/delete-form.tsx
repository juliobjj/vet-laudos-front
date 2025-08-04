"use client";

import React, { Dispatch, SetStateAction } from "react";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { DialogFooter } from "../ui/dialog";
import { useDeleteUser } from "@/hooks/use-users";
import { toast } from "sonner";

const formSchema = z.object({
  userId: z.number(),
});

export default function DeleteForm({
  userId,
  setIsOpen,
}: {
  userId: number;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const deleteUser = useDeleteUser();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userId: userId,
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async () => {
    try {
      await deleteUser.mutateAsync(userId);
      toast.success("Usuário deletado com sucesso!");
      setIsOpen(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6  sm:px-0 px-4"
      >
        <DialogFooter className="flex justify-end gap-2">
          <Button
            size="lg"
            variant="outline"
            disabled={isLoading}
            className="hidden sm:block"
            type="button"
            onClick={() => setIsOpen(false)}
          >
            Cancel
          </Button>
          <Button
            size="lg"
            type="submit"
            disabled={isLoading}
            className=" bg-red-500 hover:bg-red-400"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting
              </>
            ) : (
              <span>Delete</span>
            )}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
