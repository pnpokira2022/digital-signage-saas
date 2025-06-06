@echo off
echo Starting development environment...
docker-compose up -d
start /b npm run dev --prefix backend
start /b npm start --prefix frontend
echo Development servers started!
