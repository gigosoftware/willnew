import { Palette } from 'lucide-react';
import { useThemeStore } from '../stores/useThemeStore';

const themes = [
  { id: 'dark', name: 'Dark', bg: 'bg-gray-900' },
  { id: 'neon', name: 'Neon', bg: 'bg-purple-900' },
  { id: 'corporate', name: 'Corporate', bg: 'bg-blue-900' },
] as const;

export const ThemeSelector = () => {
  const { theme, setTheme } = useThemeStore();

  return (
    <div className="flex items-center gap-2">
      <Palette className="w-5 h-5" />
      <select
        value={theme}
        onChange={(e) => setTheme(e.target.value as any)}
        className="bg-white/10 border border-white/20 rounded px-3 py-1 text-sm"
      >
        {themes.map((t) => (
          <option key={t.id} value={t.id}>
            {t.name}
          </option>
        ))}
      </select>
    </div>
  );
};
