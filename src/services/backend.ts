const API_URL = import.meta.env.VITE_BACKEND_URL || 'https://will.conectae.com.br/api';

let authToken: string | null = localStorage.getItem('will_token');

export const setAuthToken = (token: string | null) => {
  authToken = token;
  if (token) {
    localStorage.setItem('will_token', token);
  } else {
    localStorage.removeItem('will_token');
  }
};

const fetchAPI = async (endpoint: string, options: RequestInit = {}) => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Erro no servidor' }));
    throw new Error(error.error || 'Erro na requisição');
  }

  return response.json();
};

export const backendAPI = {
  // Auth
  login: async (email: string, password: string) => {
    const data = await fetchAPI('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    setAuthToken(data.token);
    return data.user;
  },

  logout: () => {
    setAuthToken(null);
  },

  // Users
  getUsers: () => fetchAPI('/users'),
  
  createUser: (email: string, password: string, isAdmin: boolean) =>
    fetchAPI('/users', {
      method: 'POST',
      body: JSON.stringify({ email, password, isAdmin }),
    }),

  updateUser: (email: string, updates: { password?: string; isAdmin?: boolean }) =>
    fetchAPI(`/users/${encodeURIComponent(email)}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    }),

  deleteUser: (email: string) =>
    fetchAPI(`/users/${encodeURIComponent(email)}`, {
      method: 'DELETE',
    }),

  // Config
  getConfig: () => fetchAPI('/config'),
  
  saveConfig: (config: any) =>
    fetchAPI('/config', {
      method: 'PUT',
      body: JSON.stringify(config),
    }),

  saveSelectedMosaics: async (selectedMosaics: number[]) => {
    const config = await fetchAPI('/config');
    return fetchAPI('/config', {
      method: 'PUT',
      body: JSON.stringify({ ...config, selectedMosaics }),
    });
  },

  // Logs
  getLogs: () => fetchAPI('/logs'),
};
