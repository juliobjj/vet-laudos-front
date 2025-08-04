import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/services/api"; // seu axios configurado
import { User } from "@/components/datatable/_interface/user";

export function useUsers() {
  return useQuery<User[]>({
    queryKey: ["users"],
    queryFn: async () => {
      const { data } = await api.get("/users");
      return data;
    },
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (updatedUser: { id: number; user: Partial<User> }) => {
      console.log("Executando mutação para usuário:", updatedUser.id);
      const { data } = await api.put(
        `/users/${updatedUser.id}`,
        updatedUser.user
      );
      console.log("Resposta da mutação:", data);
      return data;
    },
    onMutate: async (updatedUser) => {
      console.log(
        "Iniciando atualização otimista para usuário:",
        updatedUser.id
      );
      // Cancelar queries em andamento
      await queryClient.cancelQueries({ queryKey: ["users"] });

      // Snapshot do valor anterior
      const previousUsers = queryClient.getQueryData<User[]>(["users"]);

      // Atualização otimista
      queryClient.setQueryData<User[]>(["users"], (old) => {
        const updated = old?.map((user) =>
          user.id === updatedUser.id ? { ...user, ...updatedUser.user } : user
        );
        console.log("Cache atualizado otimisticamente:", updated);
        return updated;
      });

      // Retorna o contexto com o valor anterior
      return { previousUsers };
    },
    onError: (err, updatedUser, context) => {
      console.error("Erro na mutação:", err);
      // Em caso de erro, reverte para o valor anterior
      if (context?.previousUsers) {
        queryClient.setQueryData(["users"], context.previousUsers);
      }
    },
    onSettled: () => {
      console.log("Finalizando mutação - invalidando queries");
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
