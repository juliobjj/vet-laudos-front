"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "../../services/api";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(2),
  cpf: z.string().length(11),
  dateBirth: z.string(),
  phone: z.string(),
});

type FormData = z.infer<typeof schema>;

export function UserModal({ onUserCreated }: { onUserCreated: () => void }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    await api.post("/users", data);
    onUserCreated();
    reset();
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="justify-end flex">
          <Button
            className="ml-auto bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700
          transition px-4 py-2"
          >
            <Plus className="w-4 h-4 mr-2" /> Novo Usuário
          </Button>
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cadastrar Usuário</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
          <div>
            <Label>Email</Label>
            <Input {...register("email")} />
            {errors.email && (
              <span className="text-red-500 text-sm">
                {errors.email.message}
              </span>
            )}
          </div>
          <div>
            <Label>Senha</Label>
            <Input type="password" {...register("password")} />
          </div>
          <div>
            <Label>Nome</Label>
            <Input {...register("name")} />
          </div>
          <div>
            <Label>CPF</Label>
            <Input {...register("cpf")} />
          </div>
          <div>
            <Label>Data de Nascimento</Label>
            <Input type="date" {...register("dateBirth")} />
          </div>
          <div>
            <Label>Telefone</Label>
            <Input {...register("phone")} />
          </div>
          <Button
            className="h-12 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600 transition"
            type="submit"
          >
            Salvar
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
