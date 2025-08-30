import { Patient } from "../interfaces/patient";
import { TableConfig, FilterConfig, ActionConfig, SearchConfig, PaginationConfig } from "../types/generic-table.types";

// Configuração de busca para Patient
export const patientSearchConfig: SearchConfig = {
  enabled: true,
  placeholder: "Buscar por nome do pet ou tutor...",
  searchKey: "name"
};

// Configuração de filtros para Patient
export const patientFiltersConfig: FilterConfig[] = [
  {
    key: "search",
    label: "Busca",
    type: "search",
    placeholder: "Buscar por nome do pet ou tutor...",
    searchFields: ["name", "ownerName"],
    searchType: "contains"
  },
  {
    key: "species",
    label: "Espécie",
    type: "select",
    placeholder: "Todas as espécies",
    options: [
      { value: "Cão", label: "Cão" },
      { value: "Gato", label: "Gato" },
      { value: "Ave", label: "Ave" },
      { value: "Réptil", label: "Réptil" },
      { value: "Roedor", label: "Roedor" }
    ]
  },
  {
    key: "dateRange",
    label: "Período de Cadastro",
    type: "dateRange",
    placeholder: "Selecionar período"
  }
];

// Configuração de ações para Patient
export const patientActionsConfig: ActionConfig<Patient>[] = [
  {
    label: "Editar",
    onClick: (patient: Patient) => {
      console.log("Editar paciente:", patient);
    },
    variant: "outline"
  },
  {
    label: "Visualizar",
    onClick: (patient: Patient) => {
      console.log("Visualizar paciente:", patient);
    },
    variant: "ghost"
  },
  {
    label: "Excluir",
    onClick: (patient: Patient) => {
      console.log("Excluir paciente:", patient);
    },
    variant: "destructive"
  }
];

// Configuração de paginação para Patient
export const patientPaginationConfig: PaginationConfig = {
  enabled: true,
  pageSize: 10,
  showPageSizeSelector: true,
  pageSizeOptions: [5, 10, 20, 50]
};

// Função para criar configuração completa da tabela de Patient
export const createPatientTableConfig = (
  data: Patient[],
  isLoading: boolean = false,
  callbacks?: {
    onEdit?: (patient: Patient) => void;
    onDelete?: (patient: Patient) => void;
    onView?: (patient: Patient) => void;
  }
): Partial<TableConfig<Patient>> => {
  return {
    data,
    isLoading,
    search: patientSearchConfig,
    filters: patientFiltersConfig,
    actions: patientActionsConfig.map(action => ({
      ...action,
      onClick: callbacks?.[action.label.toLowerCase() as keyof typeof callbacks] || action.onClick
    })),
    pagination: patientPaginationConfig,
    onEdit: callbacks?.onEdit,
    onDelete: callbacks?.onDelete,
    onView: callbacks?.onView,
    emptyMessage: "Nenhum paciente encontrado",
    loadingMessage: "Carregando pacientes...",
    defaultSorting: [{ id: "name", desc: false }]
  };
};