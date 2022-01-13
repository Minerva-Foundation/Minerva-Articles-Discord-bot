FROM node:17

WORKDIR /app
COPY / ./

RUN npm i
RUN npm run build
CMD [ "npm", "start"]