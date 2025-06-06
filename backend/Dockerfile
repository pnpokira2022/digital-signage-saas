# backend/Dockerfile
FROM node:18
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install
COPY . .
COPY wait-for-it.sh /app/wait-for-it.sh
RUN chmod +x /app/wait-for-it.sh
RUN apk add --no-cache netcat-openbsd
RUN yarn tsc  # Compile TypeScript during build
ENTRYPOINT ["/app/wait-for-it.sh", "postgres", "5432", "--", "/app/wait-for-it.sh", "redis", "6379", "--", "yarn", "start"]