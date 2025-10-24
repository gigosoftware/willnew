/**
 * Calcula o intervalo inteligente baseado no número de câmeras
 * 
 * Lógica:
 * - Tempo base é para 9 câmeras (3x3)
 * - Menos câmeras = menos tempo (mais rápido)
 * - Mais câmeras = mais tempo (mais lento)
 * - Mínimo: 10 segundos
 * - Máximo: 5 minutos (300s)
 * 
 * Fórmula: (baseInterval / 9) * numCameras
 * 
 * Exemplos:
 * - 4 câmeras (2x2) com 30s base = 13s
 * - 9 câmeras (3x3) com 30s base = 30s
 * - 16 câmeras (4x4) com 30s base = 53s
 * - 64 câmeras (8x8) com 30s base = 213s
 */
export const calculateSmartInterval = (
  baseInterval: number,
  numCameras: number
): number => {
  const REFERENCE_CAMERAS = 9; // 3x3 como referência
  const MIN_INTERVAL = 10; // 10 segundos mínimo
  const MAX_INTERVAL = 300; // 5 minutos máximo

  // Calcula proporcionalmente
  const calculated = Math.round((baseInterval / REFERENCE_CAMERAS) * numCameras);

  // Aplica limites
  return Math.max(MIN_INTERVAL, Math.min(MAX_INTERVAL, calculated));
};

/**
 * Extrai número de câmeras do tipo de mosaico
 */
export const getCameraCount = (mosaicType: string): number => {
  // Formatos: "2x2", "3x3", "4x4", etc
  const match = mosaicType.match(/(\d+)x(\d+)/);
  if (match) {
    const cols = parseInt(match[1]);
    const rows = parseInt(match[2]);
    return cols * rows;
  }
  
  // Fallback para formatos especiais
  if (mosaicType === '1x7') return 7;
  
  return 9; // Default 3x3
};
