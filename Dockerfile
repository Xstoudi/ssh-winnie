ARG NODE_IMAGE=node:18.4.0-alpine

FROM $NODE_IMAGE AS base
RUN apk --no-cache add dumb-init
RUN apk --no-cache add openssh
RUN mkdir -p /home/node/app && chown node:node /home/node/app
WORKDIR /home/node/app
USER node
RUN mkdir tmp

FROM base AS dependencies
COPY --chown=node:node ./package*.json ./
RUN npm i
COPY --chown=node:node . .

FROM dependencies AS build
RUN npm run build

FROM base AS production
ENV NODE_ENV=production
COPY --chown=node:node ./package*.json ./
RUN npm ci --production
COPY --chown=node:node --from=build /home/node/app/build .
COPY --chown=node:node --from=build /home/node/app/ip2asn-v4-u32.tsv .
CMD [ "dumb-init", "node", "honeypot.js" ]