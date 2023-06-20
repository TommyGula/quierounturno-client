FROM node:18.12.1


RUN mkdir -p /srv/app/admin-client
WORKDIR /srv/app/admin-client


COPY package.json /srv/app/admin-client
COPY package-lock.json /srv-app/admin-client
COPY .env /srv-app/admin-client


RUN npm install --legacy-peer-deps
RUN npm install react-scripts@3.3.1 -g


COPY . /srv/app/admin-client


CMD [ "npm", "run", "start" ]