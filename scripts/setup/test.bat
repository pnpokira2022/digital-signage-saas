@echo off
echo Running tests...
cd %~dp0../../
npm test --prefix backend
npm test --prefix frontend
npm test --prefix player-web
echo Tests complete!
