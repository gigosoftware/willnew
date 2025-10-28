import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMosaicStore } from '../stores/useMosaicStore';
import { useAuthStore } from '../stores/useAuthStore';
import { usePlayerStore } from '../stores/usePlayerStore';
import { ThemeSelector } from '../components/ThemeSelector';
import { Play, Users, LogOut, Search, Grid, Settings as SettingsIcon, CheckSquare, XSquare } from 'lucide-react';
import { motion } from 'framer-motion';

export const Lounge = () => {
  const { mosaics, selectedMosaics, isLoading, fetchMosaics, loadSelectedMosaics, toggleMosaic, clearSelection } = useMosaicStore();
  const { autoStart, loadUserConfig } = usePlayerStore();
  const [configLoaded, setConfigLoaded] = useState(false);

  const selectAll = () => {
    mosaics.forEach(m => {
      if (!selectedMosaics.includes(m.id)) {
        toggleMosaic(m.id);
      }
    });
  };
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  useEffect(() => {
    const loadData = async () => {
      await loadUserConfig();
      setConfigLoaded(true);
      await fetchMosaics();
      await loadSelectedMosaics();
    };
    loadData();
  }, [fetchMosaics, loadSelectedMosaics, loadUserConfig]);

  useEffect(() => {
    if (!configLoaded || !autoStart || selectedMosaics.length === 0 || mosaics.length === 0) return;

    let inactivityTimer: ReturnType<typeof setTimeout>;

    const startTimer = () => {
      inactivityTimer = setTimeout(() => {
        navigate('/vision');
      }, 60000);
    };

    const resetTimer = () => {
      clearTimeout(inactivityTimer);
      startTimer();
    };

    startTimer();

    window.addEventListener('mousemove', resetTimer);
    window.addEventListener('keydown', resetTimer);
    window.addEventListener('click', resetTimer);

    return () => {
      clearTimeout(inactivityTimer);
      window.removeEventListener('mousemove', resetTimer);
      window.removeEventListener('keydown', resetTimer);
      window.removeEventListener('click', resetTimer);
    };
  }, [configLoaded, autoStart, selectedMosaics, mosaics, navigate]);

  const filteredMosaics = mosaics.filter((m) =>
    m.title.toLowerCase().includes(search.toLowerCase())
  );

  const handlePlay = () => {
    if (selectedMosaics.length > 0) {
      navigate('/vision');
    }
  };

  return (
    <div className="min-h-screen text-white">
      <header className="border-b border-white/10 bg-black/20 backdrop-blur-lg">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Grid className="w-8 h-8 text-blue-400" />
            <h1 className="text-2xl font-bold">Will Lounge</h1>
          </div>
          <div className="flex items-center gap-4">
            <ThemeSelector />
            <button
              onClick={() => navigate('/settings')}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
            >
              <SettingsIcon className="w-4 h-4" />
              Configurações
            </button>
            {user?.isAdmin && (
              <button
                onClick={() => navigate('/users')}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
              >
                <Users className="w-4 h-4" />
                Usuários
              </button>
            )}
            <button
              onClick={logout}
              className="flex items-center gap-2 px-4 py-2 bg-red-600/20 hover:bg-red-600/30 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Sair
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 flex-1">
            <button
              onClick={selectAll}
              className="flex items-center gap-2 px-4 py-2 bg-green-600/20 hover:bg-green-600/30 border border-green-500/50 rounded-lg transition-colors"
              title="Selecionar Todos"
            >
              <CheckSquare className="w-5 h-5" />
            </button>
            <button
              onClick={clearSelection}
              className="flex items-center gap-2 px-4 py-2 bg-red-600/20 hover:bg-red-600/30 border border-red-500/50 rounded-lg transition-colors"
              title="Limpar Seleção"
            >
              <XSquare className="w-5 h-5" />
            </button>
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar mosaicos..."
                className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <button
            onClick={handlePlay}
            disabled={selectedMosaics.length === 0}
            className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg font-semibold transition-colors"
          >
            <Play className="w-5 h-5" />
            Vision ({selectedMosaics.length})
          </button>
        </div>

        {isLoading ? (
          <div className="text-center py-12">Carregando mosaicos...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredMosaics.map((mosaic) => (
              <motion.div
                key={mosaic.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.02 }}
                className={`backdrop-blur-lg rounded-xl p-6 border-2 cursor-pointer transition-all duration-300 ${
                  selectedMosaics.includes(mosaic.id)
                    ? 'border-blue-400 bg-blue-500/30 shadow-[0_0_25px_rgba(59,130,246,0.6)] ring-2 ring-blue-400/50'
                    : 'border-white/20 bg-white/10 hover:border-white/40 hover:bg-white/15 hover:shadow-lg'
                }`}
                onClick={() => toggleMosaic(mosaic.id)}
              >
                <h3 className="text-xl font-semibold mb-2">{mosaic.title}</h3>
                <div className="text-sm text-gray-300 space-y-1">
                  <p>Layout: {mosaic.type}</p>
                  <p>Câmeras: {mosaic.streams.filter((s) => s.name).length}</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};
