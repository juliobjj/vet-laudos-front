"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, X, Search, FileText } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { FilterConfig, ActiveFilters } from "../types/generic-table.types";
import { generatePatientsPDF } from "@/utils/pdf-generator";
import { Patient } from "../interfaces/patient";

interface GenericFiltersProps {
  filters: FilterConfig[];
  activeFilters: ActiveFilters;
  onFiltersChange: (filters: ActiveFilters) => void;
  onClearFilters?: () => void;
  // Props para extração de PDF
  data?: any[];
  enablePdfExport?: boolean;
  pdfTitle?: string;
}

export function GenericFilters({
  filters,
  activeFilters,
  onFiltersChange,
  onClearFilters,
  data = [],
  enablePdfExport = false,
  pdfTitle = "Relatório de Pacientes"
}: GenericFiltersProps) {
  const [dateRange, setDateRange] = useState<{
    from?: Date;
    to?: Date;
  }>({});

  // Função para atualizar um filtro específico
  const updateFilter = (key: string, value: any) => {
    const newFilters = { ...activeFilters };
    if (value === "" || value === null || value === undefined || value === "all") {
      delete newFilters[key];
    } else {
      newFilters[key] = value;
    }
    onFiltersChange(newFilters);
  };

  // Função para limpar todos os filtros
  const clearAllFilters = () => {
    setDateRange({});
    onFiltersChange({});
    onClearFilters?.();
  };

  // Função para gerar PDF
  const handleGeneratePDF = () => {
    if (!data || data.length === 0) {
      alert("Não há dados para gerar o relatório.");
      return;
    }

    try {
      generatePatientsPDF(data as Patient[], {
        title: pdfTitle,
        startDate: activeFilters.startDate,
        endDate: activeFilters.endDate
      });
    } catch (error) {
      console.error("Erro ao gerar PDF:", error);
      alert("Erro ao gerar o relatório PDF.");
    }
  };

  // Renderizar filtro de busca
  const renderSearchFilter = (filter: FilterConfig) => (
    <div key={filter.key} className="flex flex-col space-y-2">
      <label className="text-sm font-medium">{filter.label}</label>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={filter.placeholder || `Buscar...`}
          value={activeFilters[filter.key] || ""}
          onChange={(e) => updateFilter(filter.key, e.target.value)}
          className="pl-10 w-full h-10"
        />
      </div>
    </div>
  );

  // Renderizar filtro de texto
  const renderTextFilter = (filter: FilterConfig) => (
    <div key={filter.key} className="flex flex-col space-y-2">
      <label className="text-sm font-medium">{filter.label}</label>
      <Input
        placeholder={filter.placeholder || `Filtrar por ${filter.label.toLowerCase()}`}
        value={activeFilters[filter.key] || ""}
        onChange={(e) => updateFilter(filter.key, e.target.value)}
        className="pl-10 w-full h-10"
      />
    </div>
  );

  // Renderizar filtro de seleção
  const renderSelectFilter = (filter: FilterConfig) => (
    <div key={filter.key} className="flex flex-col space-y-2">
      <label className="text-sm font-medium">{filter.label}</label>
      <Select
        value={activeFilters[filter.key] || ""}
        onValueChange={(value) => updateFilter(filter.key, value)}
      >
        <SelectTrigger className="w-full h-10">
          <SelectValue placeholder={filter.placeholder || `Selecionar ${filter.label.toLowerCase()}`} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos</SelectItem>
          {filter.options?.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );

  // Renderizar filtro de data
  const renderDateFilter = (filter: FilterConfig) => (
    <div key={filter.key} className="flex flex-col space-y-2">
      <label className="text-sm font-medium">{filter.label}</label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal",
              !activeFilters[filter.key] && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {activeFilters[filter.key] ? (
              format(new Date(activeFilters[filter.key]), "dd/MM/yyyy", { locale: ptBR })
            ) : (
              <span>{filter.placeholder || "Selecionar data"}</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={activeFilters[filter.key] ? new Date(activeFilters[filter.key]) : undefined}
            onSelect={(date) => updateFilter(filter.key, date?.toISOString())}
            disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  );

  // Renderizar filtro de intervalo de datas
  const renderDateRangeFilter = (filter: FilterConfig) => (
    <div key={filter.key} className="flex flex-col space-y-2">
      <label className="text-sm font-medium">{filter.label}</label>
      <div className="flex space-x-2">
        <Popover>
          <PopoverTrigger asChild className="w-full h-10">
            <Button
              variant="outline"
              className={cn(
                "flex-1 justify-start text-left font-normal",
                !dateRange.from && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dateRange.from ? (
                format(dateRange.from, "dd/MM/yyyy", { locale: ptBR })
              ) : (
                <span>Data inicial</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={dateRange.from}
              onSelect={(date) => {
                const newRange = { ...dateRange, from: date };
                setDateRange(newRange);
                if (newRange.from && newRange.to) {
                  updateFilter(filter.key, {
                    from: newRange.from.toISOString(),
                    to: newRange.to.toISOString()
                  });
                }
              }}
              disabled={(date) => date > new Date()}
              initialFocus
            />
          </PopoverContent>
        </Popover>
        
        <Popover>
          <PopoverTrigger asChild className="w-full h-10">
            <Button
              variant="outline"
              className={cn(
                "flex-1 justify-start text-left font-normal",
                !dateRange.to && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dateRange.to ? (
                format(dateRange.to, "dd/MM/yyyy", { locale: ptBR })
              ) : (
                <span>Data final</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={dateRange.to}
              onSelect={(date) => {
                const newRange = { ...dateRange, to: date };
                setDateRange(newRange);
                if (newRange.from && newRange.to) {
                  updateFilter(filter.key, {
                    from: newRange.from.toISOString(),
                    to: newRange.to.toISOString()
                  });
                }
              }}
              disabled={(date) => {
                if (date > new Date()) return true;
                if (dateRange.from && date < dateRange.from) return true;
                return false;
              }}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );

  // Renderizar filtro baseado no tipo
  const renderFilter = (filter: FilterConfig) => {
    switch (filter.type) {
      case "search":
        return renderSearchFilter(filter);
      case "text":
        return renderTextFilter(filter);
      case "select":
        return renderSelectFilter(filter);
      case "date":
        return renderDateFilter(filter);
      case "dateRange":
        return renderDateRangeFilter(filter);
      default:
        return null;
    }
  };

  // Verificar se há filtros ativos
  const hasActiveFilters = Object.keys(activeFilters).length > 0 || 
    dateRange.from || dateRange.to;

  // Se não há filtros ou PDF habilitados, não renderizar nada
  if (filters.length === 0 && !enablePdfExport) {
    return null;
  }

  return (
    <div className="space-y-4 p-4 border rounded-lg bg-muted/50">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Filtros e Ações</h3>
        <div className="flex items-center gap-2">
           {hasActiveFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={clearAllFilters}
              className="h-8 px-2 lg:px-3"
            >
              <X className="mr-2 h-4 w-4" />
              Limpar filtros
            </Button>
          )}
          {enablePdfExport && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleGeneratePDF}
              className="h-8 px-2 lg:px-3"
            >
              <FileText className="mr-2 h-4 w-4" />
              Extrair PDF
            </Button>
          )}
         
        </div>
      </div>
      
      {/* Filtros */}
      {filters.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filters.map(renderFilter)}
        </div>
      )}
    </div>
  );
}