# ⚠️ IMPORTANTE: LocalStorage e Usuários

## 🔴 Limitação Atual

**O Will v1.0 usa localStorage para armazenar dados**, o que significa:

### ❌ **O que NÃO funciona:**
- Usuários criados em um computador **NÃO aparecem** em outros computadores
- Cada navegador tem seus próprios dados isolados
- Dados são perdidos se limpar cache/cookies do navegador
- Não há sincronização entre dispositivos

### ✅ **O que funciona:**
- Usuários persistem no **mesmo navegador** após recarregar
- Configurações salvas por usuário no **mesmo dispositivo**
- Temas e preferências mantidos localmente

---

## 🎯 Cenário Atual

**Exemplo do problema:**
1. Admin cria usuário `helio.lima@conectae.com.br` no computador A
2. Helio tenta fazer login no computador B
3. ❌ **Usuário não existe** no computador B (localStorage diferente)

---

## 🔧 Solução Temporária

### Para cada novo usuário:

1. **Abra o navegador** onde o usuário vai acessar
2. **Faça login como admin** naquele navegador
3. **Crie o usuário** diretamente naquele navegador
4. **Faça logout** e o usuário poderá fazer login

### Ou use o usuário padrão:

**Email**: `rogerio.gigo@conectae.com.br`  
**Senha**: `gigo123`

Este usuário está **hardcoded** no código e funciona em qualquer navegador.

---

## 🚀 Solução Definitiva (v2.0)

Para resolver isso permanentemente, precisamos implementar:

### Backend Real:
- ✅ Banco de dados (PostgreSQL/MySQL)
- ✅ API REST para CRUD de usuários
- ✅ JWT tokens para autenticação
- ✅ Sincronização entre dispositivos
- ✅ Backup e recuperação de dados

### Estimativa:
- **Tempo**: 2-3 dias de desenvolvimento
- **Custo adicional**: ~$10-15/mês (RDS + Lambda/EC2)

---

## 📝 Workaround Atual

### Opção 1: Usuário Único
Todos usam: `rogerio.gigo@conectae.com.br` / `gigo123`

### Opção 2: Criar em Cada Navegador
Admin cria usuários em cada máquina que precisar

### Opção 3: Exportar/Importar (Manual)
```javascript
// No navegador do admin (Console F12):
// Exportar usuários
console.log(localStorage.getItem('will_users'));

// No navegador do usuário (Console F12):
// Importar usuários
localStorage.setItem('will_users', 'COLE_AQUI_O_JSON_EXPORTADO');
```

---

## 🎯 Recomendação

**Para produção séria**, recomendo implementar backend real (v2.0).

**Para testes/uso interno**, o localStorage funciona bem se:
- Poucos usuários
- Todos acessam do mesmo computador/navegador
- Ou todos usam o usuário padrão

---

## 📞 Próximos Passos

Quer que eu implemente o backend real com banco de dados?

**Benefícios:**
- ✅ Usuários funcionam em qualquer dispositivo
- ✅ Dados seguros e persistentes
- ✅ Backup automático
- ✅ Escalável para muitos usuários
- ✅ Logs de acesso
- ✅ Recuperação de senha

**Custo:**
- Desenvolvimento: Incluído
- Infraestrutura: +$10-15/mês (RDS micro)

---

**Desenvolvedor**: Rogério Gigo  
**Email**: rogerio.gigo@conectae.com.br
