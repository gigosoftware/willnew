# Guia de Deploy - AWS EC2

Este documento descreve o processo completo de deploy do Will na AWS EC2.

## 📋 Pré-requisitos

### AWS
- Conta AWS ativa
- AWS CLI configurado
- Par de chaves SSH (.pem)
- Security Group configurado (portas 80, 443, 22)

### Local
- Node.js 18+
- Git configurado
- Acesso SSH à instância EC2

---

## 🚀 Processo de Deploy

### 1. Preparação Local

```bash
# Build da aplicação
npm run build

# Verificar build
ls -lh dist/

# Criar arquivo compactado
tar -czf will-build.tar.gz dist/
```

### 2. Configuração da Instância EC2

#### Conectar via SSH

```bash
ssh -i "sua-chave.pem" ubuntu@ec2-xx-xx-xx-xx.compute.amazonaws.com
```

#### Instalar Dependências

```bash
# Atualizar sistema
sudo apt update && sudo apt upgrade -y

# Instalar Nginx
sudo apt install nginx -y

# Instalar Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install nodejs -y

# Verificar instalação
node --version
nginx -v
```

### 3. Configurar Nginx

```bash
# Criar configuração
sudo nano /etc/nginx/sites-available/will
```

Adicionar configuração:

```nginx
server {
    listen 80;
    server_name seu-dominio.com;
    root /var/www/will;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript 
               application/x-javascript application/xml+rss 
               application/json application/javascript;

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # SPA routing
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
}
```

Ativar site:

```bash
sudo ln -s /etc/nginx/sites-available/will /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 4. Deploy da Aplicação

```bash
# Criar diretório
sudo mkdir -p /var/www/will

# Copiar build (do local)
scp -i "sua-chave.pem" will-build.tar.gz ubuntu@ec2-xx-xx-xx-xx:/tmp/

# Na EC2, extrair
cd /var/www/will
sudo tar -xzf /tmp/will-build.tar.gz --strip-components=1
sudo chown -R www-data:www-data /var/www/will
```

### 5. Configurar SSL (Let's Encrypt)

```bash
# Instalar Certbot
sudo apt install certbot python3-certbot-nginx -y

# Obter certificado
sudo certbot --nginx -d seu-dominio.com

# Renovação automática já está configurada
sudo certbot renew --dry-run
```

### 6. Configurar Variáveis de Ambiente

As variáveis são compiladas no build. Para alterar:

```bash
# Local: editar .env
VITE_WATCHER_BASE_URL=https://seu-servidor.com
VITE_WATCHER_TOKEN=seu-token

# Rebuild e redeploy
npm run build
```

---

## 🔧 Manutenção

### Atualizar Aplicação

```bash
# Local
git pull
npm install
npm run build
tar -czf will-build.tar.gz dist/

# Deploy
scp -i "sua-chave.pem" will-build.tar.gz ubuntu@ec2-xx-xx-xx-xx:/tmp/
ssh -i "sua-chave.pem" ubuntu@ec2-xx-xx-xx-xx
cd /var/www/will
sudo tar -xzf /tmp/will-build.tar.gz --strip-components=1
```

### Logs

```bash
# Nginx access log
sudo tail -f /var/log/nginx/access.log

# Nginx error log
sudo tail -f /var/log/nginx/error.log

# System log
sudo journalctl -u nginx -f
```

### Backup

```bash
# Backup do site
sudo tar -czf will-backup-$(date +%Y%m%d).tar.gz /var/www/will

# Backup da configuração
sudo cp /etc/nginx/sites-available/will ~/will-nginx-backup.conf
```

---

## 🔒 Segurança

### Firewall (UFW)

```bash
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
sudo ufw status
```

### Fail2Ban

```bash
sudo apt install fail2ban -y
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
```

---

## 📊 Monitoramento

### Status dos Serviços

```bash
sudo systemctl status nginx
sudo systemctl status certbot.timer
```

### Uso de Recursos

```bash
# CPU e Memória
htop

# Disco
df -h

# Rede
sudo iftop
```

---

## 🐛 Troubleshooting

### Nginx não inicia

```bash
sudo nginx -t
sudo journalctl -xe
```

### Site não carrega

```bash
# Verificar permissões
ls -la /var/www/will

# Verificar configuração
sudo nginx -t

# Reiniciar
sudo systemctl restart nginx
```

### SSL não funciona

```bash
# Renovar certificado
sudo certbot renew --force-renewal

# Verificar configuração
sudo certbot certificates
```

---

## 📝 Checklist de Deploy

- [ ] Build local gerado sem erros
- [ ] Variáveis de ambiente configuradas
- [ ] EC2 instância criada e acessível
- [ ] Nginx instalado e configurado
- [ ] Site copiado para /var/www/will
- [ ] Permissões corretas (www-data)
- [ ] SSL configurado (Let's Encrypt)
- [ ] Firewall configurado (UFW)
- [ ] DNS apontando para EC2
- [ ] Site acessível via HTTPS
- [ ] Testes de funcionalidade completos

---

## 🔗 Recursos

- [AWS EC2 Documentation](https://docs.aws.amazon.com/ec2/)
- [Nginx Documentation](https://nginx.org/en/docs/)
- [Let's Encrypt](https://letsencrypt.org/)
- [Certbot](https://certbot.eff.org/)

---

**Nota**: Este guia será atualizado com informações específicas após o deploy inicial.
