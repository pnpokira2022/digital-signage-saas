@echo off
echo Deploying Digital Signage SaaS...
cd %~dp0../../
docker-compose -f docker-compose.yml up -d --build
echo Deployment complete!
