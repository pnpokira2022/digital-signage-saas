FROM node:18
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install
COPY . .
COPY wait-for-it.sh /app/wait-for-it.sh  # Moved to the end to avoid overwrite
RUN ls -la /app  # Debug step to confirm file presence
RUN chmod +x /app/wait-for-it.sh
RUN apt-get update && apt-get install -y netcat-openbsd
RUN yarn tsc
ENTRYPOINT ["/app/wait-for-it.sh", "postgres", "5432", "--", "/app/wait-for-it.sh", "redis", "6379", "--", "yarn", "start"]