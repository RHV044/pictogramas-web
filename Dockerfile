# pull the official base image
FROM node:alpine as build-stage
# set working direction
WORKDIR /app
# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH
# install application dependencies
COPY package.json ./
COPY package-lock.json ./
RUN npm i --legacy-peer-deps
COPY . ./
RUN npm run build-prod

FROM nginx:1.15
COPY --from=build-stage /app/build/ /usr/share/nginx/html
