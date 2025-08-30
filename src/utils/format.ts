export const formatCPF = (cpf: string) => {
  const onlyNumbers = cpf.replace(/\D/g, "").slice(0, 11);
  return onlyNumbers
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
};

export const formatPhone = (phone: string) => {
  if (!phone) return "";

  // Remove tudo que não é dígito
  const cleaned = phone.replace(/\D/g, "");

  // Limita o tamanho máximo (11 dígitos para celular com DDD)
  const limited = cleaned.slice(0, 11);

  // Aplica a formatação de acordo com o tamanho
  if (limited.length <= 2) {
    return `(${limited}`;
  } else if (limited.length <= 6) {
    return `(${limited.slice(0, 2)}) ${limited.slice(2)}`;
  } else if (limited.length <= 10) {
    return `(${limited.slice(0, 2)}) ${limited.slice(2, 6)}-${limited.slice(
      6
    )}`;
  } else {
    return `(${limited.slice(0, 2)}) ${limited.slice(2, 7)}-${limited.slice(
      7
    )}`;
  }
};

export const validCPF = (cpf: string): boolean => {
  cpf = cpf.replace(/[^\d]+/g, "");
  if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;
  let soma = 0,
    resto;
  for (let i = 1; i <= 9; i++)
    soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf.substring(9, 10))) return false;
  soma = 0;
  for (let i = 1; i <= 10; i++)
    soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  return resto === parseInt(cpf.substring(10, 11));
};

export const isValidDate = (dateStr: string): boolean => {
  const [day, month, year] = dateStr.split("/").map(Number);
  if (!day || !month || !year) return false;

  const date = new Date(year, month - 1, day);
  if (
    date.getFullYear() !== year ||
    date.getMonth() + 1 !== month ||
    date.getDate() !== day
  ) {
    return false;
  }
  const now = new Date();
  return date <= now;
};

export const formatDate = (value: string): string => {
  const onlyNumbers = value.replace(/\D/g, "").slice(0, 8);
  return onlyNumbers
    .replace(/(\d{2})(\d)/, "$1/$2")
    .replace(/(\d{2})(\d)/, "$1/$2");
};

export const unmaskDateToISO = (date?: Date): string => {
  if (!date) return "";
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const parseDate = (dateStr?: string) => {
  if (!dateStr) return undefined;
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day);
};

// Função para formatar RG
export const formatRG = (rg: string) => {
  const onlyNumbers = rg.replace(/\D/g, "").slice(0, 9);
  return onlyNumbers
    .replace(/(\d{2})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1})$/, "$1-$2");
};

// Função para formatar CEP
export const formatCEP = (cep: string) => {
  const onlyNumbers = cep.replace(/\D/g, "").slice(0, 8);
  return onlyNumbers.replace(/(\d{5})(\d)/, "$1-$2");
};

// Função para detectar se é CPF ou RG e formatar adequadamente
export const formatCPFOrRG = (value: string) => {
  const onlyNumbers = value.replace(/\D/g, "");
  
  // Se tem 11 dígitos, trata como CPF
  if (onlyNumbers.length <= 11) {
    return formatCPF(value);
  }
  // Se tem mais de 11 dígitos, trata como RG
  else {
    return formatRG(value);
  }
};

// Validação de RG (formato básico)
export const validRG = (rg: string): boolean => {
  const onlyNumbers = rg.replace(/\D/g, "");
  // RG deve ter entre 7 e 9 dígitos
  return onlyNumbers.length >= 7 && onlyNumbers.length <= 9;
};

// Validação de CPF ou RG
export const validCPFOrRG = (value: string): boolean => {
  const onlyNumbers = value.replace(/\D/g, "");
  
  // Se tem 11 dígitos, valida como CPF
  if (onlyNumbers.length === 11) {
    return validCPF(value);
  }
  // Se tem entre 7 e 9 dígitos, valida como RG
  else if (onlyNumbers.length >= 7 && onlyNumbers.length <= 9) {
    return validRG(value);
  }
  
  return false;
};

// Função para calcular idade
export const calculateAge = (birthDate: string): number | string => {
  try {
    const birth = new Date(birthDate);
    const today = new Date();
    
    // Usar UTC para evitar problemas de fuso horário
    const birthUTC = new Date(birth.getUTCFullYear(), birth.getUTCMonth(), birth.getUTCDate());
    const todayUTC = new Date(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate());
    
    let age = todayUTC.getFullYear() - birthUTC.getFullYear();
    const monthDiff = todayUTC.getMonth() - birthUTC.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && todayUTC.getDate() < birthUTC.getDate())) {
      age--;
    }
    
    return age;
  } catch {
    return 'N/A';
  }
};

// Função para aceitar apenas números
export const onlyNumbers = (value: string) => value.replace(/\D/g, "");

export const unmaskCPF = (value: string) => value.replace(/\D/g, ""); // remove tudo que não for número
export const unmaskDate = (value: string) => value.replace(/\D/g, ""); // remove barras
export const unmaskPhone = (value: string) => value.replace(/\D/g, "");
export const unmaskCEP = (value: string) => value.replace(/\D/g, ""); // remove traço do CEP
export const unmaskRG = (value: string) => value.replace(/\D/g, ""); // remove pontos e traço do RG
