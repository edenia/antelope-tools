# ---------- Base ----------
FROM node:16.16.0 as base
WORKDIR /app

# ---------- Builder ----------
FROM base AS builder
COPY package.json yarn.lock ./
RUN yarn --ignore-optional --frozen-lockfile
COPY ./src ./src
COPY ./app.json ./

# ---------- Release ----------
FROM base AS release
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/src ./src
COPY --from=builder /app/app.json ./
RUN apt-get update
RUN apt-get install -y nano
RUN yarn global add pm2
USER node
CMD ["pm2-runtime", "app.json"]
