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
