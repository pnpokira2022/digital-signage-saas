# Digital Signage SaaS

A multi-tenant SaaS platform for digital signage management.

## Project Structure
- **backend/**: Node.js Express + TypeScript API
- **frontend/**: React TypeScript dashboard
- **player-web/**: Web-based player for displays
- **shared/**: Shared code and utilities
- **mobile/**: Placeholder for future React Native apps
- **docker/**: Docker configurations
- **docs/**: Documentation
- **scripts/**: Automation scripts
- **tests/**: End-to-end and integration tests
- **deployment/**: Deployment configurations

## Setup
1. Run scripts/setup/setup.bat (Windows) or scripts/setup/setup.sh (Unix) to install dependencies.
2. Configure environment variables in ackend/.env using ackend/.env.example as a template.
3. Start development servers with scripts/setup/dev.bat or scripts/setup/dev.sh.
4. Build for production with scripts/build/build.bat or scripts/build/build.sh.
5. Run tests with scripts/setup/test.bat or scripts/setup/test.sh.
6. Deploy with scripts/deployment/deploy.bat or scripts/deployment/deploy.sh.

## Prerequisites
- Node.js v20.10.0+
- npm v10+
- PostgreSQL 15+
- Redis 7+
- Docker Desktop with WSL2

## Development
- Use VS Code with the provided digital-signage.code-workspace.
- Ensure all VS Code extensions from Prompt 1 are installed.
- Run docker-compose up -d to start PostgreSQL and Redis.
