FROM node:12-alpine

WORKDIR /usr/src/app

COPY package.json yarn.lock ./

RUN apk add --update --no-cache \
      build-base \
      python3 \
 && yarn install \
 && yarn cache clean \
 && apk del \
      build-base \
      python3

COPY . ./

RUN yarn build \
 && mkdir -p data

ENTRYPOINT ["yarn", "start"]
