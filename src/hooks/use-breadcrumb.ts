"use client";

import { usePathname } from "next/navigation";
import { useMemo } from "react";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

// Mapeamento de rotas para breadcrumbs
const routeMap: Record<string, BreadcrumbItem[]> = {
  "/": [
    { label: "Home" }
  ],
  "/patients": [
    { label: "Home", href: "/" },
    { label: "Pacientes" }
  ],
  "/users": [
    { label: "Home", href: "/" },
    { label: "Usuários" }
  ],
};

/**
 * Hook personalizado para gerenciar breadcrumbs baseado na rota atual
 * @returns Array de items do breadcrumb para a rota atual
 */
export function useBreadcrumb(): BreadcrumbItem[] {
  const pathname = usePathname();

  const breadcrumbItems = useMemo(() => {
    // Verifica se pathname existe
    if (!pathname) {
      return [{ label: "Home" }];
    }

    // Retorna os items do breadcrumb para a rota atual
    // Se a rota não estiver mapeada, cria um breadcrumb básico
    if (routeMap[pathname]) {
      return routeMap[pathname];
    }

    // Para rotas não mapeadas, cria breadcrumb baseado no path
    const segments = pathname.split('/').filter(Boolean);
    const items: BreadcrumbItem[] = [{ label: "Home", href: "/" }];

    let currentPath = "";
    segments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const isLast = index === segments.length - 1;
      
      // Capitaliza a primeira letra do segmento
      const label = segment.charAt(0).toUpperCase() + segment.slice(1);
      
      items.push({
        label,
        href: isLast ? undefined : currentPath
      });
    });

    return items;
  }, [pathname]);

  return breadcrumbItems;
}

/**
 * Hook para adicionar breadcrumbs customizados
 * Útil para páginas dinâmicas ou quando precisar de breadcrumbs específicos
 */
export function useCustomBreadcrumb(customItems?: BreadcrumbItem[]): BreadcrumbItem[] {
  const defaultItems = useBreadcrumb();
  
  return useMemo(() => {
    if (customItems && customItems.length > 0) {
      return customItems;
    }
    return defaultItems;
  }, [customItems, defaultItems]);
}