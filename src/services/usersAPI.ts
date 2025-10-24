import { backendAPI } from './backend';
import type { User } from '../types';

export const usersAPI = {
  async getAllUsers(): Promise<User[]> {
    return backendAPI.getUsers();
  },

  async createUser(email: string, password: string, isAdmin: boolean): Promise<User> {
    return backendAPI.createUser(email, password, isAdmin);
  },

  async updateUser(email: string, updates: { password?: string; isAdmin?: boolean }): Promise<void> {
    await backendAPI.updateUser(email, updates);
  },

  async deleteUser(email: string): Promise<void> {
    await backendAPI.deleteUser(email);
  },
};
