import type { User } from '../types';

const USERS_KEY = 'will_users';
const CURRENT_USER_KEY = 'will_current_user';

const defaultAdmin: User = {
  id: '1',
  email: 'rogerio.gigo@conectae.com.br',
  isAdmin: true,
  createdAt: new Date().toISOString(),
};

export const authService = {
  initialize() {
    const users = this.getUsers();
    if (users.length === 0) {
      localStorage.setItem(USERS_KEY, JSON.stringify([{ ...defaultAdmin, password: 'gigo123' }]));
    }
  },

  getUsers(): any[] {
    const data = localStorage.getItem(USERS_KEY);
    return data ? JSON.parse(data) : [];
  },

  login(email: string, password: string): User | null {
    const users = this.getUsers();
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
      const { password: _, ...userWithoutPassword } = user;
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userWithoutPassword));
      return userWithoutPassword;
    }
    return null;
  },

  logout() {
    localStorage.removeItem(CURRENT_USER_KEY);
  },

  getCurrentUser(): User | null {
    const data = localStorage.getItem(CURRENT_USER_KEY);
    return data ? JSON.parse(data) : null;
  },

  createUser(email: string, password: string, isAdmin: boolean): User {
    const users = this.getUsers();
    const newUser = {
      id: Date.now().toString(),
      email,
      password,
      isAdmin,
      createdAt: new Date().toISOString(),
    };
    users.push(newUser);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    const { password: _, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  },

  updateUser(id: string, updates: Partial<{ email: string; password: string; isAdmin: boolean }>) {
    const users = this.getUsers();
    const index = users.findIndex(u => u.id === id);
    if (index !== -1) {
      users[index] = { ...users[index], ...updates };
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
    }
  },

  deleteUser(id: string) {
    const users = this.getUsers();
    const filtered = users.filter(u => u.id !== id);
    localStorage.setItem(USERS_KEY, JSON.stringify(filtered));
  },

  getAllUsers(): User[] {
    return this.getUsers().map(({ password, ...user }) => user);
  },
};
