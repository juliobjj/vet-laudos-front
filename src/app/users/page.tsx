"use client";
import { PageHeader } from "@/components/ui/page-header";
import { User } from "@/components/datatable/_interface/user";
import { DataTable } from "@/components/datatable/_components/data-table";
import { useQueryClient } from "@tanstack/react-query";
import { ResponsiveDialog } from "@/components/responsive.dialog";
import UserForm from "@/components/forms/user-forms";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useUsers } from "@/hooks/use-users";

export default function DataTablePage() {
  const queryClient = useQueryClient();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | undefined>(undefined);

  const { data: users = [], isLoading } = useUsers();

  const reloadUsers = () => {
    queryClient.invalidateQueries({ queryKey: ["users"] });
  };

  const handleCreateUser = () => {
    setSelectedUser(undefined);
    setIsCreateOpen(true);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setIsEditOpen(true);
  };

  return (
    <div className="p-8">
      <PageHeader
        title="Usuários"
        description="Gerencie os usuários cadastrados no sistema."
        actions={
          <Button
            onClick={handleCreateUser}
            className="ml-auto bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition px-4 py-2"
          >
            <Plus className="w-4 h-4 mr-2" /> Novo Usuário
          </Button>
        }
      />

      {/* Modal de Criação */}
      <ResponsiveDialog
        isOpen={isCreateOpen}
        setIsOpen={setIsCreateOpen}
        title="Cadastrar Usuário"
      >
        <UserForm setIsOpen={setIsCreateOpen} onUpdated={reloadUsers} />
      </ResponsiveDialog>

      {/* Modal de Edição */}
      <ResponsiveDialog
        isOpen={isEditOpen}
        setIsOpen={setIsEditOpen}
        title="Editar Usuário"
      >
        <UserForm
          user={selectedUser}
          setIsOpen={setIsEditOpen}
          onUpdated={reloadUsers}
        />
      </ResponsiveDialog>

      <DataTable
        users={users ?? []}
        isLoading={isLoading}
        onEditUser={handleEditUser}
      />
    </div>
  );
}
