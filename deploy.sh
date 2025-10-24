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
echo "📤 Uploading to server..."
scp -i ~/.ssh/will-key.pem $TARBALL ubuntu@54.92.202.37:/tmp/

# Deploy
echo "🔧 Deploying on server..."
ssh -i ~/.ssh/will-key.pem ubuntu@54.92.202.37 << EOF
# Backup
sudo tar -czf /var/www/will-backups/backup-${TIMESTAMP}.tar.gz -C /var/www/html . 2>/dev/null

# Limpar
sudo rm -rf /var/www/html/*

# Extrair
sudo tar -xzf /tmp/${TARBALL} -C /var/www/html/

# Remover metadata Mac
sudo find /var/www/html -name "._*" -delete

# Permissões
sudo chown -R www-data:www-data /var/www/html
sudo chmod -R 755 /var/www/html

# Reiniciar Nginx
sudo systemctl restart nginx

echo "✅ Deploy concluído no servidor!"
EOF

# Limpar arquivo local
rm $TARBALL

echo ""
echo "✅ Deploy concluído com sucesso!"
echo "🌐 https://will.conectae.com.br"
echo ""
