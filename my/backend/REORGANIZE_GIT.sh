#!/bin/bash

echo "This script will help reorganize your git repository structure"
echo "Current location: delice/my/backend"
echo "Target: Move git to delice/ folder (monorepo root)"
echo ""
echo "Steps to execute:"
echo "1. Remove .git from delice/my/backend"
echo "2. Initialize git at delice/ level"
echo "3. Create proper .github/workflows structure"
echo ""
read -p "Continue? (y/n) " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    # Go to current directory
    cd /Users/cristianprodius/Development/clients/delice/my/backend

    # Remove git and .github from backend
    rm -rf .git
    rm -rf .github

    # Go to delice folder
    cd /Users/cristianprodius/Development/clients/delice

    # Initialize git at root level
    git init

    # Create new remote (you'll need to create "delice" repo on GitHub)
    git remote add origin https://github.com/cristianprodius/delice.git

    # Create .github/workflows directory at root
    mkdir -p .github/workflows

    # Create gitignore
    cat > .gitignore << 'EOF'
# Dependencies
node_modules/
.pnp/
.pnp.js

# Testing
coverage/
.nyc_output

# Production builds
build/
dist/
.next/
out/

# Strapi
.tmp/
.cache/
.strapi-updater.json
exported_*
*.sql
*.sqlite

# Environment files
.env
.env.*
!.env.example
!.env.*.example

# Logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
lerna-debug.log*

# OS files
.DS_Store
Thumbs.db

# Editor directories
.vscode/
.idea/
*.swp
*.swo

# Public uploads (local development)
public/uploads/
!public/uploads/.gitkeep

# Build directories
.strapi/
EOF

    echo ""
    echo "✅ Git repository reorganized!"
    echo ""
    echo "Next steps:"
    echo "1. Create a new repository 'delice' on GitHub"
    echo "2. Move the workflows to .github/workflows/"
    echo "3. Add all files: git add ."
    echo "4. Commit: git commit -m 'Initial monorepo structure'"
    echo "5. Push: git push -u origin main"
fi