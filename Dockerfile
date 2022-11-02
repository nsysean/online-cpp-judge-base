FROM node:18.12
WORKDIR /usr/src/app
COPY /pain/package*.json ./
RUN npm install
COPY /pain .
CMD [ "node", "index.js" ]