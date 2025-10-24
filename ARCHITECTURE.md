# Arquitetura do Will

## Visão Geral

Will é uma aplicação SPA (Single Page Application) construída com React, TypeScript e Vite, seguindo princípios de arquitetura limpa e componentização.

## Decisões Arquiteturais

### 1. State Management - Zustand

**Por que Zustand?**
- Simplicidade: API minimalista sem boilerplate
- Performance: Re-renders otimizados automaticamente
- TypeScript: Suporte nativo e type-safe
- Tamanho: ~1KB (vs Redux ~20KB)
- Sem Context API: Evita problemas de performance

**Stores:**
- `useAuthStore`: Gerencia autenticação e usuário atual
- `useMosaicStore`: Lista de mosaicos e seleção
- `usePlayerStore`: Estado do player (play/pause, índice, intervalo)
- `useThemeStore`: Tema atual da aplicação

### 2. Roteamento - React Router

**Rotas:**
- `/login`: Autenticação
- `/`: Lounge (seleção de mosaicos)
- `/player`: Player fullscreen
- `/users`: Gerenciamento de usuários (admin only)

**ProtectedRoute**: HOC que valida autenticação antes de renderizar

### 3. Player HLS - HLS.js

**Por que HLS.js?**
- Suporte cross-browser (incluindo navegadores sem suporte nativo HLS)
- Low latency mode
- Adaptive bitrate streaming
- Recuperação automática de erros
- API rica para controle

**Implementação:**
```typescript
// Detecção de suporte
if (Hls.isSupported()) {
  // Usar HLS.js
} else if (video.canPlayType('application/vnd.apple.mpegurl')) {
  // Usar player nativo (Safari)
}
```

### 4. Styling - TailwindCSS

**Vantagens:**
- Desenvolvimento rápido
- Design consistente
- Tree-shaking automático
- Responsividade built-in
- Dark mode nativo

**Customização:**
```javascript
// tailwind.config.js
theme: {
  extend: {
    colors: { primary: {...} },
    animation: { 'fade-in': '...' }
  }
}
```

### 5. Animações - Framer Motion

**Uso:**
- Transições de página
- Animações de entrada de cards
- Feedback visual de interações

**Exemplo:**
```tsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
/>
```

## Fluxo de Dados

### Autenticação

```
Login Form → useAuthStore.login() → authService.login()
  → localStorage → Update store → Navigate to /
```

### Carregamento de Mosaicos

```
Lounge Mount → useMosaicStore.fetchMosaics() → api.getMosaics()
  → Watcher API → Update store → Render cards
```

### Reprodução

```
Select Mosaics → Navigate to /player → usePlayerStore
  → Auto-rotation timer → MosaicGrid → HLSPlayer
  → HLS.js → Video element
```

## Componentes Principais

### HLSPlayer
Componente de baixo nível que encapsula HLS.js:
- Gerencia lifecycle do player
- Cleanup automático
- Fallback para player nativo

### MosaicGrid
Renderiza grid dinâmico baseado no layout:
- Calcula dimensões (2x2, 3x3, etc.)
- Posiciona streams corretamente
- Exibe placeholders para células vazias

### ThemeSelector
Dropdown para troca de temas:
- Persiste escolha no localStorage
- Aplica classes CSS dinamicamente

## Padrões de Código

### Hooks Customizados

```typescript
// Exemplo: useInterval para rotação
const useInterval = (callback: () => void, delay: number | null) => {
  useEffect(() => {
    if (delay === null) return;
    const id = setInterval(callback, delay);
    return () => clearInterval(id);
  }, [callback, delay]);
};
```

### Composição de Componentes

```tsx
// Componente composto
<Player>
  <PlayerHeader />
  <MosaicGrid>
    <HLSPlayer />
  </MosaicGrid>
  <PlayerControls />
</Player>
```

### Type Safety

```typescript
// Tipos explícitos em todas as interfaces
interface MosaicStream {
  name?: string;
  title?: string;
  playback_token?: string;
  streaming_endpoint?: string;
  alive?: boolean;
}
```

## Performance

### Otimizações Implementadas

1. **Lazy Loading**: Componentes carregados sob demanda
2. **Memoization**: React.memo em componentes pesados
3. **Code Splitting**: Vite faz automaticamente
4. **Tree Shaking**: Imports específicos
5. **HLS Worker**: Processamento em background

### Métricas Alvo

- First Contentful Paint: < 1.5s
- Time to Interactive: < 3s
- Lighthouse Score: > 90

## Segurança

### Proteção de Tokens

```typescript
// Tokens nunca no código
const TOKEN = import.meta.env.VITE_WATCHER_TOKEN;

// Não exposto no bundle
// Configurado via variáveis de ambiente
```

### Validação de Permissões

```typescript
// Frontend
if (!user?.isAdmin) {
  navigate('/');
}

// Backend (futuro): validação server-side
```

## Escalabilidade

### Preparação para Crescimento

1. **Múltiplos Watchers**: Estrutura pronta para array de endpoints
2. **Cache**: Implementar React Query para cache inteligente
3. **WebSockets**: Preparado para eventos em tempo real
4. **Microservices**: API service isolado, fácil de extrair

### Exemplo de Evolução

```typescript
// Atual
const BASE_URL = import.meta.env.VITE_WATCHER_BASE_URL;

// Futuro
const watchers = [
  { id: 1, url: '...', region: 'BR' },
  { id: 2, url: '...', region: 'US' },
];
```

## Testes

### Estratégia

1. **Unit**: Stores, utils, services
2. **Integration**: Fluxos completos
3. **E2E**: Cypress para user flows

### Exemplo

```typescript
// useAuthStore.test.ts
describe('useAuthStore', () => {
  it('should login successfully', async () => {
    const { login } = useAuthStore.getState();
    const result = await login('test@test.com', 'password');
    expect(result).toBe(true);
  });
});
```

## Observabilidade

### Logs

```typescript
// Estruturado
console.log('[Player]', 'Mosaic changed', { id, title });

// Produção: integrar com Sentry, LogRocket
```

### Métricas

```typescript
// Performance API
performance.mark('mosaic-load-start');
// ... load mosaic
performance.mark('mosaic-load-end');
performance.measure('mosaic-load', 'mosaic-load-start', 'mosaic-load-end');
```

## Deploy

### Build Process

```bash
npm run build
  → TypeScript compilation
  → Vite bundling
  → Asset optimization
  → dist/ output
```

### Artifacts

```
dist/
├── index.html          # Entry point
├── assets/
│   ├── index-[hash].js # Main bundle
│   ├── index-[hash].css
│   └── vendor-[hash].js # Dependencies
└── vite.svg
```

### Environment Variables

```bash
# Development
VITE_WATCHER_BASE_URL=http://localhost:8080

# Production
VITE_WATCHER_BASE_URL=https://vigilancia.conectae.com.br/watcher/client-api/v3
```

## Manutenção

### Atualizações de Dependências

```bash
# Check outdated
npm outdated

# Update
npm update

# Major versions
npx npm-check-updates -u
```

### Code Quality

```bash
# Lint
npm run lint

# Format
npx prettier --write src/

# Type check
npx tsc --noEmit
```

## Conclusão

A arquitetura do Will foi projetada para:
- **Performance**: Carregamento rápido e reprodução fluida
- **Manutenibilidade**: Código limpo e bem organizado
- **Escalabilidade**: Preparado para crescimento
- **Developer Experience**: Ferramentas modernas e produtivas

---

Última atualização: 2024
