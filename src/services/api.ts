import type { Mosaic } from '../types';
import { logger } from '../utils/logger';

const BASE_URL = import.meta.env.VITE_WATCHER_BASE_URL;
const TOKEN = import.meta.env.VITE_WATCHER_TOKEN;

export const api = {
  async getMosaics(): Promise<Mosaic[]> {
    const response = await fetch(`${BASE_URL}/mosaics`, {
      headers: {
        'Authorization': `Bearer ${TOKEN}`,
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) throw new Error('Failed to fetch mosaics');
    const data = await response.json();
    return data.mosaics || [];
  },

  async getMosaic(id: number): Promise<Mosaic> {
    const response = await fetch(`${BASE_URL}/mosaics/${id}`, {
      headers: {
        'Authorization': `Bearer ${TOKEN}`,
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) throw new Error('Failed to fetch mosaic');
    const data = await response.json();
    logger.log('[API] Mosaic response:', data);
    return data;
  },
};
