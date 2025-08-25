"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { PatientFormValues } from "@/lib/schemas/patient.schema";
import { patientApi } from "@/lib/api/patient.api";
import { Patient } from "@/components/datatable/_interface/patient";

// Hook para buscar todos os pacientes
export function usePatients() {
  return useQuery({
    queryKey: ["patients"],
    queryFn: patientApi.getAll,
  });
}

// Hook para buscar um paciente específico
export function usePatient(id: number) {
  return useQuery({
    queryKey: ["patient", id],
    queryFn: () => patientApi.getById(id),
    enabled: !!id,
  });
}

// Hook para criar um novo paciente
export function useCreatePatient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (patient: PatientFormValues) => patientApi.create(patient),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patients"] });
    },
  });
}

// Hook para atualizar um paciente
export function useUpdatePatient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, patient }: { id: number; patient: PatientFormValues }) =>
      patientApi.update(id, patient),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["patients"] });
      queryClient.invalidateQueries({ queryKey: ["patient", id] });
    },
  });
}

// Hook para deletar um paciente
export function useDeletePatient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => patientApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patients"] });
    },
  });
}