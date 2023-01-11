FROM node:16.17.0-alpine as builder

ENV HOME=/builder/app
WORKDIR ${HOME}

RUN apk add --no-cache --virtual .gyp python3 make g++

COPY package*.json  yarn.lock  ./
COPY env/.env.development .env
RUN yarn config set ignore-engines true

RUN yarn

RUN mkdir -p /prod_dep \
    && cp package.json yarn.lock /prod_dep/ \
    && cd /prod_dep \
    && yarn \
    && cd ${HOME}

COPY . .
RUN cat .env
RUN yarn run build

#============================== BUILD IMAGE FOR PRODUCTION==========================
FROM node:16.17.0-alpine as production
RUN apk --no-cache add curl

ENV HOME=/home/app
# ENV RDS_USERNAME=appdb04vitalifydev
# ENV RDS_PASSWORD=UaX5Ck_rr5MU
# ENV RDS_DATABASE=CCAppStagingDB2
# ENV RDS_HOST=cnt-azr-appdb04.database.windows.net
WORKDIR ${HOME}
COPY package*.json ./
COPY yarn.lock .

COPY --from=builder /builder/app/dist/ ./dist/
# COPY --from=builder /builder/app/.env ./
COPY --from=builder /prod_dep/node_modules ./node_modules
COPY env/.env.production ./.env

EXPOSE $APP_PORT

CMD yarn start:prod


#============================== BUILD IMAGE FOR DEVELOPMENT==========================
FROM node:16.17.0-alpine as development
RUN apk --no-cache add curl

ENV HOME=/home/app
WORKDIR ${HOME}
COPY package*.json ./
COPY yarn.lock .

COPY --from=builder /builder/app/dist/ ./dist/
COPY --from=builder /prod_dep/node_modules ./node_modules
COPY env/.env.development ./.env

EXPOSE $APP_PORT

CMD yarn start:prod
