"use client";

import { formatPhone } from "@/utils/format";
import { ColumnDef } from "@tanstack/react-table";
import { Patient } from "../_interface/patient";
import { DataTableColumnHeader } from "./data-table-column-header";
import { PatientDataTableRowActions } from "./patient-data-table-row-actions";

export const patientColumns: ColumnDef<Patient>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ID" />
    ),
    cell: ({ row }) => {
      return <div className="w-[60px]">{row.getValue("id")}</div>;
    },
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nome" />
    ),
    cell: ({ row }) => {
      return <div className="font-medium">{row.getValue("name")}</div>;
    },
  },
  {
    accessorKey: "species",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Espécie" />
    ),
    cell: ({ row }) => {
      return <div className="w-[80px]">{row.getValue("species")}</div>;
    },
  },
  {
    accessorKey: "sex",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Sexo" />
    ),
    cell: ({ row }) => {
      const sex = row.getValue("sex") as string;
      return (
        <div className="w-[60px]">
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
            sex === "Macho" 
              ? "bg-blue-100 text-blue-800" 
              : "bg-pink-100 text-pink-800"
          }`}>
            {sex}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "breed",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Raça" />
    ),
    cell: ({ row }) => {
      const breed = row.getValue("breed") as string;
      return (
        <div className="max-w-[120px] truncate" title={breed}>
          {breed}
        </div>
      );
    },
  },
  {
    accessorKey: "ownerName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tutor" />
    ),
    cell: ({ row }) => {
      return <div className="font-medium">{row.getValue("ownerName")}</div>;
    },
  },
  {
    accessorKey: "ownerPhone",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Telefone" />
    ),
    cell: ({ row }) => {
      const value = row.getValue("ownerPhone") as string;
      return <div className="w-[120px]">{formatPhone(value)}</div>;
    },
  },
  {
    accessorKey: "requestingDoctor",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Médico" />
    ),
    cell: ({ row }) => {
      const doctor = row.getValue("requestingDoctor") as string;
      return (
        <div className="max-w-[120px] truncate" title={doctor}>
          {doctor || "-"}
        </div>
      );
    },
  },
  {
    accessorKey: "neighborhood",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Bairro" />
    ),
    cell: ({ row }) => {
      const neighborhood = row.getValue("neighborhood") as string;
      return (
        <div className="max-w-[100px] truncate" title={neighborhood}>
          {neighborhood || "-"}
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <PatientDataTableRowActions row={row} />,
  },
];