import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/useAuthStore';
import { usersAPI } from '../services/usersAPI';
import { backendAPI } from '../services/backend';
import { ArrowLeft, Plus, Trash2, Edit, Activity } from 'lucide-react';
import toast from 'react-hot-toast';
import type { User } from '../types';

interface AccessLog {
  id: string;
  email: string;
  ip: string;
  date: string;
  timestamp: number;
}

export const Users = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [logs, setLogs] = useState<AccessLog[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ email: '', password: '', isAdmin: false });

  useEffect(() => {
    if (!user?.isAdmin) {
      navigate('/');
      return;
    }
    loadUsers();
    loadLogs();
  }, [user, navigate]);

  const loadUsers = async () => {
    try {
      const data = await usersAPI.getAllUsers();
      setUsers(data);
    } catch (error) {
      console.error('Load users error:', error);
    }
  };

  const loadLogs = async () => {
    try {
      const data = await backendAPI.getLogs();
      setLogs(data);
    } catch (error) {
      console.error('Load logs error:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        const updates: any = { isAdmin: formData.isAdmin };
        if (formData.password) updates.password = formData.password;
        await usersAPI.updateUser(formData.email, updates);
        toast.success('Usuário atualizado com sucesso!');
      } else {
        await usersAPI.createUser(formData.email, formData.password, formData.isAdmin);
        toast.success('Usuário criado com sucesso!');
      }
      setFormData({ email: '', password: '', isAdmin: false });
      setShowForm(false);
      setEditingId(null);
      loadUsers();
    } catch (error) {
      console.error('Save user error:', error);
      toast.error('Erro ao salvar usuário');
    }
  };

  const handleEdit = (u: User) => {
    setEditingId(u.id);
    setFormData({ email: u.email, password: '', isAdmin: u.isAdmin });
    setShowForm(true);
  };

  const handleDelete = async (email: string) => {
    if (confirm('Confirma exclusão?')) {
      try {
        await usersAPI.deleteUser(email);
        toast.success('Usuário deletado com sucesso!');
        loadUsers();
      } catch (error) {
        console.error('Delete user error:', error);
        toast.error('Erro ao deletar usuário');
      }
    }
  };

  return (
    <div className="min-h-screen text-white">
      <header className="border-b border-white/10 bg-black/20 backdrop-blur-lg">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <button onClick={() => navigate('/')} className="flex items-center gap-2 hover:text-blue-400">
            <ArrowLeft className="w-5 h-5" />
            Voltar
          </button>
          <h1 className="text-2xl font-bold">Gerenciar Usuários</h1>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg"
          >
            <Plus className="w-4 h-4" />
            Novo
          </button>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        {showForm && (
          <div className="mb-8 bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <h2 className="text-xl font-semibold mb-4">{editingId ? 'Editar' : 'Novo'} Usuário</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm mb-2">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm mb-2">Senha {editingId && '(deixe vazio para manter)'}</label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg"
                  required={!editingId}
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.isAdmin}
                  onChange={(e) => setFormData({ ...formData, isAdmin: e.target.checked })}
                  className="w-4 h-4"
                />
                <label className="text-sm">Administrador</label>
              </div>
              <div className="flex gap-2">
                <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg">
                  Salvar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingId(null);
                    setFormData({ email: '', password: '', isAdmin: false });
                  }}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="bg-white/10 backdrop-blur-lg rounded-xl overflow-hidden border border-white/20">
          <table className="w-full">
            <thead className="bg-white/5">
              <tr>
                <th className="px-6 py-3 text-left">Email</th>
                <th className="px-6 py-3 text-left">Tipo</th>
                <th className="px-6 py-3 text-left">Criado em</th>
                <th className="px-6 py-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-t border-white/10">
                  <td className="px-6 py-4">{u.email}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs ${u.isAdmin ? 'bg-purple-600' : 'bg-gray-600'}`}>
                      {u.isAdmin ? 'Admin' : 'User'}
                    </span>
                  </td>
                  <td className="px-6 py-4">{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => handleEdit(u)} className="p-2 hover:bg-white/10 rounded mr-2">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(u.email)} className="p-2 hover:bg-red-600/20 rounded">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Logs de Acesso */}
        <div className="mt-8 bg-white/10 backdrop-blur-lg rounded-xl overflow-hidden border border-white/20">
          <div className="bg-white/5 px-6 py-3 flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-400" />
            <h2 className="text-lg font-semibold">Últimos 15 Acessos</h2>
          </div>
          <table className="w-full">
            <thead className="bg-white/5">
              <tr>
                <th className="px-6 py-3 text-left">Usuário</th>
                <th className="px-6 py-3 text-left">IP</th>
                <th className="px-6 py-3 text-left">Data/Hora</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id} className="border-t border-white/10">
                  <td className="px-6 py-3">{log.email}</td>
                  <td className="px-6 py-3 font-mono text-sm">{log.ip}</td>
                  <td className="px-6 py-3">
                    {new Date(log.date).toLocaleString('pt-BR', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit'
                    })}
                  </td>
                </tr>
              ))}
              {logs.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-6 py-8 text-center text-gray-400">
                    Nenhum acesso registrado
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};
