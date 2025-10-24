# Quick Start - Will

## Instalação Rápida (5 minutos)

### 1. Pré-requisitos

```bash
# Verificar Node.js (necessário 18+)
node --version

# Se não tiver, instalar:
# macOS: brew install node
# Ubuntu: sudo apt install nodejs npm
# Windows: https://nodejs.org/
```

### 2. Clonar e Instalar

```bash
# Clone o repositório
git clone <repo-url>
cd willnew

# Instale dependências
npm install
```

### 3. Configurar

```bash
# Copie o arquivo de ambiente
cp .env.example .env

# O arquivo já vem com as credenciais corretas:
# VITE_WATCHER_BASE_URL=https://vigilancia.conectae.com.br/watcher/client-api/v3
# VITE_WATCHER_TOKEN=KNxNtEM-nCP6J4p3yTpeB1AZ
```

### 4. Executar

```bash
# Inicie o servidor de desenvolvimento
npm run dev

# Abra no navegador
# http://localhost:3000
```

### 5. Login

Use as credenciais padrão:
- **Email:** `rogerio.gigo@conectae.com.br`
- **Senha:** `gigo123`

## Pronto! 🎉

Você já pode:
- ✅ Navegar pelos mosaicos disponíveis
- ✅ Selecionar e reproduzir câmeras
- ✅ Alternar entre temas
- ✅ Gerenciar usuários (como admin)

## Próximos Passos

### Explorar a Interface

1. **Lounge**: Página inicial com todos os mosaicos
2. **Player**: Clique em "Reproduzir" após selecionar mosaicos
3. **Usuários**: Acesse via botão no header (apenas admin)
4. **Temas**: Use o seletor no header

### Desenvolvimento

```bash
# Executar testes
npm test

# Lint
npm run lint

# Build para produção
npm run build
```

### Documentação

- [README.md](./README.md) - Documentação completa
- [ARCHITECTURE.md](./ARCHITECTURE.md) - Arquitetura do projeto
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Guia de deploy
- [CONTRIBUTING.md](./CONTRIBUTING.md) - Como contribuir

## Troubleshooting

### Porta 3000 já em uso

```bash
# Matar processo na porta 3000
# macOS/Linux:
lsof -ti:3000 | xargs kill -9

# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Erro ao instalar dependências

```bash
# Limpar cache e reinstalar
rm -rf node_modules package-lock.json
npm install
```

### Vídeos não carregam

1. Verifique se o `.env` está configurado
2. Teste a conectividade com a API:
   ```bash
   curl -H "Authorization: Bearer KNxNtEM-nCP6J4p3yTpeB1AZ" \
     https://vigilancia.conectae.com.br/watcher/client-api/v3/mosaics
   ```

### Build falha

```bash
# Verificar versão do Node
node --version  # Deve ser 18+

# Limpar e rebuildar
npm run build -- --force
```

## Comandos Úteis

```bash
# Desenvolvimento
npm run dev              # Inicia dev server
npm run dev -- --host    # Expõe na rede local

# Testes
npm test                 # Executa testes
npm test -- --watch      # Watch mode
npm test -- --coverage   # Com coverage

# Build
npm run build            # Build de produção
npm run preview          # Preview do build

# Qualidade
npm run lint             # Lint do código
npm run lint -- --fix    # Fix automático
```

## Estrutura Básica

```
willnew/
├── src/
│   ├── pages/          # Login, Lounge, Player, Users
│   ├── components/     # HLSPlayer, MosaicGrid, etc
│   ├── stores/         # Zustand stores
│   ├── services/       # API e Auth
│   └── types/          # TypeScript types
├── .env                # Variáveis de ambiente
└── package.json        # Dependências
```

## Recursos

- **API Docs**: [Flussonic Watcher](https://flussonic.com/doc/api/watcher-client/)
- **React**: [reactjs.org](https://reactjs.org/)
- **TypeScript**: [typescriptlang.org](https://www.typescriptlang.org/)
- **Vite**: [vitejs.dev](https://vitejs.dev/)
- **TailwindCSS**: [tailwindcss.com](https://tailwindcss.com/)

## Suporte

Encontrou um problema? 
1. Verifique a [documentação](./README.md)
2. Procure em [issues existentes](../../issues)
3. Abra uma [nova issue](../../issues/new)

---

**Bem-vindo ao Will!** 🚀
