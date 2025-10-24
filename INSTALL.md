# 📦 Instalação - Will

## Instalação Completa

### Passo 1: Verificar Pré-requisitos

```bash
# Node.js 18 ou superior
node --version

# npm 9 ou superior
npm --version
```

Se não tiver Node.js instalado:
- **macOS**: `brew install node`
- **Ubuntu**: `sudo apt install nodejs npm`
- **Windows**: https://nodejs.org/

### Passo 2: Instalar Dependências

```bash
cd willnew
npm install
```

Isso instalará:
- React 18.2.0
- TypeScript 5.3.3
- Vite 5.0.8
- TailwindCSS 3.3.6
- Zustand 4.4.7
- HLS.js 1.4.14
- Framer Motion 10.16.16
- React Router 6.20.0
- Lucide React 0.294.0
- E outras dependências...

### Passo 3: Verificar Instalação

```bash
# Verificar se node_modules foi criado
ls -la node_modules

# Verificar package-lock.json
ls -la package-lock.json
```

### Passo 4: Executar

```bash
npm run dev
```

Abra: http://localhost:3000

## Comandos Disponíveis

```bash
# Desenvolvimento
npm run dev              # Inicia servidor dev
npm run dev -- --host    # Expõe na rede

# Build
npm run build            # Build de produção
npm run preview          # Preview do build

# Testes
npm test                 # Executa testes
npm test -- --watch      # Watch mode
npm test -- --coverage   # Com coverage

# Qualidade
npm run lint             # Lint do código
npm run lint -- --fix    # Fix automático
```

## Estrutura Instalada

```
willnew/
├── node_modules/        # Dependências (criado após npm install)
├── src/                 # Código fonte
├── dist/                # Build (criado após npm run build)
├── .env                 # Variáveis de ambiente
└── package.json         # Configuração do projeto
```

## Dependências Principais

### Produção
- **react**: ^18.2.0
- **react-dom**: ^18.2.0
- **react-router-dom**: ^6.20.0
- **zustand**: ^4.4.7
- **hls.js**: ^1.4.14
- **framer-motion**: ^10.16.16
- **lucide-react**: ^0.294.0
- **clsx**: ^2.0.0

### Desenvolvimento
- **typescript**: ^5.3.3
- **vite**: ^5.0.8
- **@vitejs/plugin-react**: ^4.2.1
- **tailwindcss**: ^3.3.6
- **vitest**: ^1.0.4
- **eslint**: ^8.55.0

## Troubleshooting

### Erro: EACCES

```bash
# Corrigir permissões npm
sudo chown -R $USER ~/.npm
```

### Erro: Cannot find module

```bash
# Reinstalar dependências
rm -rf node_modules package-lock.json
npm install
```

### Erro: Port 3000 already in use

```bash
# Matar processo na porta 3000
lsof -ti:3000 | xargs kill -9

# Ou usar outra porta
npm run dev -- --port 3001
```

### Erro: Out of memory

```bash
# Aumentar memória do Node
export NODE_OPTIONS="--max-old-space-size=4096"
npm install
```

## Verificação Pós-Instalação

Execute este checklist:

- [ ] `node_modules/` existe
- [ ] `package-lock.json` existe
- [ ] `npm run dev` inicia sem erros
- [ ] Aplicação abre no navegador
- [ ] Console sem erros críticos
- [ ] Login funciona

## Próximos Passos

Após instalação bem-sucedida:

1. Leia [FIRST_RUN.md](./FIRST_RUN.md)
2. Faça login com credenciais padrão
3. Explore a aplicação
4. Leia [README.md](./README.md) para mais detalhes

## Suporte

Problemas na instalação?

1. Verifique versão do Node (18+)
2. Limpe cache: `npm cache clean --force`
3. Tente novamente: `npm install`
4. Consulte [TROUBLESHOOTING](./README.md#troubleshooting)

---

**Instalação concluída com sucesso!** ✅
