"use client";

import { UserModal } from "@/components/modal/page";
import { PageHeader } from "@/components/ui/page-header";
import { DataTable } from "@/components/datatable/_components/data-table";
import { useQueryClient } from "@tanstack/react-query";
import { useUsers } from "@/hooks/use-users";

export default function DataTablePage() {
  const queryClient = useQueryClient();

  const { data: users = [], isLoading } = useUsers();

  return (
    <div className="p-8">
      <PageHeader
        title="Usuários"
        description="Gerencie os usuários cadastrados no sistema."
        actions={
          <div className="flex gap-2">
            <UserModal
              onUserCreated={() =>
                queryClient.invalidateQueries({ queryKey: ["users"] })
              }
            />
          </div>
        }
      />
      <DataTable users={users ?? []} isLoading={isLoading} />
    </div>
  );
}
