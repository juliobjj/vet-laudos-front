"use client";
import { api } from "@/services/api";
import { UserModal } from "@/components/modal/page";
import { PageHeader } from "@/components/ui/page-header";
import UserDataTable from "@/components/datatable/_components/users-datatable";
import { User } from "@/components/datatable/_interface/user";
import { useEffect, useState } from "react";

export default function DataTablePage() {
  const [users, setUsers] = useState<User[]>([]);

  async function fetchUsers() {
    const { data } = await api.get("/users");
    setUsers(data);
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="p-8">
      <PageHeader
        title="Usuários"
        description="Gerencie os usuários cadastrados no sistema."
        actions={<UserModal onUserCreated={fetchUsers} />}
      />
      <UserDataTable users={users} />
    </div>
  );
}
