# Sistema de Favoritos ⭐

## 📋 Visão Geral

Sistema completo de favoritos que permite aos usuários marcar mosaicos frequentes para acesso rápido, com persistência por usuário no backend.

## ✨ Funcionalidades

### 1. **Marcar/Desmarcar Favoritos**
- Botão de estrela em cada card de mosaico
- Clique na estrela para adicionar/remover dos favoritos
- Feedback visual com toast
- Não interfere na seleção do mosaico (evento stopPropagation)

### 2. **Seção de Favoritos**
- Aparece no topo do Lounge quando há favoritos
- Cards com visual diferenciado (gradiente amarelo/laranja)
- Estrela preenchida nos cards favoritos
- Título "Favoritos" com ícone de estrela

### 3. **Reproduzir Favoritos**
- Botão destacado com gradiente amarelo/laranja
- Seleciona automaticamente todos os favoritos
- Inicia Vision após 500ms
- Mostra contador de favoritos

### 4. **Persistência**
- Salvo no backend por usuário (DynamoDB)
- Carregado automaticamente no login
- Sincronizado em tempo real

## 🎨 Interface

### Card Normal (Não Favorito)
```
┌─────────────────────────┐
│  [☆]                    │  ← Estrela vazia (cinza)
│  Título do Mosaico      │
│  Layout: 3x3            │
│  Câmeras: 9             │
└─────────────────────────┘
```

### Card Favorito
```
┌─────────────────────────┐
│  [★]                    │  ← Estrela preenchida (amarela)
│  Título do Mosaico      │
│  Layout: 3x3            │
│  Câmeras: 9             │
└─────────────────────────┘
Background: Gradiente amarelo/laranja
```

### Seção de Favoritos
```
⭐ Favoritos                    [✨ Reproduzir Favoritos (3)]
┌──────┐ ┌──────┐ ┌──────┐
│ [★]  │ │ [★]  │ │ [★]  │
│ Mos1 │ │ Mos2 │ │ Mos3 │
└──────┘ └──────┘ └──────┘

📺 Todos os Mosaicos
┌──────┐ ┌──────┐ ┌──────┐
│ [☆]  │ │ [☆]  │ │ [☆]  │
│ Mos4 │ │ Mos5 │ │ Mos6 │
└──────┘ └──────┘ └──────┘
```

## 🔧 Implementação Técnica

### Backend (server.js)
```javascript
// Configuração padrão inclui favoriteMosaics
config: {
  interval: 30,
  showStreamTitles: true,
  showMosaicInfo: true,
  autoFullscreen: true,
  smartInterval: true,
  autoStart: true,
  selectedMosaics: [],
  favoriteMosaics: []  // ← NOVO
}
```

### API (backend.ts)
```typescript
saveFavoriteMosaics: async (favoriteMosaics: number[]) => {
  const config = await fetchAPI('/config');
  return fetchAPI('/config', {
    method: 'PUT',
    body: JSON.stringify({ ...config, favoriteMosaics }),
  });
}
```

### Store (useMosaicStore.ts)
```typescript
interface MosaicState {
  favoriteMosaics: number[];
  loadFavoriteMosaics: () => Promise<void>;
  toggleFavorite: (id: number) => void;
  selectFavorites: () => void;
}

// Carregar favoritos do backend
loadFavoriteMosaics: async () => {
  const config = await backendAPI.getConfig();
  const savedIds = config.favoriteMosaics || [];
  set({ favoriteMosaics: validIds });
}

// Toggle favorito
toggleFavorite: (id: number) => {
  const newFavorites = favoriteMosaics.includes(id)
    ? favoriteMosaics.filter(m => m !== id)
    : [...favoriteMosaics, id];
  set({ favoriteMosaics: newFavorites });
  backendAPI.saveFavoriteMosaics(newFavorites);
}

// Selecionar todos os favoritos
selectFavorites: () => {
  set({ selectedMosaics: [...favoriteMosaics] });
  backendAPI.saveSelectedMosaics(favoriteMosaics);
}
```

