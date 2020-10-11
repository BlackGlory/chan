FROM node:12-alpine
WORKDIR /usr/src/app

COPY package.json yarn.lock ./

# better-sqlite3 build deps
RUN apk add --update --no-cache --virtual .build-deps \
      build-base \
      python3 \
 && yarn install \
 && yarn cache clean \
 && apk del .build-deps

COPY . ./

RUN yarn build \
 && mkdir /data \
 && ln -s /data data

EXPOSE 8080
ENTRYPOINT ["yarn"]
CMD ["--silent", "start"]
