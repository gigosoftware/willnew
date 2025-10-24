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

  console.log('[MosaicGrid] Mosaic:', mosaic);

  return (
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
          <div key={index} className="relative overflow-hidden bg-gray-900 flex items-center justify-center">
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
  );
};
