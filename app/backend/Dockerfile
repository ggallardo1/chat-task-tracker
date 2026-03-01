FROM node:20-slim AS base

# Install openssl and other necessary libs for Prisma
RUN apt-get update -y && apt-get install -y openssl libssl-dev ca-certificates

WORKDIR /app

RUN corepack enable
RUN corepack prepare pnpm@latest --activate

COPY package.json ./
COPY pnpm-lock.yaml* ./

RUN pnpm install

# Copy prisma schema first
COPY prisma ./prisma

# Generate Prisma client
RUN pnpm exec prisma generate

# Copy rest of source
COPY . .

RUN npx prisma generate

RUN pnpm run build

EXPOSE 3000

# Change this to sync the DB before starting the server
CMD pnpm exec prisma db push && node dist/server.js
