# 🏗️ Infraestrutura AWS - Will VMS

## 📋 Visão Geral

O Will está hospedado na AWS usando uma arquitetura simples e eficiente com EC2, Nginx e SSL via Let's Encrypt.

---

## 🌐 Informações de Produção

### **Domínio**
- **URL**: https://will.conectae.com.br
- **DNS**: 54.92.202.37

### **Servidor EC2**
- **Instance ID**: `i-0cfd9596b30580183`
- **Nome**: Will
- **IP Público**: 54.92.202.37
- **IP Privado**: 172.31.15.121
- **Região**: us-east-1 (N. Virginia)
- **Sistema Operacional**: Ubuntu 24.04.3 LTS
- **Tipo de Instância**: (verificar no console AWS)

---

## 🔑 Acesso SSH

### **Chave SSH**
```bash
~/.ssh/will-key.pem
```

### **Conectar ao Servidor**
```bash
ssh -i ~/.ssh/will-key.pem ubuntu@54.92.202.37
```

---

## 📁 Estrutura de Diretórios

```
/var/www/
├── html/                          # Aplicação React (produção)
│   ├── index.html
│   └── assets/
│       ├── index-*.js
│       ├── index-*.css
│       └── *.map
├── will-backups/                  # Backups automáticos
│   └── backup-YYYYMMDD-HHMMSS.tar.gz
└── (will/)                        # Diretório antigo (não usado)
```

---

## ⚙️ Configuração do Nginx

### **Arquivo de Configuração**
```bash
/etc/nginx/sites-available/will
```

### **Configuração Atual**
```nginx
server {
    listen 80;
    server_name will.conectae.com.br;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl;
    server_name will.conectae.com.br;
    root /var/www/html;
    index index.html;

    ssl_certificate /etc/letsencrypt/live/will.conectae.com.br/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/will.conectae.com.br/privkey.pem;

    # API Backend
    location /api/ {
        proxy_pass http://localhost:3001/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

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

### **Comandos Úteis**
```bash
# Testar configuração
sudo nginx -t

# Recarregar configuração
sudo systemctl reload nginx

# Reiniciar Nginx
sudo systemctl restart nginx

# Ver status
sudo systemctl status nginx

# Ver logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

---

## 🔒 Certificado SSL

### **Let's Encrypt**
- **Certificado**: `/etc/letsencrypt/live/will.conectae.com.br/fullchain.pem`
- **Chave Privada**: `/etc/letsencrypt/live/will.conectae.com.br/privkey.pem`
- **Emitido em**: 24 de outubro de 2025
- **Expira em**: 22 de janeiro de 2026

### **Renovação Automática**
```bash
# Verificar status de renovação
sudo certbot renew --dry-run

# Renovar manualmente (se necessário)
sudo certbot renew

# Renovação automática via cron (já configurado)
sudo systemctl status certbot.timer
```

---

## 🚀 Processo de Deploy

### **1. Build Local**
```bash
cd /Users/gigo/Desktop/developers/willnew
npm run build
```

### **2. Criar Tarball**
```bash
tar -czf will-deploy-$(date +%Y%m%d-%H%M%S).tar.gz -C dist .
```

### **3. Enviar para Servidor**
```bash
scp -i ~/.ssh/will-key.pem will-deploy-*.tar.gz ubuntu@54.92.202.37:/tmp/
```

### **4. Deploy no Servidor**
```bash
ssh -i ~/.ssh/will-key.pem ubuntu@54.92.202.37 << 'EOF'
# Backup
sudo tar -czf /var/www/will-backups/backup-$(date +%Y%m%d-%H%M%S).tar.gz -C /var/www/html . 2>/dev/null

# Limpar
sudo rm -rf /var/www/html/*

# Extrair
sudo tar -xzf /tmp/will-deploy-*.tar.gz -C /var/www/html/

# Remover metadata Mac
sudo find /var/www/html -name "._*" -delete

# Permissões
sudo chown -R www-data:www-data /var/www/html
sudo chmod -R 755 /var/www/html

# Reiniciar Nginx
sudo systemctl restart nginx

echo "✅ Deploy concluído!"
EOF
```

### **Script Automatizado de Deploy**
Criar arquivo `deploy.sh`:
```bash
#!/bin/bash
set -e

echo "🚀 Iniciando deploy do Will..."

# Build
echo "📦 Building..."
npm run build

# Criar tarball
TIMESTAMP=$(date +%Y%m%d-%H%M%S)
TARBALL="will-deploy-${TIMESTAMP}.tar.gz"
tar -czf $TARBALL -C dist .

# Enviar
echo "📤 Uploading..."
scp -i ~/.ssh/will-key.pem $TARBALL ubuntu@54.92.202.37:/tmp/

# Deploy
echo "🔧 Deploying..."
ssh -i ~/.ssh/will-key.pem ubuntu@54.92.202.37 << EOF
sudo tar -czf /var/www/will-backups/backup-${TIMESTAMP}.tar.gz -C /var/www/html . 2>/dev/null
sudo rm -rf /var/www/html/*
sudo tar -xzf /tmp/${TARBALL} -C /var/www/html/
sudo find /var/www/html -name "._*" -delete
sudo chown -R www-data:www-data /var/www/html
sudo chmod -R 755 /var/www/html
sudo systemctl restart nginx
EOF

# Limpar
rm $TARBALL

echo "✅ Deploy concluído com sucesso!"
echo "🌐 https://will.conectae.com.br"
```

