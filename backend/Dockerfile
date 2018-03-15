FROM alpine:latest

RUN apk add --no-cache --update python3 bash

WORKDIR /app
ADD . /app

RUN pip3 install --no-cache-dir -q -r requirements.txt

RUN adduser -D myuser
USER myuser

CMD gunicorn --bind 0.0.0.0:$PORT wsgi
