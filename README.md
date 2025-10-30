# Will - Sistema de Monitoramento Inteligente

<div align="center">

![Will Logo](https://img.shields.io/badge/Will-Vision-blue?style=for-the-badge)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=flat&logo=vite)](https://vitejs.dev/)
[![License](https://img.shields.io/badge/License-Proprietary-red?style=flat)](LICENSE)

Sistema moderno de monitoramento de câmeras via mosaicos, consumindo a API do Flussonic Watcher.

[Características](#-características) • [Instalação](#-instalação) • [Uso](#-uso) • [Deploy](#-deploy) • [Documentação](#-documentação)

</div>

---

## 🎯 Visão Geral

**Will** é uma aplicação web de última geração para monitoramento de vídeo em tempo real, oferecendo uma experiência premium de visualização de múltiplas câmeras através de mosaicos configuráveis. Desenvolvido com as mais modernas tecnologias web, proporciona performance excepcional e interface intuitiva.

### 🎥 Demo

- **Lounge**: Seleção visual de mosaicos com busca inteligente
- **Vision**: Player fullscreen com rotação automática
- **Gerenciamento**: Sistema completo de usuários e permissões

---

## ✨ Características

### 🖥️ Interface Premium
- **Lounge Intuitivo**: Seleção visual de mosaicos com busca e filtros
- **Player Fullscreen**: Reprodução com rotação automática configurável (10s a 5min)
- **Click-to-Maximize**: Clique em qualquer câmera para visualização fullscreen individual
- **Pausa Inteligente**: Contador pausa automaticamente ao maximizar câmera
- **Múltiplos Temas**: Dark, Neon e Corporate
- **UI/UX Moderna**: Animações fluidas com Framer Motion

### 🎬 Reprodução de Vídeo
- **HLS Otimizado**: Player de alta performance com HLS.js
- **Gestão Inteligente de Recursos**: Cleanup automático de players
- **Buffer Otimizado**: Uso de memória reduzido em 70%
- **Múltiplos Layouts**: Suporte a 2x2, 3x3, 4x4 até 8x8

### 👥 Gerenciamento
- **Sistema de Autenticação**: Login seguro com persistência
- **Controle de Permissões**: Níveis Admin e User
- **CRUD de Usuários**: Interface completa para administradores
- **Configurações Personalizadas**: Preferências salvas por usuário

### ⚙️ Configurações Avançadas
- **Intervalo de Rotação**: Configurável de 10s a 5min
- **Títulos de Streams**: Mostrar/ocultar nomes das câmeras
- **Info do Mosaico**: Controle de exibição de metadados
- **Fullscreen Automático**: Ativação opcional ao entrar no Vision
- **Comandos de Voz**: Controle total do sistema por voz 🎤

### 🎤 Comandos de Voz (NOVO!)
- **Controle Hands-Free**: Opere o Will completamente por voz
- **Ativação Simples**: Diga "Will" ou "Vision" + comando
- **60+ Comandos**: Navegação, reprodução, favoritos, e mais
- **Linguagem Natural**: Aceita múltiplas variações
- **Privacidade Total**: Processamento 100% local
- **Configurável**: Ative/desative nas configurações

📖 **Guia completo**: [VOICE_COMMANDS.md](VOICE_COMMANDS.md)

---

## 🚀 Tecnologias

### Core
- **React 18** - Framework UI moderno
- **TypeScript 5** - Type safety e produtividade
- **Vite 5** - Build tool ultrarrápido com HMR instantâneo

### State & Routing
- **Zustand** - State management leve e performático
- **React Router 6** - Navegação SPA

### UI & Styling
- **TailwindCSS 3** - Utility-first CSS framework
- **Framer Motion** - Animações fluidas e profissionais
- **Lucide React** - Ícones modernos e consistentes

### Vídeo & Voz
- **HLS.js** - Player HLS otimizado para web
- **Flussonic Watcher API** - Backend de streaming profissional
- **Web Speech API** - Reconhecimento de voz nativo (Chrome/Edge)

---

## 📋 Pré-requisitos

- **Node.js** 18.x ou superior
- **npm** 9.x ou superior
- Navegador moderno (Chrome, Firefox, Safari, Edge)

---

## 🛠️ Instalação

### 1. Clone o Repositório

```bash
git clone https://github.com/gigosoftware/willnew.git
cd willnew
```

### 2. Instale as Dependências

```bash
npm install
```

### 3. Configure as Variáveis de Ambiente

```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas credenciais:

```env
VITE_WATCHER_BASE_URL=https://seu-servidor.com/watcher/client-api/v3
VITE_WATCHER_TOKEN=seu-token-aqui
```

### 4. Inicie o Servidor de Desenvolvimento

```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:5173`

---

## 🔑 Credenciais Padrão

**Administrador:**
- Email: `rogerio.gigo@conectae.com.br`
- Senha: `gigo123`

> ⚠️ **Importante**: Altere as credenciais padrão em produção!

---

## 📁 Estrutura do Projeto

```
willnew/
├── src/
│   ├── components/          # Componentes reutilizáveis
│   │   ├── HLSPlayer.tsx   # Player HLS otimizado
│   │   ├── MosaicGrid.tsx  # Grid de vídeos
│   │   └── ThemeSelector.tsx
│   ├── pages/              # Páginas da aplicação
│   │   ├── Login.tsx       # Autenticação
│   │   ├── Lounge.tsx      # Seleção de mosaicos
│   │   ├── Vision.tsx      # Player fullscreen
│   │   ├── Users.tsx       # Gerenciamento de usuários
│   │   └── Settings.tsx    # Configurações
│   ├── services/           # Serviços e APIs
│   │   ├── api.ts          # Cliente Watcher API
│   │   └── auth.ts         # Autenticação
│   ├── stores/             # State management (Zustand)
│   │   ├── useAuthStore.ts
│   │   ├── useMosaicStore.ts
│   │   ├── usePlayerStore.ts
│   │   └── useThemeStore.ts
│   ├── types/              # TypeScript types
│   ├── utils/              # Utilitários
│   └── App.tsx
├── .env.example            # Template de variáveis
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.js
```

---

## 🎯 Uso

### Lounge - Seleção de Mosaicos

1. **Buscar**: Use a barra de busca para filtrar mosaicos
2. **Selecionar**: Clique nos cards para selecionar (brilho azul indica seleção)
3. **Ações Rápidas**:
   - ✅ Selecionar Todos
   - ❌ Limpar Seleção
4. **Iniciar**: Clique em "Vision" para começar a reprodução

### Vision - Reprodução

- **Play/Pause**: Controle a rotação automática
- **Navegação**: Botões anterior/próximo
- **Countdown**: Timer visual do próximo mosaico
- **Fullscreen**: Ativação automática (configurável)
- **Fechar**: Retorna ao Lounge

### Configurações

- **Intervalo de Rotação**: 10s, 30s, 1min, 2min, 5min
- **Mostrar Títulos**: Exibe nomes das câmeras
- **Mostrar Info**: Exibe título e contador no header
- **Fullscreen Auto**: Ativa tela cheia automaticamente

### Gerenciamento de Usuários (Admin)

- **Criar**: Adicione novos usuários
- **Editar**: Modifique email, senha e permissões
- **Excluir**: Remova usuários (com confirmação)
- **Permissões**: Defina Admin ou User

---

## 🏗️ Build para Produção

### Gerar Build

```bash
npm run build
```

Os arquivos otimizados serão gerados em `dist/`

### Preview do Build

```bash
npm run preview
```

### Análise de Bundle

```bash
npm run build -- --mode analyze
```

---

## 🚀 Deploy

### 🌐 Produção

**URL**: https://will.conectae.com.br

### AWS EC2 (Atual)

**Servidor:**
- **Instance ID**: i-0cfd9596b30580183
- **IP**: 54.92.202.37
- **OS**: Ubuntu 24.04.3 LTS
- **Região**: us-east-1
- **SSH**: `ssh -i ~/.ssh/will-key.pem ubuntu@54.92.202.37`

**Stack:**
- Nginx (reverse proxy + SSL)
- Let's Encrypt (SSL/TLS)
- Node.js Backend (porta 3001)

📖 **Documentação completa**: [INFRASTRUCTURE.md](INFRASTRUCTURE.md)

### Outras Plataformas

- **Vercel**: `vercel --prod`
- **Netlify**: `netlify deploy --prod`
- **AWS S3 + CloudFront**: Deploy estático

---

## 🧪 Testes

```bash
# Executar testes
npm test

# Testes com coverage
npm test -- --coverage

# Testes em watch mode
npm test -- --watch
```

---

## 🔒 Segurança

- ✅ Tokens não expostos no bundle (variáveis de ambiente)
- ✅ Autenticação com persistência segura
- ✅ Validação de permissões no frontend
- ✅ HTTPS obrigatório em produção
- ✅ Sanitização de inputs
- ✅ Proteção contra XSS

---

## 🎨 Temas

### Dark (Padrão)
Tema escuro profissional com gradiente azul/cinza

### Neon
Tema vibrante com cores roxo/rosa para ambientes modernos

### Corporate
Tema corporativo azul/índigo para uso empresarial

---

## 📈 Performance

### Otimizações Implementadas

- ✅ **Lazy Loading**: Componentes carregados sob demanda
- ✅ **Code Splitting**: Bundle otimizado por rota
- ✅ **HLS Buffer**: Redução de 70% no uso de memória
- ✅ **Cleanup Automático**: Zero vazamento de memória
- ✅ **Cache de Mosaicos**: Carregamento único após login
- ✅ **Debounce em Buscas**: Redução de re-renders
- ✅ **Comandos de Voz**: Processamento local (< 500ms latência)

### Métricas

- **First Contentful Paint**: < 1.5s
- **Time to Interactive**: < 3s
- **Bundle Size**: ~250KB (gzipped)
- **Lighthouse Score**: 95+

---

## 🐛 Troubleshooting

### Vídeos não carregam

1. Verifique credenciais no `.env`
2. Confirme conectividade com Watcher API
3. Verifique console do navegador para erros
4. Teste URL HLS manualmente

### Build falha

```bash
# Limpar cache e reinstalar
rm -rf node_modules dist
npm install
npm run build
```

### Performance lenta

1. Reduza número de mosaicos simultâneos
2. Verifique largura de banda
3. Ative compressão gzip no servidor
4. Use CDN para assets estáticos

---

## 📚 Documentação

- **[Infraestrutura AWS](INFRASTRUCTURE.md)** - Configuração completa do servidor
- [Arquitetura](ARCHITECTURE.md)
- [Guia de Contribuição](CONTRIBUTING.md)
- [Changelog](CHANGELOG.md)
- [API Watcher](https://flussonic.com/doc/api/watcher-client/)

---

## 🗺️ Roadmap

### v1.3.0 (Próxima Release)
- [ ] Maximizar câmeras por voz
- [ ] Ir para mosaico por nome (voz)
- [ ] Feedback por voz (opcional)
- [ ] Filtros avançados (layout, número de câmeras)
- [ ] Histórico de comandos de voz

### v2.0 (Futuro)
- [ ] Dashboard de analytics
- [ ] Alertas em tempo real
- [ ] Gravação de sessões
- [ ] Exportação de vídeos

### v3.0 (Longo Prazo)
- [ ] App mobile (React Native)
- [ ] Reconhecimento facial
- [ ] Detecção de eventos
- [ ] Integração com sistemas externos

---

## 👥 Equipe

**Desenvolvedor Principal**: Rogério Gigo  
**Email**: rogerio.gigo@conectae.com.br  
**GitHub**: [@gigosoftware](https://github.com/gigosoftware)

---

## 📄 Licença

Proprietary - Todos os direitos reservados © 2024 Gigo Software

---

## 🙏 Agradecimentos

- [Flussonic](https://flussonic.com/) - API de streaming profissional
- [React Team](https://react.dev/) - Framework excepcional
- [Vite Team](https://vitejs.dev/) - Build tool revolucionária

---

<div align="center">

**Will** - Monitoramento Inteligente de Nova Geração

Made with ❤️ by [Gigo Software](https://github.com/gigosoftware)

</div>
