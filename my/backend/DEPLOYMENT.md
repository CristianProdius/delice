# Deployment Setup for Delice My Strapi

## GitHub Secrets Configuration

You need to configure these secrets in your GitHub repository:
Go to Settings → Secrets and variables → Actions

### Required Secrets:

1. **VPS_HOST**
   ```
   135.148.232.149
   ```

2. **VPS_USER**
   ```
   ubuntu
   ```

3. **VPS_SSH_KEY**
   - Copy your private SSH key that you use to connect to the server
   - The entire content including:
   ```
   -----BEGIN OPENSSH PRIVATE KEY-----
   [your key content]
   -----END OPENSSH PRIVATE KEY-----
   ```

## How It Works

1. **On Push to Main Branch:**
   - GitHub Actions builds a Docker image
   - Pushes it to GitHub Container Registry (ghcr.io)
   - SSHs into your VPS
   - Pulls the new image
   - Restarts the container

2. **Image Tags:**
   - `latest` - always points to main branch
   - `main-<sha>` - specific commit on main
   - `develop` - if you push to develop branch
   - `v1.0.0` - if you create version tags

## Server Setup (Already Completed)

The server has:
- Docker compose file at `/srv/clients/delice/my/cms/docker-compose.yml`
- Container name: `strapi_delice_my`
- Connected to `web` network with PostgreSQL and Caddy
- URL: https://cms.delice.my

## Manual Deployment (if needed)

SSH into server and run:
```bash
cd /srv/clients/delice/my/cms
sudo docker compose pull
sudo docker compose up -d
```

## First Time Setup

Since this is a private repository, you need to:

1. **Enable GitHub Packages:**
   - Go to your GitHub profile → Settings → Developer settings → Personal access tokens
   - Create a classic token with `read:packages` scope
   - On the server, login to GitHub Container Registry:
   ```bash
   echo YOUR_GITHUB_TOKEN | sudo docker login ghcr.io -u cristianprodius --password-stdin
   ```

2. **Make Package Public (Alternative):**
   - Go to your GitHub profile → Packages
   - Find `delice-my-strapi` package
   - Package settings → Change visibility to Public
   - This allows pulling without authentication

## Monitoring

Check deployment status:
```bash
# On server
sudo docker ps | grep strapi_delice_my
sudo docker logs strapi_delice_my
```

## Environment Variables

The `.env` file on the server at `/srv/clients/delice/my/cms/.env` should contain:
- Database credentials (already configured)
- Strapi secrets (APP_KEYS, JWT_SECRET, etc.)
- R2 credentials for uploads
- SMTP settings

## Troubleshooting

If the container is unhealthy:
```bash
# Check logs
sudo docker logs strapi_delice_my

# Restart container
cd /srv/clients/delice/my/cms
sudo docker compose restart

# Check database connection
sudo docker exec main_postgres psql -U strapi_delice_my -d strapi_delice_my -c "SELECT 1;"
```