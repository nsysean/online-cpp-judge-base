FROM node:18.12
WORKDIR /usr/src/app
RUN npm install
COPY /validator .
CMD [ "node", "index.js" ]