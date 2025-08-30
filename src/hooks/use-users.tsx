import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/services/api"; // seu axios configurado
import { User } from "@/components/datatable/interfaces/user";

// Tipo para criação de usuário (sem password obrigatório)
type CreateUserData = Omit<User, "id" | "password"> & {
  password: string;
};

export function useUsers() {
  return useQuery<User[]>({
    queryKey: ["users"],
    queryFn: async () => {
      const { data } = await api.get("/users");
      return data;
    },
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newUser: CreateUserData) => {
      const { data } = await api.post("/users", newUser);
      return data;
    },
    onSuccess: () => {
      // Invalida a query para buscar os dados atualizados
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error: unknown) => {
      // Tratamento específico para erros de validação
      const axiosError = error as {
        response?: { status: number; data?: { message?: string } };
      };
      if (axiosError.response?.status === 400) {
        const errorMessage = axiosError.response.data?.message;

        if (errorMessage?.includes("CPF")) {
          console.log("errorMessage");
          throw new Error("CPF já cadastrado no sistema.");
        } else if (errorMessage?.includes("email")) {
          throw new Error("E-mail já cadastrado no sistema.");
        } else {
          throw new Error(errorMessage || "Erro ao criar usuário.");
        }
      }
      throw new Error("Erro ao criar usuário. Tente novamente.");
    },
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (updatedUser: { id: number; user: Partial<User> }) => {
      const { data } = await api.put(
        `/users/${updatedUser.id}`,
        updatedUser.user
      );
      return data;
    },
    onMutate: async (updatedUser) => {
      // Cancelar queries em andamento
      await queryClient.cancelQueries({ queryKey: ["users"] });

      // Snapshot do valor anterior
      const previousUsers = queryClient.getQueryData<User[]>(["users"]);

      // Atualização otimista
      queryClient.setQueryData<User[]>(["users"], (old) => {
        return old?.map((user) =>
          user.id === updatedUser.id ? { ...user, ...updatedUser.user } : user
        );
      });

      // Retorna o contexto com o valor anterior
      return { previousUsers };
    },
    onError: (err: unknown, updatedUser, context) => {
      // Em caso de erro, reverte para o valor anterior
      if (context?.previousUsers) {
        queryClient.setQueryData(["users"], context.previousUsers);
      }

      // Tratamento específico para erros de validação
      const axiosError = err as {
        response?: { status: number; data?: { message?: string } };
      };
      if (axiosError.response?.status === 400) {
        const errorMessage = axiosError.response.data?.message;
        if (errorMessage?.includes("CPF")) {
          throw new Error("CPF já cadastrado no sistema.");
        } else if (errorMessage?.includes("email")) {
          throw new Error("E-mail já cadastrado no sistema.");
        } else {
          throw new Error(errorMessage || "Erro ao atualizar usuário.");
        }
      }
      throw new Error("Erro ao atualizar usuário. Tente novamente.");
    },
    onSettled: () => {
      // Sempre revalida após a mutação
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId: number) => {
      await api.delete(`/users/${userId}`);
    },
    onSuccess: () => {
      // Atualiza a lista após deletar
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
}
