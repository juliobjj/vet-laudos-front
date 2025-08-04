"use client";

import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { z } from "zod";
import { User } from "../datatable/_interface/user";
import { CalendarIcon, Loader2 } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { userFormSchema } from "@/lib/schemas/user.schema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  formatCPF,
  formatPhone,
  parseDate,
  unmaskCPF,
  unmaskDateToISO,
  unmaskPhone,
} from "@/utils/format";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useUpdateUser } from "@/hooks/use-users";

type FormValues = z.infer<typeof userFormSchema>;

export default function EditForm({
  user,
  setIsOpen,
}: {
  user?: User;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  onUpdated?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateUser = useUpdateUser();

  const form = useForm<FormValues>({
    resolver: zodResolver(userFormSchema),
    mode: "onChange",
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      password: "",
      cpf: user?.cpf ? formatCPF(user.cpf) : "",
      phone: user?.phone ? formatPhone(user.phone) : "",
      dateBirth: user?.dateBirth || "",
    },
  });

  const isValid = form.formState.isValid;

  useEffect(() => {
    if (user) {
      form.reset({
        name: user.name || "",
        email: user.email || "",
        password: "",
        cpf: user.cpf ? formatCPF(user.cpf) : "",
        phone: user.phone ? formatPhone(user.phone) : "",
        dateBirth: user.dateBirth || "",
      });
      setDate(parseDate(user.dateBirth));
      form.trigger();
    }
  }, [user, form]);

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    try {
      const payload = {
        ...values,
        password: values.password || undefined,
        cpf: unmaskCPF(values.cpf),
        dateBirth: unmaskDateToISO(date),
        phone: unmaskPhone(values.phone),
      };

      console.log("Enviando payload:", payload);
      console.log("ID do usuário:", user?.id);

      const result = await updateUser.mutateAsync({
        id: user?.id as number,
        user: payload,
      });
      console.log("Resposta da API:", result);

      toast.success(`Dados de ${values.name} atualizados com sucesso!`);
      setIsOpen(false);
    } catch (error) {
      console.error("Erro ao atualizar usuário:", error);
      toast.error("Erro ao atualizar os dados do usuário.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 w-full">
        {/* Nome */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <Input
                  autoComplete="name"
                  {...field}
                  placeholder="Digite seu nome"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Email */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>E-mail</FormLabel>
              <FormControl>
                <Input
                  autoComplete="email"
                  {...field}
                  placeholder="Digite seu e-mail"
                  type="email"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Senha */}
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nova Senha</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Digite uma senha válida"
                  type="password"
                  value={field.value || ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Telefone */}
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Telefone</FormLabel>
              <FormControl>
                <Input
                  autoComplete="phone"
                  {...field}
                  value={field.value || ""}
                  onChange={(e) => field.onChange(formatPhone(e.target.value))}
                  placeholder="(00) 00000-0000"
                  inputMode="tel"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* CPF */}
        <FormField
          name="cpf"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>CPF</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  value={field.value}
                  onChange={(e) => field.onChange(formatCPF(e.target.value))}
                  placeholder="000.000.000-00"
                  inputMode="numeric"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Data de Nascimento */}
        <Controller
          name="dateBirth"
          control={form.control}
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Data de Nascimento</FormLabel>
              <FormControl>
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      id="date"
                      className="w-48 justify-between font-normal"
                    >
                      {date ? date.toLocaleDateString() : "Selecione a data"}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-auto overflow-hidden p-0"
                    align="start"
                  >
                    <Calendar
                      mode="single"
                      selected={date}
                      captionLayout="dropdown"
                      onSelect={(newDate) => {
                        if (!newDate) return;
                        setDate(newDate);
                        setOpen(false);
                        const formatted = newDate.toISOString().split("T")[0];
                        field.onChange(formatted);
                      }}
                    />
                  </PopoverContent>
                </Popover>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Botão salvar */}
        <Button
          type="submit"
          className="w-full bg-blue-600 text-white text-sm rounded-md hover:bg-blue-900 transition px-4 py-2"
          disabled={!isValid || isSubmitting}
        >
          {isSubmitting ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : null}
          Salvar
        </Button>
      </form>
    </Form>
  );
}
