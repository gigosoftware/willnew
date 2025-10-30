import { useVoiceCommands } from '../hooks/useVoiceCommands';
import { VoiceIndicator } from './VoiceIndicator';

export const VoiceControl = () => {
  const { isListening, isActive, transcript } = useVoiceCommands();

  return (
    <VoiceIndicator 
      isListening={isListening} 
      isActive={isActive} 
      transcript={transcript} 
    />
  );
};
