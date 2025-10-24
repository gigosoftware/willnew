import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMosaicStore } from '../stores/useMosaicStore';
import { usePlayerStore } from '../stores/usePlayerStore';
import { MosaicGrid } from '../components/MosaicGrid';
import { Play, Pause, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { api } from '../services/api';
import { calculateSmartInterval, getCameraCount } from '../utils/smartInterval';
import type { Mosaic } from '../types';

export const Vision = () => {
  const { selectedMosaics } = useMosaicStore();
  const { isPlaying, currentIndex, interval, setPlaying, nextMosaic, prevMosaic, showMosaicInfo, autoFullscreen, smartInterval } = usePlayerStore();
  const navigate = useNavigate();
  const [fullMosaics, setFullMosaics] = useState<Mosaic[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [countdown, setCountdown] = useState(interval);

  const currentMosaic = fullMosaics[currentIndex % fullMosaics.length];

  useEffect(() => {
    if (selectedMosaics.length === 0) {
      navigate('/');
      return;
    }

    const loadFullMosaics = async () => {
      setIsLoading(true);
      try {
        const promises = selectedMosaics.map(id => api.getMosaic(id));
        const loaded = await Promise.all(promises);
        console.log('[Player] Loaded mosaics:', loaded);
        setFullMosaics(loaded);
      } catch (error) {
        console.error('[Player] Error loading mosaics:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadFullMosaics();
  }, [selectedMosaics, navigate]);

  useEffect(() => {
    // Calcula intervalo baseado no modo inteligente
    let effectiveInterval = interval;
    
    if (smartInterval && currentMosaic) {
      const cameraCount = getCameraCount(currentMosaic.type);
      effectiveInterval = calculateSmartInterval(interval, cameraCount);
      console.log(`[Vision] Smart Interval: ${cameraCount} cameras = ${effectiveInterval}s`);
    }
    
    setCountdown(effectiveInterval);
  }, [currentIndex, interval, smartInterval, currentMosaic]);

  useEffect(() => {
    if (!isPlaying || fullMosaics.length <= 1) return;

    // Calcula intervalo efetivo para o timer
    let effectiveInterval = interval;
    if (smartInterval && currentMosaic) {
      const cameraCount = getCameraCount(currentMosaic.type);
      effectiveInterval = calculateSmartInterval(interval, cameraCount);
    }

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          nextMosaic();
          return effectiveInterval;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isPlaying, interval, smartInterval, fullMosaics.length, currentMosaic, nextMosaic]);

  useEffect(() => {
    if (autoFullscreen) {
      const enterFullscreen = () => {
        document.documentElement.requestFullscreen?.();
      };
      enterFullscreen();
    }

    return () => {
      if (document.fullscreenElement) {
        document.exitFullscreen?.();
      }
    };
  }, [autoFullscreen]);

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center">
        <div className="text-white text-xl">Carregando mosaicos...</div>
      </div>
    );
  }

  if (!currentMosaic) return null;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 bg-black flex flex-col">
      {/* Header Bar */}
      <div className="bg-gradient-to-b from-black/90 to-transparent backdrop-blur-sm px-6 py-3 flex items-center justify-between z-10">
        {/* Left: Title */}
        {showMosaicInfo ? (
          <div className="flex items-center gap-3">
            <div className="text-blue-400 font-bold text-xl">VISION</div>
            <div className="h-6 w-px bg-white/20" />
            <div className="text-white font-medium">{currentMosaic.title}</div>
            <div className="text-gray-400 text-sm">({currentIndex + 1}/{fullMosaics.length})</div>
          </div>
        ) : (
          <div className="text-blue-400 font-bold text-xl">VISION</div>
        )}

        {/* Center: Countdown */}
        <div className="flex items-center gap-4">
          {isPlaying && fullMosaics.length > 1 && (
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
              <span className="text-white font-mono text-2xl">{formatTime(countdown)}</span>
            </div>
          )}
        </div>

        {/* Right: Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={prevMosaic}
            disabled={currentIndex === 0}
            className="p-2 bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed rounded-lg transition-all"
            title="Anterior"
          >
            <ChevronLeft className="w-5 h-5 text-white" />
          </button>
          <button
            onClick={() => setPlaying(!isPlaying)}
            className="p-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-all"
            title={isPlaying ? 'Pausar' : 'Reproduzir'}
          >
            {isPlaying ? <Pause className="w-5 h-5 text-white" /> : <Play className="w-5 h-5 text-white" />}
          </button>
          <button
            onClick={nextMosaic}
            disabled={currentIndex >= fullMosaics.length - 1}
            className="p-2 bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed rounded-lg transition-all"
            title="Próximo"
          >
            <ChevronRight className="w-5 h-5 text-white" />
          </button>
          <div className="w-px h-6 bg-white/20 mx-2" />
          <button
            onClick={() => navigate('/')}
            className="p-2 bg-red-600/80 hover:bg-red-600 rounded-lg transition-all"
            title="Fechar"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      {/* Video Grid */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full h-full max-w-[95vw] max-h-[90vh]">
          <MosaicGrid key={currentMosaic.id} mosaic={currentMosaic} />
        </div>
      </div>
    </div>
  );
};
