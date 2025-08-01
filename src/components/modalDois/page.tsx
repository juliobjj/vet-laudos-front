import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@radix-ui/react-dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { DropdownMenuLabel } from "../ui/dropdown-menu";

export function DialogDemo() {
  return (
    <Dialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuLabel>Ações</DropdownMenuLabel>
          <DialogTrigger asChild>
            <DropdownMenuItem>
              <span>Editar</span>
            </DropdownMenuItem>
          </DialogTrigger>
          <DialogTrigger asChild>
            <DropdownMenuItem className="text-red-500">
              Remover
            </DropdownMenuItem>
          </DialogTrigger>
        </DropdownMenuContent>
      </DropdownMenu>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar usuário</DialogTitle>
        </DialogHeader>
        <h1>olhahjgjhgs</h1>
      </DialogContent>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Remover usuário</DialogTitle>
        </DialogHeader>
        <h1>olhahjgjhgs</h1>
      </DialogContent>
    </Dialog>
  );
}
