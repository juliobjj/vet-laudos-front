"use client";

import React, { useState, useMemo } from "react";
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  SortingState,
  getSortedRowModel,
  getFilteredRowModel,
  ColumnFiltersState,
  VisibilityState,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { GenericTableProps, BaseEntity, TableState } from "./types/generic-table.types";

export function GenericDataTable<T extends BaseEntity>({
  config,
  className = ""
}: GenericTableProps<T>) {
  // Estados da tabela
  const [sorting, setSorting] = useState<SortingState>(
    config.defaultSorting || []
  );
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [globalFilter, setGlobalFilter] = useState("");

  // Configuração da tabela React Table
  const table = useReactTable({
    data: config.data,
    columns: config.columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: "includesString",
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter,
      pagination: {
        pageIndex: 0,
        pageSize: config.pagination?.pageSize || 10,
      },
    },
  });

  // Função para lidar com busca global
  const handleSearchChange = (value: string) => {
    setGlobalFilter(value);
    if (config.search?.searchKey) {
      table.getColumn(config.search.searchKey)?.setFilterValue(value);
    }
  };


  // Renderizar ações de linha
  const renderRowActions = (row: any) => {
    if (!config.actions || config.actions.length === 0) return null;

    return (
      <div className="flex items-center gap-2">
        {config.actions.map((action, index) => (
          <Button
            key={index}
            variant={action.variant || "outline"}
            size="sm"
            onClick={() => action.onClick(row.original)}
            disabled={action.disabled ? action.disabled(row.original) : false}
          >
            {action.icon && action.icon}
            {action.label}
          </Button>
        ))}
      </div>
    );
  };

  // Adicionar coluna de ações se necessário
  const tableColumns = useMemo(() => {
    if (!config.actions || config.actions.length === 0) {
      return config.columns;
    }

    return [
      ...config.columns,
      {
        id: "actions",
        header: "Ações",
        cell: ({ row }: any) => renderRowActions(row),
      },
    ];
  }, [config.columns, config.actions]);

  // Atualizar colunas da tabela
  React.useEffect(() => {
    table.setOptions((prev) => ({
      ...prev,
      columns: tableColumns,
    }));
  }, [tableColumns, table]);

  // Renderizar paginação
  const renderPagination = () => {
    if (!config.pagination?.enabled) return null;

    return (
      <div className="flex items-center justify-between space-x-2 py-4">
        <div className="text-sm text-muted-foreground">
          Mostrando {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} a{" "}
          {Math.min(
            (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
            table.getFilteredRowModel().rows.length
          )}{" "}
          de {table.getFilteredRowModel().rows.length} registros
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Anterior
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Próximo
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className={className}>      
      {/* Tabela */}
      <div className="overflow-hidden rounded-md border mt-6">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {config.isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={tableColumns.length}
                  className="h-24 text-center"
                >
                  <div className="flex items-center justify-center w-full h-full min-h-[200px]">
                    <Spinner size={32} className="text-primary" />
                  </div>
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={tableColumns.length}
                  className="h-24 text-center text-muted-foreground"
                >
                  {config.emptyMessage || "Nenhum registro encontrado"}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Paginação */}
      {renderPagination()}
    </div>
  );
}