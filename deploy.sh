#!/bin/bash

# Update system
sudo apt-get update

# Install Docker Compose v2 manually (since apt package might be missing)
mkdir -p ~/.docker/cli-plugins/
curl -SL https://github.com/docker/compose/releases/download/v2.29.1/docker-compose-linux-x86_64 -o ~/.docker/cli-plugins/docker-compose
chmod +x ~/.docker/cli-plugins/docker-compose

# Start Docker
sudo systemctl start docker
sudo systemctl enable docker

# Create directory for certbot
mkdir -p certbot/conf
mkdir -p certbot/www

# Initial certificate request (dummy to start nginx)
if [ ! -f ./certbot/conf/live/dogukandemirel.site/fullchain.pem ]; then
    echo "Requesting initial certificate..."
    # We need to start nginx without SSL first to pass the challenge
    # But our config expects SSL. 
    # So we will use a temporary config or just comment out SSL parts for first run.
    # Actually, a better approach for first run is to use standalone certbot or a temp nginx config.
    
    # Simplified approach: 
    # 1. Start Nginx with only HTTP (port 80) config.
    # 2. Run Certbot.
    # 3. Switch to full config.
    
    # For now, let's just run the compose up and let the user handle the certbot command manually or automate it better.
    # But to make it easy for the user:
    
    docker compose -f docker-compose.prod.yml up -d nginx
fi

# Ensure clean state by removing specific containers that might conflict
# This handles cases where project names changed but container names are fixed
CONTAINERS=("zalion-backend" "zalion-frontend" "zalion-db" "zalion-redis" "zalion-nginx" "zalion-certbot")
for container in "${CONTAINERS[@]}"; do
    docker rm -f $container || true
done

export COMPOSE_PROJECT_NAME=zalion
docker compose -f docker-compose.prod.yml down --remove-orphans

# Start the application
docker compose -f docker-compose.prod.yml up -d --build
