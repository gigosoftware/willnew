# 🚀 Will - Informações de Deploy

## ✅ Deploy Concluído com Sucesso!

### 📊 Infraestrutura AWS

**Região**: us-east-1 (N. Virginia)

**Instância EC2**:
- ID: `i-0cfd9596b30580183`
- Tipo: t3.micro
- OS: Ubuntu 24.04 LTS
- IP Público: **54.92.202.37**
- Storage: 20GB GP3

**Security Group**:
- ID: `sg-0b2e31df4b6d2a2ac`
- Nome: Will-SG
- Portas: 22 (SSH), 80 (HTTP), 443 (HTTPS)

**Chave SSH**:
- Nome: Will-Key
- Localização: `~/.ssh/will-key.pem`
- Permissões: 400

### 🌐 Acesso

**Temporário (HTTP)**:
- http://54.92.202.37

**Produção (HTTPS)** - Após configurar DNS:
- https://will.conectae.com.br

### 📝 Próximos Passos

#### 1. Configurar DNS

No seu provedor de DNS (onde está hospedado conectae.com.br), adicione:

```
Tipo: A
Nome: will
Valor: 54.92.202.37
TTL: 300 (5 minutos)
```

#### 2. Aguardar Propagação DNS

Teste a propagação:
```bash
nslookup will.conectae.com.br
# ou
dig will.conectae.com.br
```

#### 3. Configurar SSL (Let's Encrypt)

Após DNS propagar, execute:

```bash
ssh -i ~/.ssh/will-key.pem ubuntu@54.92.202.37

# No servidor:
sudo certbot --nginx -d will.conectae.com.br --non-interactive --agree-tos --email rogerio.gigo@conectae.com.br
```

### 🔧 Software Instalado

- **Nginx**: 1.24.0
- **Node.js**: 18.20.8
- **Certbot**: 2.9.0 (Let's Encrypt)
- **Git**: 2.43.0

### 📦 Aplicação

**Localização**: `/var/www/will`
**Usuário**: www-data
**Build**: Produção otimizado
**Tamanho**: ~1.1MB (compactado)

### 🔐 Credenciais

**Usuário Padrão**:
- Email: rogerio.gigo@conectae.com.br
- Senha: gigo123

**API Watcher**:
- Base URL: https://vigilancia.conectae.com.br/watcher/client-api/v3
- Token: KNxNtEM-nCP6J4p3yTpeB1AZ

### 🛠️ Comandos Úteis

**Conectar via SSH**:
```bash
ssh -i ~/.ssh/will-key.pem ubuntu@54.92.202.37
```

**Ver logs do Nginx**:
```bash
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

**Reiniciar Nginx**:
```bash
sudo systemctl restart nginx
```

**Status dos serviços**:
```bash
sudo systemctl status nginx
sudo systemctl status certbot.timer
```

**Atualizar aplicação**:
```bash
# Local
npm run build
tar -czf will-build.tar.gz -C dist .
scp -i ~/.ssh/will-key.pem will-build.tar.gz ubuntu@54.92.202.37:/tmp/

# No servidor
cd /var/www/will
sudo tar -xzf /tmp/will-build.tar.gz
sudo chown -R www-data:www-data /var/www/will
sudo systemctl restart nginx
```

### 📊 Monitoramento

**CloudWatch** (opcional):
- Métricas da EC2 disponíveis no console AWS
- CPU, Rede, Disco

**Logs**:
- Nginx: `/var/log/nginx/`
- Sistema: `journalctl -u nginx`

### 💰 Custos Estimados

**EC2 t3.micro**:
- ~$7.50/mês (750h free tier no primeiro ano)

**EBS 20GB GP3**:
- ~$1.60/mês

**Transferência de dados**:
- 100GB/mês grátis
- $0.09/GB adicional

**Total estimado**: ~$9/mês (após free tier)

### 🔒 Segurança

✅ Firewall configurado (UFW)
✅ SSH apenas com chave
✅ Nginx com headers de segurança
✅ SSL/TLS (após configurar)
✅ Atualizações automáticas habilitadas

### 📞 Suporte

**Desenvolvedor**: Rogério Gigo
**Email**: rogerio.gigo@conectae.com.br
**GitHub**: https://github.com/gigosoftware/willnew

### 🎯 Status

- [x] EC2 criada e configurada
- [x] Security Group configurado
- [x] Nginx instalado
- [x] Node.js instalado
- [x] Certbot instalado
- [x] Build deployado
- [x] Aplicação acessível via HTTP
- [ ] DNS configurado (will.conectae.com.br)
- [ ] SSL configurado (HTTPS)
- [ ] Testes finais

---

**Data do Deploy**: 2025-10-24
**Versão**: 1.0.0
**Commit**: 5fa4371
