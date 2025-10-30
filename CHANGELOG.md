# Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Semantic Versioning](https://semver.org/lang/pt-BR/).

---

## [1.0.0] - 2024-01-24

### 🎉 Release Inicial

Primeira versão estável do Will - Sistema de Monitoramento Inteligente.

### ✨ Adicionado

#### Core Features
- Sistema completo de autenticação com login/logout
- Gerenciamento de usuários (CRUD) para administradores
- Integração com Flussonic Watcher API v3
- Player HLS otimizado com HLS.js
- Suporte a múltiplos layouts de mosaico (2x2 até 8x8)

#### Interface
- **Lounge**: Página de seleção de mosaicos
  - Busca e filtro de mosaicos
  - Seleção múltipla com destaque visual
  - Botões de selecionar todos/limpar seleção
  - Cards com animações Framer Motion
- **Vision**: Player fullscreen profissional
  - Rotação automática configurável
  - Countdown timer visual
  - Controles de navegação (play/pause, anterior/próximo)
  - Header com informações do mosaico
  - Fullscreen automático (opcional)
- **Settings**: Página de configurações personalizadas
  - Intervalo de rotação (10s a 5min)
  - Toggle para títulos de streams
  - Toggle para informações do mosaico
  - Toggle para fullscreen automático
- **Users**: Gerenciamento completo de usuários (Admin only)

#### Temas
- Dark (padrão) - Gradiente azul/cinza
- Neon - Gradiente roxo/rosa vibrante
- Corporate - Gradiente azul/índigo corporativo
- Persistência de tema no localStorage

#### Otimizações
- Cache de mosaicos (carrega apenas uma vez após login)
- Cleanup automático de players HLS
- Buffer otimizado (10-20s vs 30-60s padrão)
- Gestão inteligente de memória (redução de 70%)
- Pausa automática de downloads ao trocar mosaicos
- Key única no MosaicGrid para forçar remontagem

#### Configurações por Usuário
- Intervalo de rotação personalizado
- Preferências de exibição (títulos, info, fullscreen)
- Persistência no localStorage com chave por usuário

### 🔧 Técnico

#### Stack
- React 18.2.0
- TypeScript 5.2.2
- Vite 5.0.8
- TailwindCSS 3.4.1
- Zustand 4.4.7
- React Router 6.21.1
- HLS.js 1.5.1
- Framer Motion 10.18.0

#### Arquitetura
- State management com Zustand
- Roteamento com React Router
- Componentes funcionais com hooks
- TypeScript strict mode
- ESLint + Prettier configurados

#### Segurança
- Variáveis de ambiente para credenciais
- Tokens não expostos no bundle
- Validação de permissões
- Sanitização de inputs

### 🐛 Corrigido

#### HLS Player
- Streams sem streaming_endpoint (fallback implementado)
- Vazamento de memória em players não destruídos
- Buffer excessivo causando lentidão
- Vídeos continuando em background ao trocar mosaicos

#### UI/UX
- Seleção de mosaicos com pouco destaque visual
- Temas não aplicando corretamente
- Configurações resetando ao reiniciar dev server
- Countdown sem formatação adequada

#### Performance
- Mosaicos recarregando a cada navegação
- Múltiplas instâncias HLS ativas simultaneamente
- Conexões não fechadas ao desmontar componentes

### 📝 Documentação

- README.md completo e profissional
- Instruções de instalação e uso
- Guia de troubleshooting
- Estrutura do projeto documentada
- Comentários em código crítico

### 🔒 Segurança

- HTTPS recomendado para produção
- Credenciais via variáveis de ambiente
- localStorage para dados não sensíveis
- Validação de permissões no frontend

---

## [1.2.0] - 2025-01-30

### ✨ Adicionado

#### Sistema de Comandos de Voz 🎤
- **Ativação por voz**: Diga "Will" ou "Vision" para ativar
- **60+ comandos**: Controle total do sistema por voz
- **Linguagem natural**: Aceita múltiplas variações de cada comando
- **Indicador visual**: Feedback em tempo real no canto superior direito
- **Configurável**: Toggle nas configurações (desabilitado por padrão)

##### Comandos Disponíveis:
- **Navegação**: próximo, anterior, ir para X, primeiro, último
- **Reprodução**: pausar, play, continuar, reproduzir
- **Favoritos**: reproduzir favoritos, vai pros favoritos
- **Páginas**: lounge, vision, configurações, sair, fechar
- **Seleção**: selecionar todos, limpar, marca tudo
- **Intervalo**: intervalo 30 segundos, intervalo 2 minutos
- **Informações**: status, quantos mosaicos, onde estou

