"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import { ResponsiveDialog } from "@/components/responsive.dialog";
import PatientForm from "@/components/forms/patient-forms";
import { Plus } from "lucide-react";
import { usePatients } from "@/hooks/use-patients";
import { Patient } from "@/components/datatable/_interface/patient";
import { PatientDataTable } from "@/components/datatable/_components/patient-data-table";
import { useQueryClient } from "@tanstack/react-query";

export default function PatientsPage() {
  const queryClient = useQueryClient();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | undefined>(undefined);
  
  const { data: patients = [], isLoading } = usePatients();

  const reloadPatients = () => {
    queryClient.invalidateQueries({ queryKey: ["patients"] });
  };

  const handleCreatePatient = () => {
    setSelectedPatient(undefined);
    setIsCreateOpen(true);
  };

  const handleEditPatient = (patient: Patient) => {
    setSelectedPatient(patient);
    setIsEditOpen(true);
  };



  return (
    <div className="p-8">
      <PageHeader
        title="Pacientes"
        description="Gerencie os pacientes cadastrados no sistema."
        actions={
          <Button 
            onClick={handleCreatePatient}
            className="ml-auto bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition px-4 py-2"
          >
            <Plus className="w-4 h-4 mr-2" /> Novo Pet
          </Button>
        }
      />
      
      {/* Modal de Criação */}
      <ResponsiveDialog
        isOpen={isCreateOpen}
        setIsOpen={setIsCreateOpen}
        title="Novo Paciente"
      >
        <PatientForm
          patient={undefined}
          setIsOpen={setIsCreateOpen}
          onUpdated={reloadPatients}
        />
      </ResponsiveDialog>

      {/* Modal de Edição */}
      <ResponsiveDialog
        isOpen={isEditOpen}
        setIsOpen={setIsEditOpen}
        title="Editar Paciente"
      >
        <PatientForm
          patient={selectedPatient}
          setIsOpen={setIsEditOpen}
          onUpdated={reloadPatients}
        />
      </ResponsiveDialog>

      <PatientDataTable
        patients={patients ?? []}
        isLoading={isLoading}
        onEditPatient={handleEditPatient}
      />
     </div>
   );
}
