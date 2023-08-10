ARG NODE_IMAGE_VERSION="18.16"

### base stage
FROM node:${NODE_IMAGE_VERSION}-alpine as base


### dependencies stage - development
FROM base as dependencies

WORKDIR /opt

COPY package.json yarn.lock package-lock.json ./
RUN if [ -f yarn.lock ]; then yarn install --frozen-lockfile; else npm install; fi


### dependencies stage - production
FROM base as prod-dependencies

WORKDIR /opt

COPY package.json yarn.lock package-lock.json ./
RUN if [ -f yarn.lock ]; then yarn install --production --frozen-lockfile; else npm ci --omit=dev; fi


### development stage
FROM base as development

RUN apk add --no-cache bash vim

ARG BASE_DIRECTORY="/app"

WORKDIR ${BASE_DIRECTORY}

ENV NODE_ENV=development

COPY --from=dependencies /opt/node_modules ./node_modules
COPY . .

ENV CHAT_API_KEY=

EXPOSE 3000

CMD ["yarn", "dev"]


### builder stage - production only
FROM base as builder

WORKDIR /opt

COPY --from=prod-dependencies /opt/node_modules ./node_modules
COPY . .

RUN yarn build


# production stage
FROM base as production

ARG BASE_DIRECTORY="/app"

WORKDIR ${BASE_DIRECTORY}

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs

COPY --from=builder --chown=nextjs:nodejs /opt/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /opt/.next/static ./.next/static

USER nextjs

ENV CHAT_API_KEY=

EXPOSE 3000

CMD ["node", "server.js"]