### UI (Lounge.tsx)
```typescript
// Separar mosaicos favoritos dos regulares
const favoriteMosaicsList = mosaics.filter(m => 
  favoriteMosaics.includes(m.id)
);
const regularMosaics = filteredMosaics.filter(m => 
  !favoriteMosaics.includes(m.id)
);

// Botão de favorito no card
<button
  onClick={(e) => {
    e.stopPropagation();  // Não seleciona o mosaico
    toggleFavorite(mosaic.id);
    toast.success('Adicionado aos favoritos!');
  }}
>
  <Star className="w-5 h-5" />
</button>

// Reproduzir favoritos
const handlePlayFavorites = () => {
  selectFavorites();
  toast.success(`${favoriteMosaics.length} favoritos selecionados!`);
  setTimeout(() => navigate('/vision'), 500);
};
```

## 🎯 Fluxo de Uso

### Adicionar Favorito
1. Usuário clica na estrela vazia (☆) no card
2. Estrela fica preenchida (★) e amarela
3. Toast: "Adicionado aos favoritos!"
4. Card move para seção de favoritos
5. Salvo no backend automaticamente

### Remover Favorito
1. Usuário clica na estrela preenchida (★)
2. Estrela fica vazia (☆) e cinza
3. Toast: "Removido dos favoritos"
4. Card volta para seção regular
5. Atualizado no backend

### Reproduzir Favoritos
1. Usuário clica em "Reproduzir Favoritos"
2. Todos os favoritos são selecionados
3. Toast: "X favoritos selecionados!"
4. Aguarda 500ms (animação)
5. Navega para Vision automaticamente

## 📊 Benefícios

### Para Operadores
- ✅ Acesso instantâneo aos mosaicos mais usados
- ✅ Não precisa buscar toda vez
- ✅ Um clique para reproduzir todos os favoritos
- ✅ Visual destacado facilita identificação

### Para Administradores
- ✅ Dados salvos por usuário
- ✅ Persistência em DynamoDB
- ✅ Sincronização automática
- ✅ Sem impacto na performance

## 🎨 Design

### Cores
- **Estrela Vazia**: `text-gray-400` (cinza)
- **Estrela Cheia**: `text-yellow-400 fill-yellow-400` (amarela preenchida)
- **Card Favorito**: Gradiente `from-yellow-500/20 to-orange-500/20`
- **Botão Reproduzir**: Gradiente `from-yellow-600 to-orange-600`
- **Borda Favorito**: `border-yellow-400/50`

### Ícones
- **Star**: Estrela para marcar favoritos
- **Sparkles**: Brilho no botão "Reproduzir Favoritos"

### Animações
- Hover scale 1.02 nos cards
- Transição suave de cores
- Fade in ao carregar
- Delay de 500ms antes de navegar

## 🔄 Sincronização

### Carregamento Inicial
```typescript
useEffect(() => {
  const loadData = async () => {
    await loadUserConfig();
    await fetchMosaics();
    await loadSelectedMosaics();
    await loadFavoriteMosaics();  // ← Carrega favoritos
  };
  loadData();
}, []);
```

### Salvamento Automático
- Toda alteração salva imediatamente no backend
- Usa mesma estrutura de config do usuário
- Validação de IDs (remove favoritos de mosaicos deletados)

## 📱 Responsividade

Grid adaptativo:
- Mobile: 1 coluna
- Tablet: 2 colunas
- Desktop: 3 colunas
- Wide: 4 colunas

## 🚀 Performance

- Filtros em memória (não recarrega API)
- Salvamento assíncrono (não bloqueia UI)
- Validação de IDs ao carregar
- Cache de mosaicos mantido

## 🎉 Resultado Final

Sistema completo e profissional de favoritos que:
- Melhora drasticamente a UX
- Reduz tempo de acesso aos mosaicos frequentes
- Visual moderno e intuitivo
- Totalmente integrado ao backend
- Feedback visual em todas as ações
