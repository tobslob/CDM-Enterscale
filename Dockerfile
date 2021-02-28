FROM mhart/alpine-node:10 as Base

WORKDIR /app

RUN apk add --no-cache make gcc g++ python

COPY package.json yarn.lock ./

RUN yarn install --ignore-engines

COPY . ./

RUN yarn build

EXPOSE ${PORT}

FROM mhart/alpine-node:10

WORKDIR /app

COPY --from=Base /app .

CMD [ "yarn", "start" ]
