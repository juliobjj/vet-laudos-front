"use client";

import { useState } from "react";

import DeleteForm from "@/components/forms/delete-form";
import UserForm from "@/components/forms/user-forms";
import IconMenu from "@/components/menu-icon";
import { ResponsiveDialog } from "@/components/responsive.dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Row } from "@tanstack/react-table";
import { MoreHorizontal, SquarePen, Trash2 } from "lucide-react";
import { User } from "../_interface/user";

interface DataTableRowActionsProps {
  row: Row<User>;
  onEditUser?: (user: User) => void;
}

export function DataTableRowActions({
  row,
  onEditUser,
}: DataTableRowActionsProps) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const userId = row.original.id as number;
  const userName = row.original.name;
  const user = row.original;

  const handleEditClick = () => {
    if (onEditUser) {
      onEditUser(user);
    } else {
      setIsEditOpen(true);
    }
  };

  return (
    <>
      {/* Dialog/Drawe para editar */}
      <ResponsiveDialog
        isOpen={isEditOpen}
        setIsOpen={setIsEditOpen}
        title="Editar Usuário"
      >
        <UserForm user={user} setIsOpen={setIsEditOpen} />
      </ResponsiveDialog>

      {/* Dialog/Drawer para deletar */}
      <ResponsiveDialog
        isOpen={isDeleteOpen}
        setIsOpen={setIsDeleteOpen}
        title="Deletar Usuário"
        description={`Tem certeza de que deseja excluir o usuário ${userName}?`}
      >
        <DeleteForm userId={userId} setIsOpen={setIsDeleteOpen} />
      </ResponsiveDialog>

      {/* Menu de ações */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[160px] z-50">
          <DropdownMenuItem className="p-0">
            <button
              onClick={handleEditClick}
              className="w-full flex items-center rounded-md p-2 text-sm text-neutral-500 hover:bg-neutral-100"
            >
              <IconMenu
                text="Editar"
                icon={<SquarePen className="h-4 w-4" />}
              />
            </button>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="p-0">
            <button
              onClick={() => setIsDeleteOpen(true)}
              className="w-full flex items-center rounded-md p-2 text-sm text-red-500 hover:bg-neutral-100"
            >
              <IconMenu text="Excluir" icon={<Trash2 className="h-4 w-4" />} />
            </button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
