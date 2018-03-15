FROM alpine:latest

RUN apk add --no-cache --update python3 bash
WORKDIR /app
ADD . /app

RUN pip3 install --no-cache-dir -q -r backend/requirements.txt

EXPOSE 80
WORKDIR ./backend

ENV FLASK_APP app.py


CMD python3 app.py
