import { useNavigate } from 'react-router-dom';
import { usePlayerStore } from '../stores/usePlayerStore';
import { ArrowLeft, Clock, Type, Info, Maximize, Zap, Play } from 'lucide-react';

export const Settings = () => {
  const navigate = useNavigate();
  const { interval, setInterval, showStreamTitles, setShowStreamTitles, showMosaicInfo, setShowMosaicInfo, autoFullscreen, setAutoFullscreen, smartInterval, setSmartInterval, autoStart, setAutoStart } = usePlayerStore();

  return (
    <div className="min-h-screen text-white">
      <header className="border-b border-white/10 bg-black/20 backdrop-blur-lg">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <button onClick={() => navigate('/')} className="flex items-center gap-2 hover:text-blue-400">
            <ArrowLeft className="w-5 h-5" />
            Voltar
          </button>
          <h1 className="text-2xl font-bold">Configurações</h1>
          <div className="w-20" />
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Vision Settings */}
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-400" />
              Vision
            </h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Intervalo de Rotação
                </label>
                <select
                  value={interval}
                  onChange={(e) => setInterval(Number(e.target.value))}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value={10}>10 segundos</option>
                  <option value={30}>30 segundos</option>
                  <option value={60}>1 minuto</option>
                  <option value={120}>2 minutos</option>
                  <option value={300}>5 minutos</option>
                </select>
                <p className="text-sm text-gray-400 mt-2">
                  Tempo entre a troca automática de mosaicos no Vision
                </p>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Type className="w-5 h-5 text-blue-400" />
                  <div>
                    <p className="font-medium">Mostrar Títulos dos Streams</p>
                    <p className="text-sm text-gray-400">Exibe o nome de cada câmera no vídeo</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowStreamTitles(!showStreamTitles)}
                  className={`relative w-14 h-7 rounded-full transition-colors ${
                    showStreamTitles ? 'bg-blue-500' : 'bg-gray-600'
                  }`}
                >
                  <span
                    className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform ${
                      showStreamTitles ? 'translate-x-7' : ''
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Info className="w-5 h-5 text-blue-400" />
                  <div>
                    <p className="font-medium">Mostrar Info do Mosaico</p>
                    <p className="text-sm text-gray-400">Exibe título e contador no cabeçalho</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowMosaicInfo(!showMosaicInfo)}
                  className={`relative w-14 h-7 rounded-full transition-colors ${
                    showMosaicInfo ? 'bg-blue-500' : 'bg-gray-600'
                  }`}
                >
                  <span
                    className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform ${
                      showMosaicInfo ? 'translate-x-7' : ''
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Maximize className="w-5 h-5 text-blue-400" />
                  <div>
                    <p className="font-medium">Fullscreen Automático</p>
                    <p className="text-sm text-gray-400">Entra em tela cheia ao abrir o Vision</p>
                  </div>
                </div>
                <button
                  onClick={() => setAutoFullscreen(!autoFullscreen)}
                  className={`relative w-14 h-7 rounded-full transition-colors ${
                    autoFullscreen ? 'bg-blue-500' : 'bg-gray-600'
                  }`}
                >
                  <span
                    className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform ${
                      autoFullscreen ? 'translate-x-7' : ''
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-white/10">
                <div className="flex items-center gap-3">
                  <Zap className="w-5 h-5 text-yellow-400" />
                  <div>
                    <p className="font-medium flex items-center gap-2">
                      Intervalo Inteligente
                      <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-0.5 rounded">NOVO</span>
                    </p>
                    <p className="text-sm text-gray-400">Ajusta tempo automaticamente por número de câmeras</p>
                  </div>
                </div>
                <button
                  onClick={() => setSmartInterval(!smartInterval)}
                  className={`relative w-14 h-7 rounded-full transition-colors ${
                    smartInterval ? 'bg-yellow-500' : 'bg-gray-600'
                  }`}
                >
                  <span
                    className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform ${
                      smartInterval ? 'translate-x-7' : ''
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-white/10">
                <div className="flex items-center gap-3">
                  <Play className="w-5 h-5 text-green-400" />
                  <div>
                    <p className="font-medium flex items-center gap-2">
                      Auto Iniciar
                      <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded">NOVO</span>
                    </p>
                    <p className="text-sm text-gray-400">Inicia Vision automaticamente ao abrir o app</p>
                  </div>
                </div>
                <button
                  onClick={() => setAutoStart(!autoStart)}
                  className={`relative w-14 h-7 rounded-full transition-colors ${
                    autoStart ? 'bg-green-500' : 'bg-gray-600'
                  }`}
                >
                  <span
                    className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform ${
                      autoStart ? 'translate-x-7' : ''
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
