# 📺 Prompt para Criação do WillCat - Sistema de Monitoramento para TV Samsung (Tizen OS)

## 🎯 Contexto do Projeto

Você irá criar o **WillCat**, uma versão simplificada e otimizada do sistema **Will** (Watcher Intelligent Live Lounge), especificamente projetada para rodar em **TVs Samsung com Tizen OS**.

### 📋 Sobre o Projeto Original (Will)

O **Will** é um sistema web de monitoramento de câmeras em tempo real que:
- Conecta-se ao **Flussonic Watcher Client API** para streaming de vídeo
- Permite visualização de múltiplas câmeras através de **mosaicos configuráveis**
- Possui autenticação completa com gerenciamento de usuários
- Oferece rotação automática entre mosaicos com intervalos configuráveis
- Utiliza **React 18 + Vite + TypeScript + TailwindCSS**
- Reproduz vídeo via **HLS.js** com otimizações de performance

**Stack Técnica do Will:**
- React 18 + TypeScript 5
- Vite 5 (build tool)
- Zustand (state management)
- React Router 6
- TailwindCSS 3
- HLS.js (player de vídeo)
- Framer Motion (animações)

---

## 🎬 Objetivo: WillCat para TV Samsung

Criar uma **versão enxuta e focada** do Will, otimizada para TVs Samsung com Tizen OS, com as seguintes características:

### ✅ Funcionalidades Incluídas

1. **Tela de PIN (Entrada)**
   - PIN fixo: `883210`
   - Interface fullscreen otimizada para TV
   - Navegação via controle remoto (setas + OK)
   - Feedback visual ao digitar cada número

2. **Lounge (Seleção de Mosaicos)**
   - Grid de cards com mosaicos disponíveis
   - Navegação com setas do controle remoto
   - Seleção múltipla de mosaicos
   - Botão "Iniciar" para começar reprodução
   - Visual otimizado para visualização a distância

3. **Vision (Player Fullscreen)**
   - Reprodução de mosaicos em tela cheia
   - Rotação automática entre mosaicos selecionados
   - Intervalo configurável (padrão: 45 segundos)
   - Contador visual do próximo mosaico
   - Controles: Play/Pause, Anterior, Próximo
   - Navegação via controle remoto

4. **Configurações Simples**
   - Ajuste de intervalo de rotação (10s a 5min)
   - Opção de mostrar/ocultar títulos das câmeras
   - Acesso via botão no Lounge

### ❌ Funcionalidades Removidas (vs Will original)

- ❌ Sistema de autenticação por e-mail/senha
- ❌ Gerenciamento de usuários (CRUD)
- ❌ Múltiplos níveis de permissão
- ❌ Temas personalizáveis (usar apenas tema escuro)
- ❌ Backend próprio (apenas API Watcher)
- ❌ Histórico de visualizações
- ❌ Funcionalidades administrativas

---

## 🔐 Credenciais e API

### Flussonic Watcher API

**Base URL:**
```
https://vigilancia.conectae.com.br/watcher/client-api/v3
```

**Token de Acesso:**
```
KNxNtEM-nCP6J4p3yTpeB1AZ
```

### Endpoints Principais

1. **Listar Mosaicos:**
```
GET /mosaics?token=KNxNtEM-nCP6J4p3yTpeB1AZ
```

2. **Obter Mosaico Específico:**
```
GET /mosaics/{id}?token=KNxNtEM-nCP6J4p3yTpeB1AZ
```

3. **Estrutura de Resposta (Mosaico):**
```typescript
interface Mosaic {
  id: number;
  title: string;
  type: string; // "2x2", "3x3", "4x4", etc.
  organization_id: number;
  streams: MosaicStream[];
}

interface MosaicStream {
  name?: string;
  title?: string;
  playback_token?: string;
  streaming_endpoint?: string;
  alive?: boolean;
}
```

4. **URL HLS para Reprodução:**
```
{streaming_endpoint}/{stream_name}/index.m3u8?token={playback_token}
```

---

## 🎮 Navegação com Controle Remoto

### Mapeamento de Teclas (Desenvolvimento no Navegador)

Durante o desenvolvimento no Mac, simule o controle remoto com o teclado:

