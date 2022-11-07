FROM node:latest
WORKDIR /usr/src/app
COPY /validator ./
RUN npm install
CMD [ "node", "index.js" ]