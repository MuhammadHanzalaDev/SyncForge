FROM node:22-alpine

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN corepack enable
RUN pnpm install

COPY . .

RUN pnpm dlx prisma generate

RUN pnpm run build

EXPOSE 5000

CMD ["sh", "-c", "pnpm prisma migrate deploy && node dist/server.js"]