| Controle Remoto | Teclado (Dev) | Código Tizen |
|-----------------|---------------|--------------|
| ⬆️ Cima         | ArrowUp       | 38           |
| ⬇️ Baixo        | ArrowDown     | 40           |
| ⬅️ Esquerda     | ArrowLeft     | 37           |
| ➡️ Direita      | ArrowRight    | 39           |
| ✅ OK/Enter     | Enter         | 13           |
| 🔙 Voltar       | Backspace     | 10009        |
| 0-9 (Números)   | 0-9           | 48-57        |

### Implementação de Navegação

```typescript
// Hook para navegação com controle remoto
useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    switch(e.key) {
      case 'ArrowUp':
        // Navegar para cima
        break;
      case 'ArrowDown':
        // Navegar para baixo
        break;
      case 'ArrowLeft':
        // Navegar para esquerda
        break;
      case 'ArrowRight':
        // Navegar para direita
        break;
      case 'Enter':
        // Confirmar seleção
        break;
      case 'Backspace':
        // Voltar
        break;
    }
  };
  
  window.addEventListener('keydown', handleKeyDown);
  return () => window.removeEventListener('keydown', handleKeyDown);
}, []);
```

---

## 🏗️ Estrutura do Projeto

### Estrutura de Pastas Sugerida

```
willcat/
├── public/
│   └── config.xml              # Configuração Tizen
├── src/
│   ├── components/
│   │   ├── HLSPlayer.tsx       # Player de vídeo HLS
│   │   ├── MosaicGrid.tsx      # Grid de mosaicos
│   │   ├── RemoteControl.tsx   # Lógica de navegação
│   │   └── PinPad.tsx          # Teclado numérico para PIN
│   ├── pages/
│   │   ├── PinEntry.tsx        # Tela de entrada com PIN
│   │   ├── Lounge.tsx          # Seleção de mosaicos
│   │   ├── Vision.tsx          # Player fullscreen
│   │   └── Settings.tsx        # Configurações simples
│   ├── services/
│   │   └── api.ts              # Cliente API Watcher
│   ├── stores/
│   │   ├── useMosaicStore.ts   # Estado dos mosaicos
│   │   ├── usePlayerStore.ts   # Estado do player
│   │   └── useNavStore.ts      # Estado da navegação
│   ├── hooks/
│   │   └── useRemoteControl.ts # Hook para controle remoto
│   ├── types/
│   │   └── index.ts            # TypeScript types
│   ├── utils/
│   │   └── layout.ts           # Utilitários de layout
│   ├── App.tsx
│   └── main.tsx
├── .env                        # Variáveis de ambiente
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
└── tizen-manifest.xml          # Manifest para Tizen
```

---

## 📱 Configuração para Tizen OS

### 1. Arquivo `config.xml` (Tizen)

```xml
<?xml version="1.0" encoding="UTF-8"?>
<widget xmlns="http://www.w3.org/ns/widgets" 
        xmlns:tizen="http://tizen.org/ns/widgets" 
        id="http://conectae.com.br/willcat" 
        version="1.0.0">
    <tizen:application id="KNxNtEM.willcat" 
                       package="KNxNtEM" 
                       required_version="6.0"/>
    <content src="index.html"/>
    <feature name="http://tizen.org/feature/screen.size.all"/>
    <icon src="icon.png"/>
    <name>WillCat</name>
    <tizen:profile name="tv-samsung"/>
    <tizen:setting screen-orientation="landscape" 
                   context-menu="disable" 
                   background-support="disable" 
                   encryption="disable" 
                   install-location="auto"/>
</widget>
```

### 2. Configuração do Vite para Tizen

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: './', // Importante para Tizen
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        manualChunks: undefined, // Single bundle para Tizen
      },
    },
  },
  server: {
    host: '0.0.0.0', // Permitir acesso na rede local
    port: 5173,
  },
});
```

### 3. Package.json Scripts

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "build:tizen": "npm run build && npm run package:tizen",
    "package:tizen": "tizen package -t wgt -s <certificate-profile> -- dist"
  }
}
```

---

## 🎨 Design e UX para TV

### Princípios de Design

