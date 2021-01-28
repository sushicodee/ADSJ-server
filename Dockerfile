FROM node:alpine

COPY . /usr/src

WORKDIR /usr/src

RUN npm install

CMD [ "node","index.js" ]

EXPOSE 5000