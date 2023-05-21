#version 2.0

FROM node:14

WORKDIR /my-app
COPY . .


RUN npm install
RUN npm install express
RUN npm install mongoose
RUN npm install moment

EXPOSE 3000
CMD [ "npm", "start" ]