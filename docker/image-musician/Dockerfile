FROM node:8.11.3
MAINTAINER Jostoph

COPY src /opt/app/

WORKDIR /opt/app/
RUN npm install

ENTRYPOINT ["node", "/opt/app/musician.js"]
