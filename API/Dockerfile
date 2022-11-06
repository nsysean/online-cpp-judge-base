FROM node:18.12
WORKDIR /usr/src/app
COPY /validator ./
RUN npm install
CMD [ "node", "index.js" ]