---

## 🗄️ Backend API

### **Servidor Node.js**
- **Porta**: 3001
- **Localização**: (verificar no servidor)
- **Processo**: (verificar PM2 ou systemd)

### **Verificar Status**
```bash
# Se usando PM2
pm2 list
pm2 logs will-backend

# Se usando systemd
sudo systemctl status will-backend
```

---

## 📊 Monitoramento

### **Recursos do Sistema**
```bash
# CPU e Memória
htop

# Espaço em disco
df -h

# Uso de /var/www
du -sh /var/www/*

# Processos Nginx
ps aux | grep nginx

# Conexões ativas
netstat -tulpn | grep :443
```

### **Logs**
```bash
# Nginx Access
sudo tail -f /var/log/nginx/access.log

# Nginx Error
sudo tail -f /var/log/nginx/error.log

# System logs
sudo journalctl -u nginx -f
```

---

## 🔐 Security Groups (AWS)

### **Portas Abertas**
- **22** (SSH): Acesso administrativo
- **80** (HTTP): Redirecionamento para HTTPS
- **443** (HTTPS): Aplicação web
- **3001** (API): Backend (apenas localhost)

### **Verificar Security Group**
```bash
aws ec2 describe-instances \
  --instance-ids i-0cfd9596b30580183 \
  --query 'Reservations[*].Instances[*].SecurityGroups'
```

---

## 💾 Backups

### **Localização**
```
/var/www/will-backups/
```

### **Criar Backup Manual**
```bash
sudo tar -czf /var/www/will-backups/backup-manual-$(date +%Y%m%d-%H%M%S).tar.gz -C /var/www/html .
```

### **Restaurar Backup**
```bash
# Listar backups
ls -lh /var/www/will-backups/

# Restaurar
sudo tar -xzf /var/www/will-backups/backup-YYYYMMDD-HHMMSS.tar.gz -C /var/www/html/
sudo chown -R www-data:www-data /var/www/html
sudo systemctl restart nginx
```

### **Limpeza de Backups Antigos**
```bash
# Manter apenas últimos 10 backups
cd /var/www/will-backups
ls -t | tail -n +11 | xargs -r sudo rm
```

---

## 🔧 Troubleshooting

### **Site não carrega**
```bash
# Verificar Nginx
sudo systemctl status nginx
sudo nginx -t

# Verificar logs
sudo tail -50 /var/log/nginx/error.log

# Verificar arquivos
ls -la /var/www/html/
```

### **Erro 404 em assets**
```bash
# Verificar root path no Nginx
sudo cat /etc/nginx/sites-available/will | grep root

# Deve ser: root /var/www/html;
```

### **SSL não funciona**
```bash
# Verificar certificado
sudo certbot certificates

# Renovar se necessário
sudo certbot renew --force-renewal
```

### **Cache não limpa**
```bash
# Limpar cache Nginx
sudo rm -rf /var/cache/nginx/*
sudo systemctl restart nginx

# Forçar no navegador: Ctrl+Shift+R
```

---

## 📝 Manutenção

### **Atualização do Sistema**
```bash
sudo apt update
sudo apt upgrade -y
sudo apt autoremove -y
```

### **Atualização do Nginx**
```bash
sudo apt update
sudo apt install --only-upgrade nginx
sudo systemctl restart nginx
```

### **Verificar Espaço em Disco**
```bash
df -h
du -sh /var/www/*
du -sh /var/log/nginx/*
```

### **Limpar Logs Antigos**
```bash
sudo find /var/log/nginx -name "*.gz" -mtime +30 -delete
```

---

## 🌟 Outras Instâncias EC2

### **Romeu-Server**
- **Instance ID**: i-0320dc4a807fd2279
- **IP Público**: 54.89.125.53
- **IP Privado**: 172.31.27.1

### **Soulful-Roots-Server-v2**
- **Instance ID**: i-0619b6cf5aaedb4d1
- **IP Público**: 54.173.50.224
- **IP Privado**: 172.31.7.97

---

## 📞 Contatos e Suporte

### **AWS**
- **Região**: us-east-1
- **Account**: (verificar no console)

### **Domínio**
- **Registrar**: conectae.com.br
- **DNS**: (verificar configuração)

### **SSL**
- **Provider**: Let's Encrypt
- **Renovação**: Automática via certbot

---

## 📚 Recursos Úteis

- [Nginx Documentation](https://nginx.org/en/docs/)
- [Let's Encrypt](https://letsencrypt.org/)
- [AWS EC2 Documentation](https://docs.aws.amazon.com/ec2/)
- [Ubuntu Server Guide](https://ubuntu.com/server/docs)

---

**Última Atualização**: 24 de outubro de 2025
**Versão**: 1.0.0
