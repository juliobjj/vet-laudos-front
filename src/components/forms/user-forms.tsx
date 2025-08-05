"use client";

import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { CalendarIcon, Loader2 } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  userFormSchema,
  userCreateSchema,
  UserFormValues,
  UserCreateFormValues,
} from "@/lib/schemas/user.schema";
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
import { useUpdateUser, useCreateUser } from "@/hooks/use-users";
import { User } from "../datatable/_interface/user";

interface UserFormProps {
  user?: User; // Se user for undefined, é modo cadastro
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  onUpdated?: () => void;
}

export default function UserForm({
  user,
  setIsOpen,
  onUpdated,
}: UserFormProps) {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditMode = !!user;
  const updateUser = useUpdateUser();
  const createUser = useCreateUser();

  // Escolhe o schema baseado no modo
  const schema = isEditMode ? userFormSchema : userCreateSchema;

  const form = useForm({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      password: "",
      ...(isEditMode ? {} : { confirmPassword: "" }),
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
        ...(isEditMode ? {} : { confirmPassword: "" }),
        cpf: user.cpf ? formatCPF(user.cpf) : "",
        phone: user.phone ? formatPhone(user.phone) : "",
        dateBirth: user.dateBirth || "",
      });
      setDate(parseDate(user.dateBirth));
      form.trigger();
    }
  }, [user, form, isEditMode]);

  const onSubmit = async (values: UserFormValues | UserCreateFormValues) => {
    setIsSubmitting(true);
    try {
      const payload = {
        ...values,
        password: values.password,
        cpf: unmaskCPF(values.cpf),
        dateBirth: unmaskDateToISO(date),
        phone: unmaskPhone(values.phone),
      };

      if (isEditMode) {
        await updateUser.mutateAsync({
          id: user?.id as number,
          user: payload,
        });
        toast.success(`Dados de ${values.name} atualizados com sucesso!`);
      } else {
        // Para criação, garante que password seja string
        const createData = {
          ...payload,
          password: payload.password || "",
        };
        await createUser.mutateAsync(createData);
        toast.success(`Usuário ${values.name} criado com sucesso!`);
      }

      if (onUpdated) onUpdated();
      setIsOpen(false);
    } catch (error) {
      console.error("Erro ao processar usuário:", error);
      toast.error(`${error}`);
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
        {isEditMode ? (
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nova Senha</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Digite uma nova senha (opcional)"
                    type="password"
                    value={field.value || ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ) : (
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Senha</FormLabel>
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
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirmar Senha</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Confirme sua senha"
                      type="password"
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}

        {/* Telefone */}
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Telefone</FormLabel>
              <FormControl>
                <Input
                  autoComplete="tel"
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
          {isEditMode ? "Atualizar" : "Cadastrar"}
        </Button>
      </form>
    </Form>
  );
}
