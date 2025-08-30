"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Patient } from "../interfaces/patient";
import { PatientDataTableRowActions } from "./patient-row-actions";
import { Row } from "@tanstack/react-table";
import { formatPhone, calculateAge } from "@/utils/format";





export const patientColumnsNew: ColumnDef<Patient>[] = [

  {
    accessorKey: "name",
    header: "PET",
    cell: ({ row }: { row: Row<Patient> }) => {
      const patient = row.original;
      return (
        <div className="flex flex-col w-20">
          <div className="font-medium">{patient.name}</div>
          <div className="text-sm text-muted-foreground">
            {patient.species}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "species",
    header: "ESPÉCIE/RAÇA",
    cell: ({ row }: { row: Row<Patient> }) => {
      const patient = row.original;
      return (
        <div className="flex flex-col">
            <div className="font-medium">{patient.species}</div>
          <div className="text-sm text-muted-foreground mt-1">
            {patient.breed}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "sex",
    header: "SEXO",
    cell: ({ row }: { row: Row<Patient> }) => {
      const patient = row.original;
      return (
        <Badge className={patient.sex === "Macho" ? "bg-blue-50 text-blue-200" : "bg-pink-50 text-pink-200"}>
          {patient.sex}
        </Badge>
      );
    },
  },
  {
    accessorKey: "dateBirth",
    header: "IDADE/PESO",
    cell: ({ row }: { row: Row<Patient> }) => {
      const patient = row.original;
      const age = patient.dateBirth ? calculateAge(patient.dateBirth) : 'N/A';
      return (
        <div className="flex flex-col">
          <div className="font-medium">{age} anos</div>
          <div className="text-sm text-muted-foreground">4kg</div>
        </div>
      );
    },
  },
  {
    accessorKey: "ownerName",
    header: "TUTOR",
    cell: ({ row }: { row: Row<Patient> }) => {
      const patient = row.original;
      return (
        <div className="flex flex-col">
          <div className="font-medium">{patient.ownerName}</div>
          <div className="text-sm text-muted-foreground">
            {formatPhone(patient.ownerPhone)}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "DATA CADASTRO",
    cell: ({ row }: { row: Row<Patient> }) => {
      const patient = row.original;
      try {
        const date = new Date(patient.createdAt);
        // Usar toLocaleDateString para consistência entre servidor e cliente
        const formattedDate = date.toLocaleDateString('pt-BR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        });
        return (
          <div className="text-sm">
            {formattedDate}
          </div>
        );
      } catch {
        return (
          <div className="text-sm">
            Data inválida
          </div>
        );
      }
    },
  },
  {
    id: "actions",
    cell: ({ row }: { row: Row<Patient> }) => 
     { return(  <div className="w-2"><PatientDataTableRowActions row={row}/></div>) }
  },
];