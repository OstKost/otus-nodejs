# DEPS
FROM node:18-alpine AS dependencies

WORKDIR /app

RUN npm install -g npm@9.6.5

COPY package*.json ./

RUN npm ci # --omit=dev

COPY . .

FROM node:18-alpine AS builder

WORKDIR /app

RUN npm install -g npm@9.6.5

COPY --from=dependencies /app ./

COPY prisma ./prisma/

RUN npx prisma generate

RUN npm run build

USER node

FROM node:18-alpine AS run

WORKDIR /app

RUN npm install -g npm@9.6.5

COPY --from=dependencies /app/node_modules ./node_modules
COPY --from=dependencies /app/package*.json ./
COPY --from=builder /app/dist ./dist

RUN npm prune --production

EXPOSE 3000
CMD [ "npm", "run", "start:prod" ]
