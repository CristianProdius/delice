#!/bin/bash

# Script to sync .env file to VPS
# Usage: ./sync-env.sh [environment]

ENV_FILE=${1:-.env}
SERVER_HOST="135.148.232.149"
SERVER_USER="ubuntu"
PROJECT_PATH="/srv/clients/delice/my/cms"

echo "Syncing environment file to VPS..."

# Check if env file exists
if [ ! -f "$ENV_FILE" ]; then
    echo "Error: $ENV_FILE not found!"
    exit 1
fi

# Copy env file to server
echo "Copying $ENV_FILE to server..."
scp "$ENV_FILE" "$SERVER_USER@$SERVER_HOST:/tmp/.env.tmp"

# Move to correct location with proper permissions
ssh "$SERVER_USER@$SERVER_HOST" << EOF
    sudo mv /tmp/.env.tmp $PROJECT_PATH/.env
    sudo chown strapi:strapi $PROJECT_PATH/.env
    sudo chmod 600 $PROJECT_PATH/.env
    echo "Environment file updated at $PROJECT_PATH/.env"

    # Restart container to apply new env
    cd $PROJECT_PATH
    sudo docker compose restart
    echo "Container restarted with new environment"
EOF

echo "✅ Environment synced successfully!"