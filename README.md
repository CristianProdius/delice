# Delice Projects Monorepo

This monorepo contains all Delice projects with their backends (Strapi CMS) and frontends (Next.js).

## Project Structure

```
delice/
├── my/
│   ├── backend/       → cms.delice.my (Strapi)
│   └── frontend/      → delice.my (Next.js on Vercel)
├── school/
│   ├── backend/       → cms.delice.school (Strapi)
│   └── frontend/      → delice.school (Next.js on Vercel)
└── market/
    ├── backend/       → cms.delice.market (Strapi)
    └── frontend/      → delice.market (Next.js on Vercel)
```

## Deployments

### Backend (Strapi CMS)
- **Hosting**: VPS (135.148.232.149)
- **Container Registry**: GitHub Container Registry (ghcr.io)
- **Database**: PostgreSQL (shared instance)
- **File Storage**: Cloudflare R2

Each backend automatically deploys when changes are pushed to `main` branch in its directory.

### Frontend (Next.js)
- **Hosting**: Vercel
- **Domains**: Managed via Vercel

## GitHub Actions

Each project has its own workflow that only triggers when files in that project change:
- `deploy-my-backend.yml` - Deploys my/backend
- `deploy-school-backend.yml` - Deploys school/backend
- `deploy-market-backend.yml` - Deploys market/backend

## Setup Instructions

### 1. GitHub Repository Setup
```bash
# Create new repository on GitHub called "delice"
git remote add origin https://github.com/cristianprodius/delice.git
git add .
git commit -m "Initial monorepo setup"
git push -u origin main
```

### 2. GitHub Secrets
Add these secrets in GitHub (Settings → Secrets → Actions):
- `VPS_HOST`: 135.148.232.149
- `VPS_USER`: ubuntu
- `VPS_SSH_KEY`: Your private SSH key

### 3. GitHub Container Registry
Since this is a private repo, authenticate on the VPS:
```bash
echo YOUR_GITHUB_TOKEN | sudo docker login ghcr.io -u cristianprodius --password-stdin
```

### 4. Server Setup
Each project needs to be initialized on the server:
```bash
# On the VPS
sudo /srv/scripts/init-project.sh delice my
sudo /srv/scripts/init-project.sh delice school
sudo /srv/scripts/init-project.sh delice market

# Create databases
sudo /srv/scripts/create-database.sh delice my
sudo /srv/scripts/create-database.sh delice school
sudo /srv/scripts/create-database.sh delice market
```

## Docker Images
- `ghcr.io/cristianprodius/delice-my-strapi:latest`
- `ghcr.io/cristianprodius/delice-school-strapi:latest`
- `ghcr.io/cristianprodius/delice-market-strapi:latest`

## Development

### Local Development
```bash
# My project
cd my/backend
npm run dev

# School project
cd school/backend
npm run dev
```

### Environment Variables
Each backend needs its own `.env` file. See `.env.example` in each backend directory.

## Monitoring

Check deployment status:
```bash
# SSH to server
ssh ubuntu@135.148.232.149

# Check containers
sudo docker ps | grep strapi

# Check specific project logs
sudo docker logs strapi_delice_my
sudo docker logs strapi_delice_school
sudo docker logs strapi_delice_market
```