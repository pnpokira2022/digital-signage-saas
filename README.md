<<<<<<< HEAD
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
=======
# Digital Signage SaaS

## 🚀 Getting Started

Your Digital Signage SaaS development environment is ready! Here's how to start:

1. **Open the project in VS Code**
`ash
code digital-signage.code-workspace
`

2. **Run the backend**
`ash
cd backend
npm run dev
`

3. **Run the frontend**
`ash
cd frontend
npm start
`

4. **Database connections**
- PostgreSQL: localhost:5432, DB: digital_signage, User: admin, Password: admin123
- Redis: localhost:6379

5. **API endpoints**
- Health check: GET http://localhost:3001/api/health

## 📂 Project Structure
`
digital-signage-workspace/
├── frontend/              # React TypeScript frontend
├── backend/              # Node.js Express backend
│   ├── src/
│   │   ├── routes/
│   │   ├── controllers/
│   │   ├── models/
│   │   └── server.ts
├── database/             # Database migrations
│   └── migrations/
├── docker-compose.yml    # Database services
└── digital-signage.code-workspace
`

## 🛠️ Development
- Use VS Code workspace for optimal development experience
- Database schema is already applied
- Tailwind CSS is configured for frontend
- TypeScript is configured for both frontend and backend
- Environment variables are set in backend/.env

## 🔧 Troubleshooting
- Check logs: C:\Users\swid\Documents\saas\digital-signage-workspace\project-init-log-20250602-183047.txt
- Verify Docker containers: docker ps
- Database access: docker exec -it signage-postgres psql -U admin -d digital_signage
- Redis access: docker exec -it signage-redis redis-cli
>>>>>>> 73b8c8a83c26d85f13ed0eef62967cc1813ca932
