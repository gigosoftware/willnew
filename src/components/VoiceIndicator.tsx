import { Mic } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface VoiceIndicatorProps {
  isListening: boolean;
  isActive: boolean;
  transcript: string;
}

export const VoiceIndicator = ({ isListening, isActive, transcript }: VoiceIndicatorProps) => {
  if (!isListening) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-20 right-6 z-50"
    >
      <div className={`flex items-center gap-3 px-4 py-3 rounded-xl backdrop-blur-lg border transition-all ${
        isActive 
          ? 'bg-blue-500/30 border-blue-400 shadow-lg shadow-blue-500/50' 
          : 'bg-white/10 border-white/20'
      }`}>
        <motion.div
          animate={isActive ? { scale: [1, 1.2, 1] } : {}}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          {isActive ? (
            <Mic className="w-5 h-5 text-blue-400" />
          ) : (
            <Mic className="w-5 h-5 text-gray-400" />
          )}
        </motion.div>
        
        <div className="flex flex-col">
          <span className={`text-sm font-medium ${isActive ? 'text-blue-400' : 'text-gray-400'}`}>
            {isActive ? '🎤 Escutando comando...' : 'Diga "Will"'}
          </span>
          
          <AnimatePresence>
            {transcript && isActive && (
              <motion.span
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="text-xs text-white/70 mt-1"
              >
                "{transcript}"
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};
