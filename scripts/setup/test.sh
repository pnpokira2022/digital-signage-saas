#!/bin/bash
echo "Running tests..."
cd "/../.."
npm test --prefix backend
npm test --prefix frontend
npm test --prefix player-web
echo "Tests complete!"
