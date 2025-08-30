import { api } from "@/services/api";
import { UserFormValues } from "../schemas/user.schema";
import { User } from "@/components/datatable/interfaces/user";

export const UserService = {
  async getUsers() {
    return api.get<User[]>("/users");
  },

  async getUserById(id: string) {
    return api.get<User>(`/users/${id}`);
  },

  async createUser(data: UserFormValues) {
    return api.post("/users", data);
  },

  async updateUser(id: number, data: Partial<UserFormValues>) {
    return api.put(`/users/${id}`, data);
  },

  async deleteUser(id: string) {
    return api.delete(`/users/${id}`);
  },
};
