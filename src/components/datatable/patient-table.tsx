"use client";

import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Patient } from "./interfaces/patient";
import { GenericDataTable } from "./generic-data-table";
import { GenericFilters } from "./components/generic-filters";
import { TableConfig, ActiveFilters } from "./types/generic-table.types";
import { patientColumnsNew } from "./patients/patient-columns";
import {
  patientSearchConfig,
  patientFiltersConfig,
  patientActionsConfig,
  patientPaginationConfig
} from "./configs/patient-table.config";
// Importações removidas - funcionalidades movidas para GenericFilters

interface PatientTableProps {
  patients: Patient[];
  isLoading?: boolean;
  onEdit?: (patient: Patient) => void;
  onDelete?: (patient: Patient) => void;
  onView?: (patient: Patient) => void;
  className?: string;
}

export function PatientTable({
  patients,
  isLoading = false,
  onEdit,
  onDelete,
  onView,
  className
}: PatientTableProps) {
  const [activeFilters, setActiveFilters] = React.useState<ActiveFilters>({});

  // Filtrar dados baseado nos filtros ativos
  const filteredPatients = React.useMemo(() => {
    let filtered = patients;

    // Aplicar filtros
    Object.entries(activeFilters).forEach(([key, value]) => {
      if (value && value !== "") {
        if (key === "search") {
          // Aplicar busca por nome do pet ou tutor
          const searchTerm = value.toLowerCase().trim();
          filtered = filtered.filter((patient) => {
            const petName = patient.name?.toLowerCase() || "";
            const ownerName = patient.ownerName?.toLowerCase() || "";
            return petName.includes(searchTerm) || ownerName.includes(searchTerm);
          });
        }
        if (key === "species") {
          filtered = filtered.filter((patient) => patient.species === value);
        }
        if (key === "dateRange" && typeof value === "object" && value.from && value.to) {
          const fromDate = new Date(value.from);
          const toDate = new Date(value.to);
          filtered = filtered.filter((patient) => {
            const patientDate = new Date(patient.createdAt);
            return patientDate >= fromDate && patientDate <= toDate;
          });
        }
      }
    });

    return filtered;
  }, [patients, activeFilters]);

  // Função para limpar filtros
  const handleClearFilters = () => {
    setActiveFilters({});
  };

  // Configurar ações com callbacks
  const actionsWithCallbacks = React.useMemo(() => {
    return patientActionsConfig.map((action) => {
      switch (action.label) {
        case "Editar":
          return { ...action, onClick: onEdit || action.onClick };
        case "Excluir":
          return { ...action, onClick: onDelete || action.onClick };
        case "Visualizar":
          return { ...action, onClick: onView || action.onClick };
        default:
          return action;
      }
    });
  }, [onEdit, onDelete, onView]);

  // Configuração da tabela
  const tableConfig: TableConfig<Patient> = {
    data: filteredPatients,
    isLoading,
    columns: patientColumnsNew,
    search: {
      ...patientSearchConfig,
      enabled: true
    },
    filters: patientFiltersConfig,
    actions: actionsWithCallbacks,
    pagination: patientPaginationConfig,
    onEdit,
    onDelete,
    onView,
    emptyMessage: "Nenhum paciente encontrado",
    loadingMessage: "Carregando pacientes...",
    defaultSorting: [{ id: "name", desc: false }]
  };

  return (
    <div className={className}>
      {/* Filtros com extração de PDF integrados */}
      <GenericFilters
        filters={patientFiltersConfig}
        activeFilters={activeFilters}
        onFiltersChange={setActiveFilters}
        onClearFilters={handleClearFilters}
        data={filteredPatients}
        enablePdfExport={true}
        pdfTitle="Relatório de Pacientes"
      />

      {/* Tabela genérica */}
      <GenericDataTable config={tableConfig} />
    </div>
  );
}