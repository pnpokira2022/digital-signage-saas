FROM node:18
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install
COPY src/ ./src/
RUN ls -la /app  # Debug to confirm files
RUN apt-get update && apt-get install -y netcat-openbsd
RUN yarn tsc --pretty || { echo "TypeScript compilation failed"; cat /app/src/**/*.ts; exit 1; }  # Log errors and exit
RUN ls -la /app/dist  # Debug to confirm compiled files
CMD ["node", "dist/server.js"]