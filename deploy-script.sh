#!/bin/bash
set -e

echo "🚀 Configurando servidor Will..."

# Atualizar sistema
sudo apt update && sudo apt upgrade -y

# Instalar Nginx
sudo apt install nginx -y

# Instalar Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install nodejs -y

# Instalar Certbot
sudo apt install certbot python3-certbot-nginx -y

# Criar diretório da aplicação
sudo mkdir -p /var/www/will
sudo chown -R ubuntu:ubuntu /var/www/will

echo "✅ Servidor configurado com sucesso!"
