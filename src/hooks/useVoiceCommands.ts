import { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { usePlayerStore } from '../stores/usePlayerStore';
import { useMosaicStore } from '../stores/useMosaicStore';
import toast from 'react-hot-toast';

interface VoiceCommand {
  pattern: RegExp;
  action: (match: RegExpMatchArray) => void;
  description: string;
}

export const useVoiceCommands = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { voiceEnabled } = usePlayerStore();
  const recognitionRef = useRef<any>(null);
  const [isListening, setIsListening] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [transcript, setTranscript] = useState('');
  const isActiveRef = useRef(false);

  const playerStore = usePlayerStore();
  const mosaicStore = useMosaicStore();

  // Comandos disponíveis
  const commands: VoiceCommand[] = [
    // Navegação
    {
      pattern: /(próximo|avançar|seguinte|próxima|avança|passa|passa pro próximo|vai pro próximo|vai para o próximo)( mosaico)?/i,
      action: () => {
        if (location.pathname === '/vision') {
          const { nextMosaic } = usePlayerStore.getState();
          const { selectedMosaics } = useMosaicStore.getState();
          nextMosaic(selectedMosaics.length);
          toast.success('Próximo mosaico');
        }
      },
      description: 'Avançar para próximo mosaico'
    },
    {
      pattern: /(anterior|voltar|volta|retroceder|retrocede|volta pro anterior|vai pro anterior)( mosaico)?/i,
      action: () => {
        if (location.pathname === '/vision') {
          const { prevMosaic } = usePlayerStore.getState();
          const { selectedMosaics } = useMosaicStore.getState();
          prevMosaic(selectedMosaics.length);
          toast.success('Mosaico anterior');
        }
      },
      description: 'Voltar para mosaico anterior'
    },
    {
      pattern: /(ir para|vai para|vai pro|mosaico|número|abre o|abrir o) (\d+)/i,
      action: (match) => {
        const num = parseInt(match[2]) - 1;
        const { selectedMosaics } = useMosaicStore.getState();
        if (location.pathname === '/vision' && num >= 0 && num < selectedMosaics.length) {
          usePlayerStore.setState({ currentIndex: num });
          toast.success(`Mosaico ${num + 1}`);
        }
      },
      description: 'Ir para mosaico específico'
    },
    {
      pattern: /(primeiro|vai pro primeiro|volta pro primeiro|começo)( mosaico)?/i,
      action: () => {
        if (location.pathname === '/vision') {
          usePlayerStore.setState({ currentIndex: 0 });
          toast.success('Primeiro mosaico');
        }
      },
      description: 'Ir para primeiro mosaico'
    },
    {
      pattern: /(último|vai pro último|vai para o último|final)( mosaico)?/i,
      action: () => {
        if (location.pathname === '/vision') {
          const { selectedMosaics } = useMosaicStore.getState();
          usePlayerStore.setState({ currentIndex: selectedMosaics.length - 1 });
          toast.success('Último mosaico');
        }
      },
      description: 'Ir para último mosaico'
    },

    // Controle de reprodução
    {
      pattern: /(pausar|pausa|para|parar|congela|congelar|espera|esperar)( reprodução)?/i,
      action: () => {
        if (location.pathname === '/vision') {
          const { setPlaying } = usePlayerStore.getState();
          setPlaying(false);
          toast.success('Pausado');
        }
      },
      description: 'Pausar reprodução'
    },
    {
      pattern: /(play|continuar|retomar|iniciar|começar|despausar|reproduzir|volta|voltar|despausa)( reprodução)?/i,
      action: () => {
        if (location.pathname === '/vision') {
          const { setPlaying } = usePlayerStore.getState();
          setPlaying(true);
          toast.success('Reproduzindo');
        }
      },
      description: 'Retomar reprodução'
    },

    // Favoritos
    {
      pattern: /(reproduzir|iniciar|abrir|começar|vai para|vai pros)( os)?( meus)? favoritos/i,
      action: () => {
        const { favoriteMosaics, selectFavorites } = useMosaicStore.getState();
        if (favoriteMosaics.length === 0) {
          toast.error('Nenhum favorito');
          return;
        }
        selectFavorites();
        toast.success(`${favoriteMosaics.length} favoritos selecionados`);
        setTimeout(() => navigate('/vision'), 500);
      },
      description: 'Reproduzir favoritos'
    },

    // Navegação de páginas
    {
      pattern: /(ir para|vai para|vai pro|abrir|voltar para|volta pro|sair do|fechar|sair|fecha)( o)?( lounge| vision)?/i,
      action: () => {
        navigate('/');
        toast.success('Lounge');
      },
      description: 'Ir para Lounge'
    },
    {
      pattern: /(iniciar|abrir|começar|vai para|vai pro|abre o)( o)?( vision| reprodução)/i,
      action: () => {
        const { selectedMosaics } = useMosaicStore.getState();
        if (selectedMosaics.length === 0) {
          toast.error('Selecione mosaicos primeiro');
          return;
        }
        navigate('/vision');
        toast.success('Vision iniciado');
      },
      description: 'Iniciar Vision'
    },
    {
      pattern: /(abrir|ir para|vai para|vai pro|abre)( as)?( configurações| settings)/i,
      action: () => {
        navigate('/settings');
        toast.success('Configurações');
      },
      description: 'Abrir Configurações'
    },

    // Seleção (Lounge)
    {
      pattern: /(selecionar|marcar|marca|seleciona|pega)( todos| tudo)?/i,
      action: () => {
        if (location.pathname === '/') {
          const { mosaics, selectedMosaics, toggleMosaic } = useMosaicStore.getState();
          mosaics.forEach(m => {
            if (!selectedMosaics.includes(m.id)) {
              toggleMosaic(m.id);
            }
          });
          toast.success(`${mosaics.length} mosaicos selecionados`);
        }
      },
      description: 'Selecionar todos os mosaicos'
    },
    {
      pattern: /(limpar|limpa|desmarcar|desmarca|tira tudo|remove tudo|nenhum)( seleção| todos)?/i,
      action: () => {
        if (location.pathname === '/') {
          const { clearSelection } = useMosaicStore.getState();
          clearSelection();
          toast.success('Seleção limpa');
        }
      },
      description: 'Limpar seleção'
    },

    // Intervalo
    {
      pattern: /(intervalo|muda intervalo|mudar intervalo|define intervalo|definir intervalo)( de| para)? (\d+) segundos?/i,
      action: (match) => {
        const seconds = parseInt(match[3]);
        if ([10, 30].includes(seconds)) {
          const { setInterval } = usePlayerStore.getState();
          setInterval(seconds);
          toast.success(`Intervalo: ${seconds}s`);
        }
      },
      description: 'Alterar intervalo'
    },
    {
      pattern: /(intervalo|muda intervalo|mudar intervalo|define intervalo|definir intervalo)( de| para)? (\d+) minutos?/i,
      action: (match) => {
        const minutes = parseInt(match[3]);
        const seconds = minutes * 60;
        if ([60, 120, 300].includes(seconds)) {
          const { setInterval } = usePlayerStore.getState();
          setInterval(seconds);
          toast.success(`Intervalo: ${minutes}min`);
        }
      },
      description: 'Alterar intervalo'
    },

    // Informações
    {
      pattern: /(qual|que|onde|status|informação|info)( mosaico| estou)?/i,
      action: () => {
        if (location.pathname === '/vision') {
          const { currentIndex } = usePlayerStore.getState();
          const { mosaics, selectedMosaics } = useMosaicStore.getState();
          const current = mosaics.find(m => m.id === selectedMosaics[currentIndex]);
          toast.success(`Mosaico ${currentIndex + 1}/${selectedMosaics.length}${current ? ': ' + current.title : ''}`);
        }
      },
      description: 'Status atual'
    },
    {
      pattern: /(quantos|quanto|total)( mosaicos| selecionados)?/i,
      action: () => {
        const { selectedMosaics } = useMosaicStore.getState();
        toast.success(`${selectedMosaics.length} mosaicos selecionados`);
      },
      description: 'Quantidade de mosaicos'
    },

    // Cancelar
    {
      pattern: /(cancelar|cancela|esqueça|esquece|nada|deixa pra lá)/i,
      action: () => {
        toast('Cancelado');
      },
      description: 'Cancelar comando'
    }
  ];

  useEffect(() => {
    if (!voiceEnabled) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
      setIsActive(false);
      return;
    }

    // Verificar suporte
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.warn('Speech Recognition não suportado');
      return;
    }

    // Criar instância com configurações otimizadas
    const recognition = new SpeechRecognition();
    recognition.lang = 'pt-BR';
    recognition.continuous = true;
    recognition.interimResults = true; // Resultados parciais para resposta mais rápida
    recognition.maxAlternatives = 3; // Múltiplas alternativas para melhor precisão

    recognition.onstart = () => {
      setIsListening(true);
      console.log('[Voice] Escutando...');
    };

    recognition.onend = () => {
      setIsListening(false);
      setIsActive(false);
      setTranscript('');
    };

    recognition.onerror = (event: any) => {
      console.error('[Voice] Erro:', event.error);
      if (event.error === 'not-allowed') {
        toast.error('Permissão de microfone negada');
      }
    };

    recognition.onresult = (event: any) => {
      const result = event.results[event.results.length - 1];
      
      // Processar APENAS resultados finais
      if (!result.isFinal) {
        return;
      }
      
      const text = result[0].transcript.toLowerCase().trim();
      
      if (!text) return;
      
      console.log('[Voice] Reconhecido:', text);
      setTranscript(text);

      // Detectar palavra de ativação "Will" ou "Vision" (com variações de pronúncia)
      const hasActivationWord = 
        /\b(will|uil|uiu|wil|ui|vil|viu|iu)\b/i.test(text) || 
        /\bvision\b/i.test(text);
      
      if (!isActiveRef.current && hasActivationWord) {
        isActiveRef.current = true;
        setIsActive(true);
        toast('🎤 Escutando...', { duration: 2000 });
        setTimeout(() => {
          isActiveRef.current = false;
          setIsActive(false);
        }, 5000);
        return;
      }

      // Processar comando se ativo
      if (isActiveRef.current && result.isFinal) {
        let commandFound = false;
        
        for (const cmd of commands) {
          const match = text.match(cmd.pattern);
          if (match) {
            console.log('[Voice] Executando:', cmd.description);
            cmd.action(match);
            commandFound = true;
            isActiveRef.current = false;
            setIsActive(false);
            setTranscript('');
            break;
          }
        }

        if (!commandFound && result.isFinal) {
          toast.error('Comando não reconhecido');
          isActiveRef.current = false;
          setIsActive(false);
        }
      }
    };

    recognitionRef.current = recognition;

    // Iniciar apenas uma vez
    try {
      recognition.start();
    } catch (e) {
      console.error('[Voice] Erro ao iniciar:', e);
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {
          // Ignorar erro se já parou
        }
      }
    };
  }, [voiceEnabled]);

  return {
    isListening,
    isActive,
    transcript
  };
};
