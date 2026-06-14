FROM node:22-alpine

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN corepack enable
RUN pnpm install --ignore-scripts=false

# Declare and set the build arg
ARG NEXT_PUBLIC_SERVER_URL
ENV NEXT_PUBLIC_SERVER_URL=$NEXT_PUBLIC_SERVER_URL

COPY . .

RUN pnpm build

EXPOSE 4000

CMD ["pnpm", "start"]