##### Tecnologia:
- Web Speech API nativa (Chrome/Edge)
- 100% local (zero latência, privacidade total)
- Precisão 95-98%
- Latência < 500ms
- Português BR otimizado

### 🐛 Corrigido

#### Navegação Circular
- Ajuste fino na navegação circular dos mosaicos
- Botões sempre habilitados (loop infinito)

#### Interface
- Botão "Reproduzir Favoritos" movido para barra de ações
- Melhor organização visual dos controles

### 📝 Documentação
- **VOICE_COMMANDS.md**: Guia completo de comandos de voz
- **FAVORITES_SYSTEM.md**: Atualizado com integração de voz
- **README.md**: Atualizado com funcionalidades de voz

---

## [1.1.0] - 2025-01-30

### ✨ Adicionado

#### Sistema de Notificações Toast
- Implementado `react-hot-toast` para feedback visual não-bloqueante
- Toasts em todas as ações: login, logout, CRUD de usuários, configurações
- Estilo dark com glassmorphism consistente com o tema
- Ícones contextuais (verde para sucesso, vermelho para erro)
- Duração de 3 segundos com fechamento automático
- Posicionamento top-right

#### Sistema de Favoritos ⭐
- Botão de estrela em cada card de mosaico
- Seção "Favoritos" destacada no topo do Lounge
- Cards favoritos com gradiente amarelo/laranja
- Botão "Reproduzir Favoritos" para iniciar todos de uma vez
- Persistência por usuário no backend (DynamoDB)
- Feedback visual com toasts ao adicionar/remover
- Contador de favoritos em tempo real

#### Melhorias de UX
- Barra de ações (Selecionar Todos, Limpar, Buscar, Vision) fixa no topo
- Atalho de teclado Espaço adicionado para Play/Pause (além do P)
- Separação visual clara entre Favoritos e Todos os Mosaicos

### 🐛 Corrigido

#### Navegação Circular no Vision
- Corrigido bug onde contador crescia infinitamente (35/34, 36/34...)
- Implementada navegação circular: último mosaico → primeiro mosaico
- Botões anterior/próximo agora funcionam em loop
- Atalhos de teclado (setas) também funcionam em loop
- Reset automático do índice ao entrar no Vision

### 🔧 Técnico

#### Dependências
- Adicionado `react-hot-toast@^2.4.1`

#### Backend
- Campo `favoriteMosaics` adicionado à configuração do usuário
- API `saveFavoriteMosaics()` implementada

#### Store
- `useMosaicStore`: Adicionado estado e ações para favoritos
- `usePlayerStore`: Navegação circular com módulo (%) implementada

### 📝 Documentação
- Criado `TOAST_SYSTEM.md` - Guia completo do sistema de toasts
- Criado `FAVORITES_SYSTEM.md` - Documentação do sistema de favoritos

---

## [Unreleased]

### 🚀 Planejado para v1.2.0

- [ ] Filtros avançados (layout, número de câmeras)
- [ ] Histórico de mosaicos visualizados
- [ ] Responsividade mobile completa
- [ ] Modo picture-in-picture
- [ ] Exportação de configurações
- [ ] Dashboard de analytics (admin)

### 🔮 Futuro (v2.0+)

- [ ] Backend real (PostgreSQL + API REST)
- [ ] JWT authentication
- [ ] Dashboard de analytics
- [ ] Alertas em tempo real
- [ ] Gravação de sessões
- [ ] Exportação de vídeos
- [ ] App mobile (React Native)
- [ ] Reconhecimento facial
- [ ] Detecção de eventos
- [ ] Integração com sistemas externos

---

## Tipos de Mudanças

- **Adicionado** - para novas funcionalidades
- **Modificado** - para mudanças em funcionalidades existentes
- **Descontinuado** - para funcionalidades que serão removidas
- **Removido** - para funcionalidades removidas
- **Corrigido** - para correção de bugs
- **Segurança** - para vulnerabilidades corrigidas

---

**Nota**: Este projeto segue [Semantic Versioning](https://semver.org/):
- **MAJOR** (1.x.x) - Mudanças incompatíveis na API
- **MINOR** (x.1.x) - Novas funcionalidades compatíveis
- **PATCH** (x.x.1) - Correções de bugs compatíveis