1. **Tamanho de Fonte Grande**
   - Mínimo: 24px para texto normal
   - Títulos: 48px ou maior
   - Considerar visualização a 3-4 metros de distância

2. **Contraste Alto**
   - Fundo escuro (#000000 ou #0a0a0a)
   - Texto branco (#ffffff)
   - Elementos focados com borda azul brilhante

3. **Feedback Visual Claro**
   - Elemento focado deve ter borda destacada (4px)
   - Animações suaves de transição
   - Estados hover/focus bem definidos

4. **Espaçamento Generoso**
   - Padding mínimo: 32px
   - Gap entre elementos: 24px
   - Área clicável mínima: 120x80px

### Exemplo de Estilos TailwindCSS

```typescript
// Card de mosaico focável
<div className={`
  p-8 rounded-xl transition-all duration-200
  ${isFocused 
    ? 'ring-4 ring-blue-500 scale-105 bg-gray-800' 
    : 'bg-gray-900'
  }
`}>
  <h3 className="text-4xl font-bold text-white mb-4">
    {mosaic.title}
  </h3>
  <p className="text-2xl text-gray-400">
    {mosaic.type}
  </p>
</div>
```

---

## 🔢 Implementação da Tela de PIN

### Componente PinEntry

```typescript
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const CORRECT_PIN = '883210';

export const PinEntry = () => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key >= '0' && e.key <= '9') {
        if (pin.length < 6) {
          const newPin = pin + e.key;
          setPin(newPin);
          
          if (newPin.length === 6) {
            if (newPin === CORRECT_PIN) {
              navigate('/lounge');
            } else {
              setError(true);
              setTimeout(() => {
                setPin('');
                setError(false);
              }, 1000);
            }
          }
        }
      } else if (e.key === 'Backspace') {
        setPin(pin.slice(0, -1));
        setError(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [pin, navigate]);

  return (
    <div className="fixed inset-0 bg-black flex flex-col items-center justify-center">
      <h1 className="text-6xl font-bold text-white mb-12">
        WillCat
      </h1>
      <p className="text-3xl text-gray-400 mb-8">
        Digite o PIN para acessar
      </p>
      
      {/* Indicadores de PIN */}
      <div className="flex gap-4 mb-8">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className={`w-16 h-16 rounded-lg border-4 flex items-center justify-center
              ${pin.length > i 
                ? 'border-blue-500 bg-blue-500' 
                : 'border-gray-700'
              }
              ${error ? 'border-red-500 bg-red-500' : ''}
            `}
          >
            {pin.length > i && (
              <span className="text-3xl text-white">●</span>
            )}
          </div>
        ))}
      </div>

      {error && (
        <p className="text-2xl text-red-500">PIN incorreto!</p>
      )}
    </div>
  );
};
```

---

## 🎥 Integração com HLS.js

### Componente HLSPlayer Otimizado

```typescript
import { useEffect, useRef } from 'react';
import Hls from 'hls.js';

interface HLSPlayerProps {
  src: string;
  className?: string;
}

export const HLSPlayer = ({ src, className = '' }: HLSPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);

  useEffect(() => {
    if (!videoRef.current || !src) return;

    const video = videoRef.current;

    if (Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: false, // Desabilitar para TV
        maxBufferLength: 30,
        maxMaxBufferLength: 60,
        maxBufferSize: 60 * 1000 * 1000, // 60MB
      });

      hlsRef.current = hls;
      hls.loadSource(src);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.muted = true;
        video.play().catch(console.error);
      });

      hls.on(Hls.Events.ERROR, (event, data) => {
        if (data.fatal) {
          console.error('HLS Fatal Error:', data);
        }
      });
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = src;
      video.addEventListener('loadedmetadata', () => {
        video.play().catch(console.error);
      });
    }

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [src]);

  return (
    <video
      ref={videoRef}
      className={`w-full h-full object-contain ${className}`}
      muted
      playsInline
    />
  );
};
```

---

## 📦 Empacotamento para Tizen

### Pré-requisitos

1. **Tizen Studio** instalado
2. **Certificado de desenvolvedor** criado
3. **TV Samsung em modo desenvolvedor** (opcional para testes)

### Passos para Gerar .wgt

1. **Build do projeto:**
```bash
npm run build
```

2. **Criar certificado (primeira vez):**
```bash
tizen certificate -a MyTizenCert -p 1234 -c BR -s SP -ct "Sao Paulo" -o "Gigo Software" -n "Rogerio Gigo" -e rogerio.gigo@conectae.com.br
```

3. **Criar perfil de segurança:**
```bash
tizen security-profiles add -n MyProfile -a /path/to/author.p12 -p 1234
```

4. **Empacotar aplicação:**
```bash
tizen package -t wgt -s MyProfile -- dist
```

5. **Instalar na TV (via rede):**
```bash
tizen install -n WillCat.wgt -t <TV_IP>
```

### Estrutura do .wgt

```
WillCat.wgt
├── index.html
├── assets/
│   ├── index-*.js
│   └── index-*.css
├── config.xml
├── icon.png
└── author-signature.xml
```

---

## 🧪 Testes e Desenvolvimento

### Fase 1: Desenvolvimento no Navegador (Mac)

1. Criar projeto React + Vite + TypeScript
2. Implementar navegação com teclado (simular controle remoto)
3. Testar todas as funcionalidades no Chrome/Safari
4. Garantir que funciona em fullscreen (F11)
5. Otimizar performance e memória

### Fase 2: Testes no Tizen Emulator

1. Instalar Tizen Studio
2. Criar emulador de TV Samsung
3. Empacotar app como .wgt
4. Instalar no emulador
5. Testar navegação com controle remoto virtual

### Fase 3: Testes em TV Real

1. Ativar modo desenvolvedor na TV Samsung
2. Conectar TV e Mac na mesma rede
3. Instalar app via Tizen CLI
4. Testar com controle remoto real
5. Ajustar performance e UX

### Comandos Úteis para Debug

```bash
# Ver logs da TV
sdb connect <TV_IP>
sdb shell dlogutil WillCat

# Listar apps instalados
tizen list -t <TV_IP>

# Desinstalar app
tizen uninstall -p KNxNtEM.willcat -t <TV_IP>
```

---

## ⚙️ Configurações e Persistência

### LocalStorage para Configurações

```typescript
interface AppConfig {
  rotationInterval: number; // segundos
  showStreamTitles: boolean;
  lastSelectedMosaics: number[];
}

const DEFAULT_CONFIG: AppConfig = {
  rotationInterval: 45,
  showStreamTitles: true,
  lastSelectedMosaics: [],
};

// Salvar configurações
const saveConfig = (config: AppConfig) => {
  localStorage.setItem('willcat_config', JSON.stringify(config));
};

// Carregar configurações
const loadConfig = (): AppConfig => {
  const stored = localStorage.getItem('willcat_config');
  return stored ? JSON.parse(stored) : DEFAULT_CONFIG;
};
```

---

## 🎯 Checklist de Implementação

### Fase 1: Setup Inicial
- [ ] Criar projeto com Vite + React + TypeScript
- [ ] Configurar TailwindCSS
- [ ] Instalar dependências (HLS.js, Zustand, React Router)
- [ ] Configurar variáveis de ambiente (.env)
- [ ] Criar estrutura de pastas

### Fase 2: Tela de PIN
- [ ] Componente PinEntry
- [ ] Lógica de validação do PIN (883210)
- [ ] Feedback visual (indicadores de dígitos)
- [ ] Navegação para Lounge após PIN correto
- [ ] Tratamento de erro (PIN incorreto)

### Fase 3: Lounge (Seleção)
- [ ] Integração com API Watcher (listar mosaicos)
- [ ] Grid de cards de mosaicos
- [ ] Navegação com setas (foco entre cards)
- [ ] Seleção múltipla de mosaicos
- [ ] Botão "Iniciar" para Vision
- [ ] Botão "Configurações"

### Fase 4: Vision (Player)
- [ ] Componente HLSPlayer
- [ ] Grid de vídeos baseado no tipo de mosaico
- [ ] Rotação automática entre mosaicos
- [ ] Contador visual (próximo mosaico)
- [ ] Controles: Play/Pause, Anterior, Próximo
- [ ] Navegação com controle remoto

### Fase 5: Configurações
- [ ] Ajuste de intervalo de rotação
- [ ] Toggle para mostrar/ocultar títulos
- [ ] Salvar configurações no localStorage
- [ ] Voltar para Lounge

### Fase 6: Navegação com Controle Remoto
- [ ] Hook useRemoteControl
- [ ] Mapeamento de teclas (dev: teclado, prod: controle)
- [ ] Sistema de foco entre elementos
- [ ] Feedback visual de elemento focado
- [ ] Navegação entre telas (voltar)

### Fase 7: Otimizações para TV
- [ ] Fontes grandes e legíveis
- [ ] Alto contraste
- [ ] Espaçamento generoso
- [ ] Animações suaves
- [ ] Gestão de memória (cleanup de players)

### Fase 8: Empacotamento Tizen
- [ ] Criar config.xml
- [ ] Configurar vite.config.ts para Tizen
- [ ] Gerar build otimizado
- [ ] Criar certificado Tizen
- [ ] Empacotar como .wgt
- [ ] Testar no emulador
- [ ] Testar em TV real

---

## 📚 Recursos e Referências

### Documentação Oficial

- **Tizen TV Web App**: https://developer.samsung.com/smarttv/develop/getting-started/setting-up-sdk/installing-tv-sdk.html
- **Tizen Web Device API**: https://developer.tizen.org/development/api-references/web-application
- **HLS.js**: https://github.com/video-dev/hls.js/
- **React**: https://react.dev/
- **Vite**: https://vitejs.dev/

### Exemplos de Código

- **Navegação com Controle Remoto**: https://developer.samsung.com/smarttv/develop/guides/user-interaction/remote-control.html
- **Reprodução de Vídeo**: https://developer.samsung.com/smarttv/develop/guides/multimedia/media-playback.html

---

## 🚀 Começando o Desenvolvimento

### Comando Inicial

```bash
# Criar projeto
npm create vite@latest willcat -- --template react-ts

# Entrar no diretório
cd willcat

# Instalar dependências
npm install

# Instalar dependências adicionais
npm install hls.js zustand react-router-dom

# Instalar TailwindCSS
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# Iniciar desenvolvimento
npm run dev
```

### Configurar .env

```env
VITE_WATCHER_BASE_URL=https://vigilancia.conectae.com.br/watcher/client-api/v3
VITE_WATCHER_TOKEN=KNxNtEM-nCP6J4p3yTpeB1AZ
VITE_PIN=883210
```

---

## 💡 Dicas Importantes

1. **Desenvolvimento Incremental**: Comece com a versão navegador, teste tudo, depois empacote para Tizen
2. **Performance**: TVs têm menos recursos que PCs, otimize memória e CPU
3. **Navegação**: Teste exaustivamente a navegação com controle remoto
4. **Feedback Visual**: Sempre deixe claro qual elemento está focado
5. **Gestão de Memória**: Destrua players HLS quando não estiverem visíveis
6. **Fullscreen**: App deve sempre rodar em fullscreen na TV
7. **Timeout**: Considere timeout de inatividade (voltar para PIN após X minutos)
8. **Logs**: Implemente logs para debug em TV real

---

## ✅ Critérios de Sucesso

O WillCat estará pronto quando:

- ✅ PIN 883210 funciona corretamente
- ✅ Navegação com controle remoto é fluida e intuitiva
- ✅ Mosaicos carregam e reproduzem vídeo corretamente
- ✅ Rotação automática funciona com intervalo configurável
- ✅ Interface é legível e bonita em TV 4K
- ✅ App empacota como .wgt e instala na TV Samsung
- ✅ Performance é aceitável (sem travamentos)
- ✅ Memória é gerenciada corretamente (sem leaks)

---

## 🎬 Conclusão

Este prompt contém todas as informações necessárias para criar o **WillCat** do zero. Siga a estrutura sugerida, implemente as funcionalidades na ordem do checklist, e teste continuamente no navegador antes de empacotar para Tizen.

**Boa sorte com o desenvolvimento! 🚀📺**

---

**Versão**: 1.0.0  
**Data**: Outubro 2025  
**Autor**: Rogério Gigo (rogerio.gigo@conectae.com.br)
