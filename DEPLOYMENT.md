# Guia de Deploy - Will

## Deploy na AWS EC2

### Pré-requisitos

- Conta AWS ativa
- EC2 instance (t3.medium ou superior recomendado)
- Domínio configurado (opcional, mas recomendado)
- Certificado SSL (Let's Encrypt)

### 1. Preparação da Instância EC2

#### 1.1 Criar Instância

```bash
# Via AWS Console:
# - AMI: Ubuntu Server 22.04 LTS
# - Instance Type: t3.medium
# - Storage: 20GB SSD
# - Security Group: HTTP (80), HTTPS (443), SSH (22)
```

#### 1.2 Conectar via SSH

```bash
ssh -i your-key.pem ubuntu@your-ec2-ip
```

#### 1.3 Atualizar Sistema

```bash
sudo apt update && sudo apt upgrade -y
```

### 2. Instalação de Dependências

#### 2.1 Node.js

```bash
# Instalar Node.js 18 LTS
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Verificar instalação
node --version
npm --version
```

#### 2.2 Nginx

```bash
sudo apt install nginx -y
sudo systemctl start nginx
sudo systemctl enable nginx
```

#### 2.3 Certbot (SSL)

```bash
sudo apt install certbot python3-certbot-nginx -y
```

### 3. Build da Aplicação

#### 3.1 Local

```bash
# No seu computador
cd willnew

# Configurar variáveis de produção
cat > .env.production << EOF
VITE_WATCHER_BASE_URL=https://vigilancia.conectae.com.br/watcher/client-api/v3
VITE_WATCHER_TOKEN=KNxNtEM-nCP6J4p3yTpeB1AZ
EOF

# Build
npm run build

# Compactar
tar -czf will-dist.tar.gz dist/
```

#### 3.2 Transferir para EC2

```bash
scp -i your-key.pem will-dist.tar.gz ubuntu@your-ec2-ip:/home/ubuntu/
```

### 4. Configuração no Servidor

#### 4.1 Extrair Arquivos

```bash
# No servidor EC2
sudo mkdir -p /var/www/will
sudo tar -xzf /home/ubuntu/will-dist.tar.gz -C /var/www/will --strip-components=1
sudo chown -R www-data:www-data /var/www/will
```

#### 4.2 Configurar Nginx

```bash
sudo nano /etc/nginx/sites-available/will
```

Adicionar configuração:

```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;
    
    root /var/www/will;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript 
               application/x-javascript application/xml+rss 
               application/javascript application/json;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # SPA routing
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Disable cache for index.html
    location = /index.html {
        add_header Cache-Control "no-cache, no-store, must-revalidate";
    }
}
```

#### 4.3 Ativar Site

```bash
sudo ln -s /etc/nginx/sites-available/will /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 5. Configurar SSL

```bash
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# Renovação automática
sudo certbot renew --dry-run
```

### 6. Configurar Firewall

```bash
sudo ufw allow 'Nginx Full'
sudo ufw allow OpenSSH
sudo ufw enable
```

### 7. Monitoramento

#### 7.1 Logs Nginx

```bash
# Access logs
sudo tail -f /var/log/nginx/access.log

# Error logs
sudo tail -f /var/log/nginx/error.log
```

#### 7.2 Status do Serviço

```bash
sudo systemctl status nginx
```

### 8. Atualizações

#### 8.1 Script de Deploy

Criar `/home/ubuntu/deploy-will.sh`:

```bash
#!/bin/bash

echo "🚀 Iniciando deploy do Will..."

# Backup
sudo cp -r /var/www/will /var/www/will-backup-$(date +%Y%m%d-%H%M%S)

# Extrair novo build
sudo tar -xzf /home/ubuntu/will-dist.tar.gz -C /var/www/will --strip-components=1

# Permissões
sudo chown -R www-data:www-data /var/www/will

# Reload nginx
sudo systemctl reload nginx

echo "✅ Deploy concluído!"
```

Tornar executável:

```bash
chmod +x /home/ubuntu/deploy-will.sh
```

#### 8.2 Processo de Atualização

```bash
# Local: build e transfer
npm run build
tar -czf will-dist.tar.gz dist/
scp -i your-key.pem will-dist.tar.gz ubuntu@your-ec2-ip:/home/ubuntu/

# Servidor: deploy
ssh -i your-key.pem ubuntu@your-ec2-ip
./deploy-will.sh
```

## Deploy Alternativo - Docker

### Dockerfile

```dockerfile
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### docker-compose.yml

```yaml
version: '3.8'
services:
  will:
    build: .
    ports:
      - "80:80"
    environment:
      - VITE_WATCHER_BASE_URL=${VITE_WATCHER_BASE_URL}
      - VITE_WATCHER_TOKEN=${VITE_WATCHER_TOKEN}
    restart: unless-stopped
```

### Deploy com Docker

```bash
# Build
docker-compose build

# Run
docker-compose up -d

# Logs
docker-compose logs -f

# Stop
docker-compose down
```

## Deploy na AWS S3 + CloudFront

### 1. Criar Bucket S3

```bash
aws s3 mb s3://will-app
aws s3 website s3://will-app --index-document index.html --error-document index.html
```

### 2. Upload

```bash
npm run build
aws s3 sync dist/ s3://will-app --delete
```

### 3. CloudFront

```bash
# Via AWS Console:
# - Origin: S3 bucket
# - Viewer Protocol Policy: Redirect HTTP to HTTPS
# - Compress Objects: Yes
# - Custom Error Response: 404 -> /index.html (200)
```

### 4. Invalidação de Cache

```bash
aws cloudfront create-invalidation --distribution-id YOUR_DIST_ID --paths "/*"
```

## Monitoramento e Logs

### CloudWatch (AWS)

```bash
# Instalar CloudWatch Agent
wget https://s3.amazonaws.com/amazoncloudwatch-agent/ubuntu/amd64/latest/amazon-cloudwatch-agent.deb
sudo dpkg -i amazon-cloudwatch-agent.deb
```

### PM2 (Process Manager)

```bash
# Instalar PM2
sudo npm install -g pm2

# Servir aplicação
pm2 serve /var/www/will 80 --spa
pm2 startup
pm2 save
```

## Backup e Recuperação

### Backup Automático

```bash
# Cron job diário
0 2 * * * tar -czf /backups/will-$(date +\%Y\%m\%d).tar.gz /var/www/will
```

### Recuperação

```bash
sudo tar -xzf /backups/will-20240101.tar.gz -C /var/www/
sudo systemctl reload nginx
```

## Troubleshooting

### Nginx não inicia

```bash
sudo nginx -t  # Verificar configuração
sudo systemctl status nginx  # Ver erros
```

### 502 Bad Gateway

```bash
# Verificar permissões
ls -la /var/www/will

# Verificar logs
sudo tail -f /var/log/nginx/error.log
```

### SSL não funciona

```bash
# Renovar certificado
sudo certbot renew --force-renewal

# Verificar configuração
sudo certbot certificates
```

## Performance

### Otimizações Nginx

```nginx
# /etc/nginx/nginx.conf
worker_processes auto;
worker_connections 1024;

http {
    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;
    types_hash_max_size 2048;
    
    # Gzip
    gzip on;
    gzip_vary on;
    gzip_comp_level 6;
}
```

### CDN

Considerar CloudFlare ou AWS CloudFront para:
- Cache global
- DDoS protection
- SSL automático
- Compressão Brotli

## Checklist de Deploy

- [ ] Build testado localmente
- [ ] Variáveis de ambiente configuradas
- [ ] Backup do deploy anterior
- [ ] Nginx configurado e testado
- [ ] SSL ativo e válido
- [ ] Firewall configurado
- [ ] Logs acessíveis
- [ ] Monitoramento ativo
- [ ] DNS apontando corretamente
- [ ] Teste de smoke em produção

---

**Suporte:** Para problemas, consulte os logs ou entre em contato com a equipe.
