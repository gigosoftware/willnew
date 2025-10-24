import { useState } from 'react';
import { X } from 'lucide-react';
import { HLSPlayer } from './HLSPlayer';
import type { Mosaic } from '../types';
import { getGridLayout } from '../utils/layout';
import { usePlayerStore } from '../stores/usePlayerStore';

interface MosaicGridProps {
  mosaic: Mosaic;
}

export const MosaicGrid = ({ mosaic }: MosaicGridProps) => {
  const { cols, rows } = getGridLayout(mosaic.type);
  const totalCells = cols * rows;
  const { showStreamTitles } = usePlayerStore();
  const [maximizedStream, setMaximizedStream] = useState<{ name: string; title: string; hlsUrl: string } | null>(null);

  console.log('[MosaicGrid] Mosaic:', mosaic);

  return (
    <>
      {maximizedStream && (
        <div className="fixed inset-0 z-50 bg-black flex flex-col">
          <div className="flex items-center justify-between p-4 bg-gray-900/95 backdrop-blur-sm">
            <h2 className="text-white font-medium">{maximizedStream.title || maximizedStream.name}</h2>
            <button
              onClick={() => setMaximizedStream(null)}
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors text-white"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <div 
            className="flex-1 flex items-center justify-center p-4 cursor-pointer"
            onClick={() => setMaximizedStream(null)}
          >
            <HLSPlayer src={maximizedStream.hlsUrl} className="w-full h-full" />
          </div>
        </div>
      )}
      <div
        className="w-full h-full grid gap-2 bg-black"
        style={{
          gridTemplateColumns: `repeat(${cols}, 1fr)`,
          gridTemplateRows: `repeat(${rows}, 1fr)`,
        }}
      >
      {Array.from({ length: totalCells }).map((_, index) => {
        const stream = mosaic.streams?.[index];
        
        if (!stream || !stream.name) {
          return <div key={index} className="bg-gray-900" />;
        }

        if (!stream.playback_token) {
          return <div key={index} className="bg-gray-800 flex items-center justify-center text-red-400 text-xs">Sem token</div>;
        }

        const endpoint = stream.streaming_endpoint || (mosaic as any).stats?.streaming_endpoint || 'https://vigilancia.conectae.com.br';
        const hlsUrl = `${endpoint}/${stream.name}/index.m3u8?token=${stream.playback_token}`;
        console.log(`[MosaicGrid] HLS URL ${index}:`, hlsUrl);

        return (
          <div 
            key={index} 
            className="relative overflow-hidden bg-gray-900 flex items-center justify-center cursor-pointer hover:ring-2 hover:ring-blue-500 transition-all"
            onClick={() => setMaximizedStream({ name: stream.name!, title: stream.title || stream.name!, hlsUrl })}
          >
            <HLSPlayer src={hlsUrl} />
            {showStreamTitles && stream.title && (
              <div className="absolute bottom-2 left-2 right-2 bg-black/80 backdrop-blur-sm text-white text-xs px-2 py-1 rounded truncate">
                {stream.title}
              </div>
            )}
          </div>
        );
      })}
      </div>
    </>
  );
};
