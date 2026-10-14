# ---- Stage 1: build ----
FROM node:24-alpine AS builder

RUN corepack enable

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm run build

# ---- Stage 2: production ----
FROM node:24-alpine

RUN corepack enable

WORKDIR /app

COPY --from=builder /app/.env .env
    
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile
 
COPY --from=builder /app/dist ./dist

COPY start.sh ./
RUN chmod +x start.sh

EXPOSE 3001

CMD ["./start.sh"]