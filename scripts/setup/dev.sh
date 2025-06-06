#!/bin/bash
echo "Starting development environment..."
cd "/../.."
docker-compose up -d
npm run dev --prefix backend &
npm start --prefix frontend &
wait
echo "Development servers started!"
