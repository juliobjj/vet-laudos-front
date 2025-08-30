import { ColumnDef } from "@tanstack/react-table";
import { ReactNode } from "react";

// Interface genérica para qualquer entidade
export interface BaseEntity {
  id: string | number;
  [key: string]: any;
}

// Interface para configuração de filtros
export interface FilterConfig {
  key: string;
  label: string;
  type: 'text' | 'date' | 'select' | 'dateRange' | 'search';
  placeholder?: string;
  options?: { value: string; label: string }[];
  defaultValue?: any;
  // Propriedades específicas para busca
  searchFields?: string[]; // Campos que serão pesquisados
  searchType?: 'contains' | 'startsWith' | 'exact'; // Tipo de busca
}

// Interface para configuração de ações
export interface ActionConfig<T extends BaseEntity> {
  label: string;
  icon?: ReactNode;
  onClick: (item: T) => void;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  disabled?: (item: T) => boolean;
}

// Interface para configuração de busca
export interface SearchConfig {
  enabled: boolean;
  placeholder?: string;
  searchKey: string; // Campo que será usado para busca
}

// Interface para configuração de paginação
export interface PaginationConfig {
  enabled: boolean;
  pageSize?: number;
  showPageSizeSelector?: boolean;
  pageSizeOptions?: number[];
}

// Interface principal para configuração da tabela
export interface TableConfig<T extends BaseEntity> {
  // Dados e estado
  data: T[];
  isLoading?: boolean;
  
  // Colunas
  columns: ColumnDef<T>[];
  
  // Configurações de funcionalidades
  search?: SearchConfig;
  filters?: FilterConfig[];
  actions?: ActionConfig<T>[];
  pagination?: PaginationConfig;
  
  // Callbacks
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  onView?: (item: T) => void;
  
  // Configurações de UI
  emptyMessage?: string;
  loadingMessage?: string;
  
  // Configurações de ordenação
  defaultSorting?: { id: string; desc: boolean }[];
}

// Interface para props do componente genérico
export interface GenericTableProps<T extends BaseEntity> {
  config: TableConfig<T>;
  className?: string;
}

// Interface para filtros ativos
export interface ActiveFilters {
  [key: string]: any;
}

// Interface para estado da tabela
export interface TableState {
  search: string;
  filters: ActiveFilters;
  sorting: { id: string; desc: boolean }[];
  pagination: {
    pageIndex: number;
    pageSize: number;
  };
}