FROM alpine:latest

RUN apk add --no-cache --update python3 bash yarn nodejs
RUN npm install -g serve
WORKDIR /app
ADD . /app

RUN yarn install
RUN yarn build

CMD serve -s build -p $PORT
