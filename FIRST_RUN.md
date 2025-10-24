# 🚀 Primeira Execução - Will

## Bem-vindo ao Will!

Este guia vai te ajudar a executar o Will pela primeira vez em **menos de 5 minutos**.

## Passo 1: Instalar Dependências

```bash
npm install
```

⏱️ **Tempo estimado:** 2-3 minutos

Você verá algo como:
```
added 234 packages in 2m
```

## Passo 2: Verificar Configuração

O arquivo `.env` já está configurado com as credenciais corretas:

```bash
cat .env
```

Deve mostrar:
```
VITE_WATCHER_BASE_URL=https://vigilancia.conectae.com.br/watcher/client-api/v3
VITE_WATCHER_TOKEN=KNxNtEM-nCP6J4p3yTpeB1AZ
```

✅ **Tudo certo!** Não precisa alterar nada.

## Passo 3: Iniciar Aplicação

```bash
npm run dev
```

Você verá:
```
  VITE v5.0.8  ready in 234 ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
```

## Passo 4: Abrir no Navegador

Abra seu navegador em: **http://localhost:3000**

Você verá a tela de login do Will! 🎉

## Passo 5: Fazer Login

Use as credenciais do administrador padrão:

```
Email: rogerio.gigo@conectae.com.br
Senha: gigo123
```

Clique em **"Entrar"**

## Passo 6: Explorar o Lounge

Após o login, você verá:

- 📋 **Lista de mosaicos** disponíveis
- 🔍 **Barra de busca** para filtrar
- 🎨 **Seletor de temas** no header
- 👥 **Botão "Usuários"** (você é admin!)

### Experimente:

1. **Buscar um mosaico**: Digite na barra de busca
2. **Selecionar mosaicos**: Clique nos cards (ficam azuis)
3. **Trocar tema**: Use o dropdown no header
4. **Ver usuários**: Clique no botão "Usuários"

## Passo 7: Reproduzir Mosaicos

1. Selecione **um ou mais mosaicos** (clique nos cards)
2. Clique no botão **"Reproduzir (X)"** no canto superior direito
3. Você será levado ao **Player fullscreen**!

### No Player:

- ▶️ **Play/Pause**: Controla rotação automática
- ⏭️ **Próximo/Anterior**: Navega entre mosaicos
- ⚙️ **Intervalo**: Ajusta tempo de rotação (10s a 5min)
- ❌ **Fechar**: Volta para o Lounge

## Passo 8: Gerenciar Usuários (Admin)

1. No Lounge, clique em **"Usuários"**
2. Você verá a lista de usuários
3. Clique em **"Novo"** para criar um usuário

### Criar Usuário:

```
Email: teste@example.com
Senha: teste123
☐ Administrador (deixe desmarcado para user comum)
```

Clique em **"Salvar"**

### Testar Permissões:

1. Faça **logout** (botão no header)
2. Faça **login** com o novo usuário
3. Note que o botão **"Usuários" não aparece** (não é admin!)

## 🎉 Parabéns!

Você completou o tour básico do Will!

## Próximos Passos

### Explorar Recursos

- ✅ Teste diferentes **temas** (Dark, Neon, Corporate, Light)
- ✅ Experimente **intervalos** diferentes no player
- ✅ Crie mais **usuários** com diferentes permissões
- ✅ Selecione **múltiplos mosaicos** para rotação

### Desenvolvimento

```bash
# Executar testes
npm test

# Verificar código
npm run lint

# Build para produção
npm run build
```

### Documentação

- 📖 [README.md](./README.md) - Documentação completa
- 🏗️ [ARCHITECTURE.md](./ARCHITECTURE.md) - Arquitetura
- 🚀 [DEPLOYMENT.md](./DEPLOYMENT.md) - Deploy
- 🤝 [CONTRIBUTING.md](./CONTRIBUTING.md) - Contribuir

## Troubleshooting

### Porta 3000 ocupada?

```bash
# Matar processo
lsof -ti:3000 | xargs kill -9

# Ou usar outra porta
npm run dev -- --port 3001
```

### Erro ao instalar?

```bash
# Limpar e reinstalar
rm -rf node_modules package-lock.json
npm install
```

### Vídeos não carregam?

1. Verifique o console do navegador (F12)
2. Teste a API:
   ```bash
   curl -H "Authorization: Bearer KNxNtEM-nCP6J4p3yTpeB1AZ" \
     https://vigilancia.conectae.com.br/watcher/client-api/v3/mosaics
   ```

### Tela branca?

1. Abra o console (F12)
2. Verifique erros
3. Tente limpar cache: Ctrl+Shift+R

## Dicas Úteis

### Atalhos de Teclado

- **Esc**: Sair do player fullscreen
- **Espaço**: Play/Pause (quando no player)
- **←/→**: Navegar entre mosaicos

### Performance

- Use **Chrome ou Edge** para melhor performance
- Evite selecionar **muitos mosaicos** simultaneamente (máx 5-6)
- Em redes lentas, aumente o **intervalo de rotação**

### Desenvolvimento

```bash
# Watch mode para testes
npm test -- --watch

# Build e preview
npm run build && npm run preview

# Lint com fix automático
npm run lint -- --fix
```

## Recursos Adicionais

### API Watcher

- 📚 [Documentação oficial](https://flussonic.com/doc/api/watcher-client/)
- 📄 [OpenAPI spec](./openapi.json)

### Stack

- ⚛️ [React](https://reactjs.org/)
- 📘 [TypeScript](https://www.typescriptlang.org/)
- ⚡ [Vite](https://vitejs.dev/)
- 🎨 [TailwindCSS](https://tailwindcss.com/)
- 🐻 [Zustand](https://github.com/pmndrs/zustand)

## Suporte

Problemas? Dúvidas?

1. Verifique a [documentação](./README.md)
2. Procure em [issues](../../issues)
3. Abra uma [nova issue](../../issues/new)

---

**Aproveite o Will!** 🎥✨

Desenvolvido com ❤️ e muito ☕
