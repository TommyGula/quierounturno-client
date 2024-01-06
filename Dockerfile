FROM node:18.12.1

RUN mkdir -p /srv/app/client
WORKDIR /srv/app/client

COPY package.json /srv/app/client
COPY package-lock.json /srv-app/client
COPY .env /srv-app/client

RUN npm install --legacy-peer-deps
RUN npm install react-scripts@3.3.1 -g

COPY . /srv/app/client

CMD [ "npm", "run", "start" ]