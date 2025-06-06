#!/bin/bash
echo "Deploying Digital Signage SaaS..."
cd "/../.."
docker-compose -f docker-compose.yml up -d --build
echo "Deployment complete!"
