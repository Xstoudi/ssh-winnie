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
RUN node ace build --production

FROM base AS production
ENV HOST=0.0.0.0
ENV PORT=$PORT
ENV APP_KEY=$APP_KEY
ENV NODE_ENV=development
ENV DB_CONNECTION=pg
ENV PG_HOST=$PG_HOST
ENV PG_PORT=$PG_PORT
ENV PG_USER=$PG_USER
ENV PG_PASSWORD=$PG_PASSWORD
ENV PG_DB_NAME=$PG_DB_NAME
ENV WINNIE_NAME=$WINNIE_NAME
COPY --chown=node:node ./package*.json ./
RUN npm ci
COPY --chown=node:node --from=build /home/node/app/build .
EXPOSE $PORT
CMD [ "dumb-init", "node", "ace", "honeypot:run" ]