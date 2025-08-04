import { validCPF } from "@/utils/format";
import { z } from "zod";

export const userFormSchema = z.object({
  name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  email: z.string().email("E-mail inválido"),
  password: z
    .string()
    .min(8, "Senha deve ter no mínimo 8 caracteres")
    .optional()
    .or(z.literal("")),
  phone: z.string().min(14, "Telefone inválido").max(15, "Telefone inválido"),
  dateBirth: z.string(),
  cpf: z
    .string()
    .length(14, "CPF deve ter 11 números")
    .refine(validCPF, "CPF inválido"),
});

export type UserFormValues = z.infer<typeof userFormSchema>;
