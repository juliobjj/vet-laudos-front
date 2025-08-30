"use client";

import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { CalendarIcon, Loader2 } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { 
  patientFormSchema, 
  dogBreeds, 
  animalSpecies, 
  type PatientFormValues 
} from "@/lib/schemas/patient.schema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  formatPhone,
  formatCPF,
  formatRG,
  formatCEP,
  onlyNumbers,
  parseDate,
  unmaskDateToISO,
  unmaskPhone,
  unmaskCPF,
  unmaskRG,
  unmaskCEP,
} from "@/utils/format";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useUpdatePatient, useCreatePatient } from "@/hooks/use-patients";
import { Patient } from "@/components/datatable/interfaces/patient";

interface PatientFormProps {
  patient?: Patient; // Se patient for undefined, é modo cadastro
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  onUpdated?: () => void;
}

export default function PatientForm({
  patient,
  setIsOpen,
  onUpdated,
}: PatientFormProps) {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditMode = !!patient;
  const updatePatient = useUpdatePatient();
  const createPatient = useCreatePatient();

  const defaultValues = patient
    ? {
        // Dados do Animal
        name: patient.name,
        species: patient.species as PatientFormValues['species'],
        breed: patient.breed as PatientFormValues['breed'],
        dateBirth: patient.dateBirth || "",
        coat: patient.coat || "",
        sex: patient.sex as PatientFormValues['sex'],
        
        // Dados do Tutor
        ownerName: patient.ownerName,
        ownerPhone: patient.ownerPhone ? formatPhone(patient.ownerPhone) : "",
        ownerCPF: patient.ownerDocument ? formatCPF(patient.ownerDocument) : "",
        ownerRG: "", // Campo novo, inicialmente vazio
        
        // Endereço
        address: patient.address || "",
        addressNumber: patient.addressNumber || "",
        neighborhood: patient.neighborhood || "",
        zipCode: patient.zipCode ? formatCEP(patient.zipCode) : "",
        
        // Dados Clínicos
        insurance: patient.insurance || "",
        requestingDoctor: patient.requestingDoctor || "",
        collectionOrigin: patient.collectionOrigin || "",
      }
    : {
        // Dados do Animal
        name: "",
        species: "Canino" as PatientFormValues['species'],
        breed: "SRD (Sem Raça Definida)" as PatientFormValues['breed'],
        dateBirth: "",
        coat: "",
        sex: "Macho" as PatientFormValues['sex'],
        
        // Dados do Tutor
        ownerName: "",
        ownerPhone: "",
        ownerDocument: "",
        
        // Endereço
        address: "",
        addressNumber: "",
        neighborhood: "",
        zipCode: "",
        
        // Dados Clínicos
        insurance: "",
        requestingDoctor: "",
        collectionOrigin: "",
      };

  const form = useForm<PatientFormValues>({
    resolver: zodResolver(patientFormSchema),
    mode: "onChange",
    defaultValues,
  });

  const isValid = form.formState.isValid;

  useEffect(() => {
    if (patient) {
      const resetValues = {
        // Dados do Animal
        name: patient.name || "",
        species: patient.species as PatientFormValues['species'] || "Canino",
        breed: patient.breed as PatientFormValues['breed'] || "SRD (Sem Raça Definida)",
        dateBirth: patient.dateBirth || "",
        coat: patient.coat || "",
        sex: patient.sex as PatientFormValues['sex'] || "Macho",
        
        // Dados do Tutor
        ownerName: patient.ownerName || "",
        ownerPhone: patient.ownerPhone ? formatPhone(patient.ownerPhone) : "",
        ownerDocument: patient.ownerDocument || "",
        
        // Endereço
        address: patient.address || "",
        addressNumber: patient.addressNumber || "",
        neighborhood: patient.neighborhood || "",
        zipCode: patient.zipCode || "",
        
        // Dados Clínicos
        insurance: patient.insurance || "",
        requestingDoctor: patient.requestingDoctor || "",
        collectionOrigin: patient.collectionOrigin || "",
      };
      form.reset(resetValues);
      setDate(parseDate(patient.dateBirth));
      form.trigger();
    }
  }, [patient, form]);

  const onSubmit = async (values: PatientFormValues) => {
    setIsSubmitting(true);
    try {
      const payload = {
        ...values,
        dateBirth: unmaskDateToISO(date),
        ownerPhone: unmaskPhone(values.ownerPhone),
        ownerCPF: unmaskCPF(values.ownerCPF || ""),
        ownerRG: unmaskRG(values.ownerRG || ""),
        zipCode: unmaskCEP(values.zipCode),
      };

      if (isEditMode) {
        await updatePatient.mutateAsync({
          id: patient?.id as number,
          patient: payload,
        });
        toast.success(`Dados de ${values.name} atualizados com sucesso!`);
      } else {
        await createPatient.mutateAsync(payload);
        toast.success(`Paciente ${values.name} cadastrado com sucesso!`);
      }

      if (onUpdated) onUpdated();
      setIsOpen(false);
      if (!patient) {
        form.reset();
      }
    } catch (error) {
      console.error("Erro ao processar paciente:", error);
      toast.error(`${error}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
        {/* Layout em duas colunas principais */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Coluna Esquerda */}
          <div className="space-y-6">
            {/* Seção: Dados do Animal */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Dados do Animal</h3>
              
              {/* Nome do Animal */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome do Animal</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Digite o nome do animal"
                        className="h-11"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Espécie e Raça */}
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="species"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Espécie</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-11">
                            <SelectValue placeholder="Selecione a espécie" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {animalSpecies.map((species) => (
                            <SelectItem key={species} value={species}>
                              {species}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="breed"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Raça</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-11">
                            <SelectValue placeholder="Selecione a raça" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {dogBreeds.map((breed) => (
                            <SelectItem key={breed} value={breed}>
                              {breed}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Pelagem e Sexo */}
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="coat"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pelagem</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Ex: Curta, Longa, Lisa"
                          className="h-11"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="sex"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sexo</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-11">
                            <SelectValue placeholder="Selecione o sexo" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Macho">Macho</SelectItem>
                          <SelectItem value="Fêmea">Fêmea</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Data de Nascimento */}
              <FormField
                control={form.control}
                name="dateBirth"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Data de Nascimento</FormLabel>
                    <Popover open={open} onOpenChange={setOpen}>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className="w-full h-11 pl-3 text-left font-normal"
                          >
                            {date ? (
                              new Intl.DateTimeFormat("pt-BR").format(date)
                            ) : (
                              <span>Selecione uma data</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={date}
                          onSelect={(selectedDate) => {
                            setDate(selectedDate);
                            setOpen(false);
                          }}
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Seção: Dados Clínicos */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Dados Clínicos</h3>
              
              {/* Convênio */}
              <FormField
                control={form.control}
                name="insurance"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Convênio (Opcional)</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Nome do convênio ou plano de saúde"
                        className="h-11"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Médico Solicitante e Origem da Coleta */}
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="requestingDoctor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Médico Solicitante</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Nome do médico veterinário"
                          className="h-11"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="collectionOrigin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Origem da Coleta</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Local onde foi realizada a coleta"
                          className="h-11"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>

          {/* Coluna Direita */}
          <div className="space-y-6">
            {/* Seção: Dados do Tutor */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Dados do Tutor</h3>
              
              {/* Nome do Tutor */}
              <FormField
                control={form.control}
                name="ownerName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome do Tutor</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Digite o nome do tutor"
                        className="h-11"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Telefone e CPF/RG */}
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="ownerPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Telefone do Tutor</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="(11) 99999-9999"
                          className="h-11"
                          onChange={(e) => {
                            const formatted = formatPhone(e.target.value);
                            field.onChange(formatted);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="ownerCPF"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CPF</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="000.000.000-00"
                          className="h-11"
                          inputMode="numeric"
                          onChange={(e) => {
                            const formatted = formatCPF(e.target.value);
                            field.onChange(formatted);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="ownerRG"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>RG</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="00.000.000-0"
                          className="h-11"
                          inputMode="numeric"
                          onChange={(e) => {
                            const formatted = formatRG(e.target.value);
                            field.onChange(formatted);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Seção: Endereço */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Endereço</h3>
              
              {/* Logradouro */}
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Logradouro</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Rua, Avenida, Travessa..."
                        className="h-11"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Número e Bairro */}
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="addressNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Número</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="123"
                          className="h-11"
                          inputMode="numeric"
                          onChange={(e) => {
                            const numbersOnly = onlyNumbers(e.target.value);
                            field.onChange(numbersOnly);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="neighborhood"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bairro</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Nome do bairro"
                          className="h-11"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* CEP */}
              <FormField
                control={form.control}
                name="zipCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CEP</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="00000-000"
                        className="h-11"
                        inputMode="numeric"
                        onChange={(e) => {
                          const formatted = formatCEP(e.target.value);
                          field.onChange(formatted);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>

        {/* Botões de Ação */}
        <div className="flex justify-end space-x-4 pt-6 border-t mt-8">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              form.reset();
              setIsOpen(false);
            }}
            className="h-11 px-6"
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={!isValid || isSubmitting} className="h-11 px-6">
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Salvando...
              </>
            ) : (
              patient ? "Atualizar" : "Cadastrar"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}