import { z } from "zod";
import { validCPF, validRG } from "@/utils/format";

// Lista de espécies de animais
export const animalSpecies = [
  "Canino",
  "Felino",
  "Ave",
  "Roedor",
  "Réptil",
  "Peixe",
  "Outros",
] as const;

// Lista das principais raças de cães
export const dogBreeds = [
  "Labrador Retriever",
  "Golden Retriever",
  "Pastor Alemão",
  "Bulldog Francês",
  "Bulldog Inglês",
  "Poodle",
  "Rottweiler",
  "Yorkshire Terrier",
  "Chihuahua",
  "Dachshund (Salsicha)",
  "Siberian Husky",
  "Border Collie",
  "Boxer",
  "Shih Tzu",
  "Maltês",
  "Cocker Spaniel",
  "Beagle",
  "Pug",
  "Doberman",
  "Akita",
  "Bernese Mountain Dog",
  "Chow Chow",
  "Dálmata",
  "Great Dane",
  "Mastiff",
  "Pitbull",
  "Schnauzer",
  "Weimaraner",
  "Basset Hound",
  "Bichon Frisé",
  "Boston Terrier",
  "Cavalier King Charles Spaniel",
  "Jack Russell Terrier",
  "Lhasa Apso",
  "Papillon",
  "Pomeranian",
  "Samoyed",
  "Setter Irlandês",
  "Spitz Alemão",
  "Vizsla",
  "SRD (Sem Raça Definida)",
] as const;

export const patientFormSchema = z.object({
  // Dados do Animal
  name: z.string().min(2, { message: "Nome deve ter pelo menos 2 caracteres." }).max(50, { message: "Nome deve ter no máximo 50 caracteres." }),
  species: z.enum(animalSpecies, {
    message: "Selecione uma espécie válida",
  }),
  breed: z.enum(dogBreeds, {
    message: "Selecione uma raça válida",
  }),
  dateBirth: z.string().optional().or(z.literal("")),
  coat: z.string().min(2, { message: "Pelagem deve ter pelo menos 2 caracteres." }).max(50, { message: "Pelagem deve ter no máximo 50 caracteres." }),
  sex: z.enum(["Macho", "Fêmea"], {
    message: "Selecione o sexo do animal",
  }),
  
  // Dados do Tutor
  ownerName: z.string().min(2, { message: "Nome do tutor deve ter pelo menos 2 caracteres." }).max(100, { message: "Nome do tutor deve ter no máximo 100 caracteres." }),
  ownerPhone: z.string().min(10, { message: "Telefone do tutor inválido." }).max(15, { message: "Telefone do tutor inválido." }),
  ownerCPF: z
    .string()
    .optional()
    .or(z.literal(""))
    .refine((val) => !val || validCPF(val), { message: "CPF inválido." }),
  ownerRG: z
    .string()
    .optional()
    .or(z.literal(""))
    .refine((val) => !val || validRG(val), { message: "RG inválido." }),
  
  // Endereço
  address: z.string().min(5, { message: "Logradouro deve ter pelo menos 5 caracteres." }).max(100, { message: "Logradouro deve ter no máximo 100 caracteres." }),
  addressNumber: z
    .string()
    .min(1, { message: "Número é obrigatório." })
    .max(10, { message: "Número deve ter no máximo 10 caracteres." })
    .refine((val) => /^\d+$/.test(val.replace(/\D/g, "")), { message: "Número deve conter apenas dígitos." }),
  neighborhood: z.string().min(2, { message: "Bairro deve ter pelo menos 2 caracteres." }).max(50, { message: "Bairro deve ter no máximo 50 caracteres." }),
  zipCode: z
    .string()
    .min(8, { message: "CEP deve ter 8 dígitos." })
    .max(9, { message: "CEP inválido." })
    .refine((val) => {
      const onlyNumbers = val.replace(/\D/g, "");
      return onlyNumbers.length === 8;
    }, { message: "CEP deve ter exatamente 8 dígitos." }),
  
  // Dados Clínicos
  insurance: z.string().optional().or(z.literal("")),
  requestingDoctor: z.string().min(2, { message: "Médico solicitante deve ter pelo menos 2 caracteres." }).max(100, { message: "Médico solicitante deve ter no máximo 100 caracteres." }),
  collectionOrigin: z.string().min(2, { message: "Origem da coleta deve ter pelo menos 2 caracteres." }).max(100, { message: "Origem da coleta deve ter no máximo 100 caracteres." }),
}).refine(
  (data) => data.ownerCPF || data.ownerRG,
  {
    message: "Pelo menos um documento (CPF ou RG) deve ser preenchido.",
    path: ["ownerCPF"], // Mostra o erro no campo CPF
  }
);

export type PatientFormValues = z.infer<typeof patientFormSchema>;