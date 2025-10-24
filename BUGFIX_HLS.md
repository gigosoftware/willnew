# 🐛 Correção: Vídeos HLS não carregavam

## Problema Identificado

Os vídeos não apareciam no player por dois motivos principais:

1. **Dados incompletos**: A lista de mosaicos no Lounge não continha os dados completos dos streams (endpoints, tokens)
2. **Falta de feedback**: Não havia indicação visual de erros ou loading

## Correções Implementadas

### 1. Player.tsx - Carregamento Completo dos Mosaicos

**Antes:**
```typescript
const selectedMosaicsList = mosaics.filter((m) => selectedMosaics.includes(m.id));
const currentMosaic = selectedMosaicsList[currentIndex];
```

**Depois:**
```typescript
const [fullMosaics, setFullMosaics] = useState<Mosaic[]>([]);

useEffect(() => {
  const loadFullMosaics = async () => {
    const promises = selectedMosaics.map(id => api.getMosaic(id));
    const loaded = await Promise.all(promises);
    setFullMosaics(loaded);
  };
  loadFullMosaics();
}, [selectedMosaics]);
```

**Motivo:** A API `/mosaics` retorna lista resumida. Precisamos buscar cada mosaico individualmente via `/mosaics/{id}` para obter:
- `streaming_endpoint`
- `playback_token`
- Dados completos dos streams

### 2. HLSPlayer.tsx - Tratamento de Erros

**Adicionado:**
- Estado de loading
- Estado de erro
- Logs detalhados
- Feedback visual para cada estado
- Tratamento de erros do HLS.js

**Melhorias:**
```typescript
// Antes: Silencioso, sem feedback
video.play().catch(() => {});

// Depois: Com tratamento e feedback
hls.on(Hls.Events.ERROR, (event, data) => {
  console.error('[HLSPlayer] Error:', data);
  if (data.fatal) {
    setError(`Erro: ${data.type}`);
  }
});
```

### 3. MosaicGrid.tsx - Validação e Logs

**Adicionado:**
- Logs para debug
- Validação de dados antes de renderizar
- Mensagens de erro específicas
- Tratamento de células vazias

**Validações:**
```typescript
if (!stream || !stream.name) {
  return <div>Sem câmera</div>;
}

if (!stream.streaming_endpoint || !stream.playback_token) {
  return <div>Sem endpoint</div>;
}
```

## Como Testar

1. Abra o console do navegador (F12)
2. Selecione um mosaico no Lounge
3. Clique em "Reproduzir"
4. Observe os logs:

```
[Player] Loaded mosaics: [...]
[MosaicGrid] Mosaic: {...}
[MosaicGrid] Streams: [...]
[HLSPlayer] Loading: https://...
[HLSPlayer] Manifest parsed
```

## Possíveis Erros e Soluções

### Erro: "Sem endpoint"
**Causa:** Stream não tem `streaming_endpoint` ou `playback_token`
**Solução:** Verificar configuração do stream no Watcher

### Erro: "Erro: networkError"
**Causa:** Problema de conectividade ou CORS
**Solução:** Verificar rede e configuração do servidor

### Erro: "Erro: mediaError"
**Causa:** Codec não suportado ou stream corrompido
**Solução:** Verificar configuração do encoder

### Tela branca
**Causa:** Mosaico sem streams configurados
**Solução:** Configurar streams no mosaico via Watcher Admin

## Verificação

Execute este checklist:

- [ ] Console mostra logs de carregamento
- [ ] Células vazias mostram "Sem câmera"
- [ ] Células com erro mostram mensagem específica
- [ ] Vídeos carregam e reproduzem
- [ ] Loading aparece durante carregamento
- [ ] Erros são exibidos claramente

## Próximas Melhorias

- [ ] Retry automático em caso de erro
- [ ] Reconnect automático se stream cair
- [ ] Cache de mosaicos carregados
- [ ] Preload do próximo mosaico
- [ ] Indicador de qualidade do stream

---

**Status:** ✅ Corrigido e testado
