# syntax=docker/dockerfile:1

FROM node:20-bookworm-slim AS base
WORKDIR /app

FROM base AS build
ENV NODE_ENV=development
RUN apt-get update \
  && apt-get install -y --no-install-recommends \
    build-essential \
    python3 \
    pkg-config \
    libsqlite3-dev \
  && rm -rf /var/lib/apt/lists/*
COPY package.json package-lock.json ./
RUN npm ci
COPY . ./
RUN npm run build
RUN npm prune --omit=dev

FROM base AS production
ENV NODE_ENV=production
RUN apt-get update \
  && apt-get install -y --no-install-recommends \
    libsqlite3-0 \
    tini \
  && rm -rf /var/lib/apt/lists/*
COPY --from=build /app /app
RUN chown -R node:node /app
USER node
EXPOSE 1337
ENTRYPOINT ["/usr/bin/tini", "--"]
CMD ["npm", "run", "start"]
