"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { PatientFormValues } from "@/lib/schemas/patient.schema";
import { patientApi } from "@/lib/api/patient.api";
import { Patient } from "@/components/datatable/interfaces/patient";

// Dados mockados para teste
const mockPatients: Patient[] = [
  {
    id: 1,
    name: "Rex",
    species: "Cão",
    breed: "Golden Retriever",
    dateBirth: "2020-03-15",
    coat: "Dourado",
    sex: "Macho",
    ownerName: "Maria Silva",
    ownerPhone: "(11) 99999-1234",
    ownerDocument: "123.456.789-01",
    address: "Rua das Flores",
    addressNumber: "123",
    neighborhood: "Centro",
    zipCode: "01234-567",
    insurance: "PetSaúde",
    requestingDoctor: "Dr. João Santos",
    collectionOrigin: "Clínica Veterinária Central",
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-15T10:30:00Z"
  },
  {
    id: 2,
    name: "Mimi",
    species: "Gato",
    breed: "Persa",
    dateBirth: "2021-07-22",
    coat: "Branco",
    sex: "Fêmea",
    ownerName: "Carlos Oliveira",
    ownerPhone: "(11) 88888-5678",
    ownerDocument: "987.654.321-09",
    address: "Avenida Paulista",
    addressNumber: "456",
    neighborhood: "Bela Vista",
    zipCode: "01310-100",
    insurance: "VetCare",
    requestingDoctor: "Dra. Ana Costa",
    collectionOrigin: "Hospital Veterinário São Paulo",
    createdAt: "2024-01-16T14:20:00Z",
    updatedAt: "2024-01-16T14:20:00Z"
  },
  {
    id: 3,
    name: "Thor",
    species: "Cão",
    breed: "Pastor Alemão",
    dateBirth: "2019-11-08",
    coat: "Preto e Marrom",
    sex: "Macho",
    ownerName: "Ana Rodrigues",
    ownerPhone: "(11) 77777-9012",
    ownerDocument: "456.789.123-45",
    address: "Rua Augusta",
    addressNumber: "789",
    neighborhood: "Consolação",
    zipCode: "01305-000",
    requestingDoctor: "Dr. Pedro Lima",
    collectionOrigin: "Clínica Pet Life",
    createdAt: "2024-01-17T09:15:00Z",
    updatedAt: "2024-01-17T09:15:00Z"
  },
  {
    id: 4,
    name: "Luna",
    species: "Gato",
    breed: "Siamês",
    dateBirth: "2022-02-14",
    coat: "Creme e Marrom",
    sex: "Fêmea",
    ownerName: "Roberto Santos",
    ownerPhone: "(11) 66666-3456",
    ownerDocument: "789.123.456-78",
    address: "Rua Oscar Freire",
    addressNumber: "321",
    neighborhood: "Jardins",
    zipCode: "01426-001",
    insurance: "PetPlus",
    requestingDoctor: "Dra. Carla Mendes",
    collectionOrigin: "Centro Veterinário Jardins",
    createdAt: "2024-01-18T16:45:00Z",
    updatedAt: "2024-01-18T16:45:00Z"
  },
  {
    id: 5,
    name: "Buddy",
    species: "Cão",
    breed: "Labrador",
    dateBirth: "2020-09-30",
    coat: "Chocolate",
    sex: "Macho",
    ownerName: "Fernanda Costa",
    ownerPhone: "(11) 55555-7890",
    ownerDocument: "321.654.987-12",
    address: "Alameda Santos",
    addressNumber: "654",
    neighborhood: "Paraíso",
    zipCode: "01418-100",
    insurance: "AnimalCare",
    requestingDoctor: "Dr. Marcos Silva",
    collectionOrigin: "Clínica Veterinária Paraíso",
    createdAt: "2024-01-19T11:30:00Z",
    updatedAt: "2024-01-19T11:30:00Z"
  },
  {
    id: 6,
    name: "Bella",
    species: "Cão",
    breed: "Poodle",
    dateBirth: "2021-12-05",
    coat: "Branco",
    sex: "Fêmea",
    ownerName: "José Almeida",
    ownerPhone: "(11) 44444-2345",
    ownerDocument: "654.321.098-76",
    address: "Rua Haddock Lobo",
    addressNumber: "987",
    neighborhood: "Cerqueira César",
    zipCode: "01414-001",
    requestingDoctor: "Dra. Lucia Ferreira",
    collectionOrigin: "Pet Hospital Cerqueira César",
    createdAt: "2024-01-20T13:20:00Z",
    updatedAt: "2024-01-20T13:20:00Z"
  }
];

// Hook para buscar todos os pacientes (usando dados mockados)
export function usePatients() {
  return useQuery({
    queryKey: ["patients"],
    queryFn: () => Promise.resolve(mockPatients),
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