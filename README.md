# LKSY Community Standards Platform

Community-driven QA standards platform for go-to-market teams.

## Project Structure

```
LKSY/
├── frontend/              # Next.js frontend application
├── api/                   # REST API (Node.js/Express)
├── mcp-server/            # MCP Server (Python)
├── shared/                # Shared types and schemas
├── community-standards/    # GitHub repository structure (data)
├── infrastructure/        # Terraform configurations
├── docker/               # Dockerfiles
└── .github/              # GitHub Actions workflows
```

## Getting Started

### Prerequisites

- Node.js 20+
- Python 3.11+
- PostgreSQL (Cloud SQL)
- Google Cloud SDK
- GitHub Personal Access Token

### Environment Variables

Create `.env` files in each service directory:

**Frontend (.env.local):**
```
NEXT_PUBLIC_API_URL=http://localhost:3001
GITHUB_OWNER=lksy-org
GITHUB_REPO=community-standards
```

**API (.env):**
```
DATABASE_URL=postgresql://user:password@localhost:5432/lksy
GITHUB_TOKEN=your_github_token
GITHUB_OWNER=lksy-org
GITHUB_REPO=community-standards
GITHUB_CLIENT_ID=your_oauth_client_id
GITHUB_CLIENT_SECRET=your_oauth_client_secret
JWT_SECRET=your_jwt_secret
FRONTEND_URL=http://localhost:3002
PORT=3001
```

**MCP Server (.env):**
```
GITHUB_TOKEN=your_github_token
GITHUB_OWNER=lksy-org
GITHUB_REPO=community-standards
```

### Development

1. **Setup Database:**
   ```bash
   cd api
   npm run migrate
   ```

2. **Start API:**
   ```bash
   cd api
   npm install
   npm run dev
   ```

3. **Start Frontend:**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

4. **Start MCP Server:**
   ```bash
   cd mcp-server
   pip install -r requirements.txt
   python src/server.py
   ```

## Deployment

### Google Cloud Setup

1. Run infrastructure setup:
   ```bash
   cd infrastructure
   terraform init
   terraform plan
   terraform apply
   ```

2. Configure Cloud Build triggers (already set up in cloudbuild.yaml)

3. Deploy services:
   - Frontend: Automatically deployed via Cloud Build on push to main
   - API: Automatically deployed via Cloud Build on push to main
   - MCP Server: Automatically deployed via Cloud Build on push to main

### Domain Configuration

```bash
gcloud run domain-mappings create \
  --service lksy-frontend \
  --domain lksy.org \
  --region us-central1
```

## Features

- ✅ Browse and search QA standards lists
- ✅ View list details with versioning
- ✅ Propose new lists and modifications
- ✅ Community voting system
- ✅ REST API for programmatic access
- ✅ MCP Server for AI agent integration
- ✅ GitHub integration for version control
- ✅ SEO optimization

## License

Apache License 2.0

