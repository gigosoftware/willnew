# Guia de Contribuição - Will

## Começando

1. Fork o repositório
2. Clone seu fork: `git clone <your-fork-url>`
3. Instale dependências: `npm install`
4. Crie uma branch: `git checkout -b feature/sua-feature`

## Padrões de Código

### TypeScript

- Use tipos explícitos sempre que possível
- Evite `any`, prefira `unknown` quando necessário
- Interfaces para objetos, types para unions/intersections

```typescript
// ✅ Bom
interface User {
  id: string;
  email: string;
}

// ❌ Evitar
const user: any = { id: 1, email: 'test' };
```

### React

- Componentes funcionais com hooks
- Props tipadas com interfaces
- Use `React.FC` apenas quando necessário

```typescript
// ✅ Bom
interface ButtonProps {
  label: string;
  onClick: () => void;
}

export const Button = ({ label, onClick }: ButtonProps) => {
  return <button onClick={onClick}>{label}</button>;
};
```

### Naming Conventions

- Componentes: PascalCase (`UserCard.tsx`)
- Hooks: camelCase com prefixo `use` (`useAuth.ts`)
- Stores: camelCase com prefixo `use` (`useAuthStore.ts`)
- Utilitários: camelCase (`formatDate.ts`)
- Constantes: UPPER_SNAKE_CASE (`API_BASE_URL`)

### Estrutura de Arquivos

```
src/
├── components/       # Componentes reutilizáveis
├── pages/           # Páginas/rotas
├── services/        # APIs e serviços externos
├── stores/          # State management
├── types/           # TypeScript types
├── utils/           # Funções utilitárias
└── hooks/           # Custom hooks
```

## Commits

Siga o padrão Conventional Commits:

```
feat: adiciona seletor de temas
fix: corrige bug no player HLS
docs: atualiza README
style: formata código
refactor: reorganiza stores
test: adiciona testes para auth
chore: atualiza dependências
```

## Pull Requests

1. Atualize sua branch com main: `git pull origin main`
2. Execute testes: `npm test`
3. Execute lint: `npm run lint`
4. Faça build: `npm run build`
5. Crie PR com descrição clara

### Template de PR

```markdown
## Descrição
Breve descrição das mudanças

## Tipo de mudança
- [ ] Bug fix
- [ ] Nova feature
- [ ] Breaking change
- [ ] Documentação

## Checklist
- [ ] Código segue os padrões do projeto
- [ ] Testes adicionados/atualizados
- [ ] Documentação atualizada
- [ ] Build passa sem erros
```

## Testes

### Executar Testes

```bash
npm test                 # Todos os testes
npm test -- --watch     # Watch mode
npm test -- --coverage  # Com coverage
```

### Escrever Testes

```typescript
import { describe, it, expect } from 'vitest';

describe('Component', () => {
  it('should render correctly', () => {
    // Arrange
    const props = { title: 'Test' };
    
    // Act
    const result = render(<Component {...props} />);
    
    // Assert
    expect(result).toBeDefined();
  });
});
```

## Debugging

### VS Code

Adicione em `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "chrome",
      "request": "launch",
      "name": "Launch Chrome",
      "url": "http://localhost:3000",
      "webRoot": "${workspaceFolder}/src"
    }
  ]
}
```

### React DevTools

Instale a extensão React DevTools no navegador.

## Performance

### Checklist

- [ ] Componentes pesados com `React.memo`
- [ ] Callbacks com `useCallback`
- [ ] Valores computados com `useMemo`
- [ ] Lazy loading de rotas
- [ ] Imagens otimizadas

### Exemplo

```typescript
// ✅ Otimizado
const MemoizedComponent = React.memo(({ data }) => {
  const processed = useMemo(() => processData(data), [data]);
  const handleClick = useCallback(() => {}, []);
  
  return <div onClick={handleClick}>{processed}</div>;
});
```

## Acessibilidade

### Checklist

- [ ] Labels em inputs
- [ ] Alt text em imagens
- [ ] Navegação por teclado
- [ ] Contraste adequado
- [ ] ARIA attributes quando necessário

### Exemplo

```tsx
// ✅ Acessível
<button
  aria-label="Fechar modal"
  onClick={onClose}
>
  <X aria-hidden="true" />
</button>
```

## Segurança

### Checklist

- [ ] Nunca commitar tokens/secrets
- [ ] Sanitizar inputs do usuário
- [ ] Validar dados do backend
- [ ] HTTPS em produção
- [ ] Headers de segurança configurados

## Documentação

### JSDoc

```typescript
/**
 * Formata uma data para o padrão brasileiro
 * @param date - Data a ser formatada
 * @returns String formatada (DD/MM/YYYY)
 */
export const formatDate = (date: Date): string => {
  return date.toLocaleDateString('pt-BR');
};
```

### README de Componentes

Para componentes complexos, adicione README:

```markdown
# ComponentName

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| title | string | Yes | Component title |

## Usage

\`\`\`tsx
<ComponentName title="Example" />
\`\`\`
```

## Revisão de Código

### Como Revisor

- Seja construtivo e respeitoso
- Teste as mudanças localmente
- Verifique testes e documentação
- Aprove apenas se estiver confiante

### Como Autor

- Responda todos os comentários
- Faça mudanças solicitadas
- Agradeça feedback construtivo
- Não leve críticas para o pessoal

## Dúvidas

Para dúvidas, abra uma issue ou entre em contato com a equipe.

---

Obrigado por contribuir com o Will! 🚀
