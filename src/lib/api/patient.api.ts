import { api } from "@/services/api";
import { PatientFormValues } from "@/lib/schemas/patient.schema";
import { Patient } from "@/components/datatable/_interface/patient";

export const patientApi = {
  // Buscar todos os pacientes
  async getAll(): Promise<Patient[]> {
    const response = await api.get("/patients");
    return response.data;
  },

  // Buscar paciente por ID
  async getById(id: number): Promise<Patient> {
    const response = await api.get(`/patients/${id}`);
    return response.data;
  },

  // Criar novo paciente
  async create(patient: PatientFormValues): Promise<Patient> {
    const response = await api.post("/patients", patient);
    return response.data;
  },

  // Atualizar paciente
  async update(id: number, patient: PatientFormValues): Promise<Patient> {
    const response = await api.put(`/patients/${id}`, patient);
    return response.data;
  },

  // Deletar paciente
  async delete(id: number): Promise<void> {
    await api.delete(`/patients/${id}`);
  },
};