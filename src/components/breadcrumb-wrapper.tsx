"use client";

import { Breadcrumb } from "@/components/ui/breadcrumb";
import { useBreadcrumb } from "@/hooks/use-breadcrumb";
import { Button } from "./ui/button";
import { Menu } from "lucide-react";

/**
 * Wrapper do breadcrumb que automaticamente gera os items baseado na rota atual
 */
export function BreadcrumbWrapper() {
  const breadcrumbItems = useBreadcrumb();

  // Não renderiza breadcrumb na página inicial se houver apenas um item
  if (breadcrumbItems.length <= 1) {
    return null;
  }

  return (
    <div className="mb-6 ml-6 flex">
      <Breadcrumb items={breadcrumbItems} />
    </div>
  );
}