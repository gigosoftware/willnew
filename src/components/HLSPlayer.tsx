import { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';
import { AlertCircle } from 'lucide-react';

interface HLSPlayerProps {
  src: string;
  className?: string;
}

export const HLSPlayer = ({ src, className = '' }: HLSPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const pauseHandlerRef = useRef<(() => void) | null>(null);
  const playHandlerRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (!videoRef.current || !src) {
      setError('URL inválida');
      return;
    }

    const video = videoRef.current;
    setError(null);
    setIsLoading(true);

    if (Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        maxBufferLength: 10,        // Reduzido para menor memória
        maxMaxBufferLength: 20,     // Reduzido para menor memória
        maxBufferSize: 30 * 1000 * 1000, // 30MB max
        maxBufferHole: 0.5,
        backBufferLength: 10,       // Limpa buffer antigo
      });
      
      hlsRef.current = hls;
      
      hls.on(Hls.Events.ERROR, (_event, data) => {
        if (data.fatal) {
          setError(`Erro: ${data.type}`);
          setIsLoading(false);
        }
      });

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        setIsLoading(false);
        video.muted = true;
        video.play().catch(() => setError('Erro ao reproduzir'));
      });
      
      // Handlers com referência para remoção
      pauseHandlerRef.current = () => {
        if (hlsRef.current) {
          hlsRef.current.stopLoad();
        }
      };
      
      playHandlerRef.current = () => {
        if (hlsRef.current) {
          hlsRef.current.startLoad();
        }
      };
      
      video.addEventListener('pause', pauseHandlerRef.current);
      video.addEventListener('play', playHandlerRef.current);

      hls.loadSource(src);
      hls.attachMedia(video);
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = src;
      video.onloadedmetadata = () => {
        setIsLoading(false);
        video.play().catch((e) => {
          console.error('[HLSPlayer] Play error:', e);
          setError('Erro ao reproduzir');
        });
      };
      video.onerror = () => {
        setError('Erro ao carregar vídeo');
        setIsLoading(false);
      };
    } else {
      setError('Navegador não suportado');
      setIsLoading(false);
    }

    return () => {
      // Remover event listeners
      if (video) {
        if (pauseHandlerRef.current) {
          video.removeEventListener('pause', pauseHandlerRef.current);
          pauseHandlerRef.current = null;
        }
        if (playHandlerRef.current) {
          video.removeEventListener('play', playHandlerRef.current);
          playHandlerRef.current = null;
        }
        
        video.pause();
        video.removeAttribute('src');
        video.load();
      }
      
      // Destruir HLS completamente
      if (hlsRef.current) {
        try {
          hlsRef.current.stopLoad();
          hlsRef.current.detachMedia();
          hlsRef.current.destroy();
        } catch (e) {
          // Ignorar erros de cleanup
        } finally {
          hlsRef.current = null;
        }
      }
    };
  }, [src]);

  if (error) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-gray-900 text-red-400">
        <AlertCircle className="w-8 h-8 mb-2" />
        <span className="text-xs">{error}</span>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900 text-white text-xs">
          Carregando...
        </div>
      )}
      <video
        ref={videoRef}
        className={`max-w-full max-h-full object-contain ${className}`}
        muted
        playsInline
      />
    </div>
  );
};
