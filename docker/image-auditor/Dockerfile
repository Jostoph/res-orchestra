FROM node:8.11.3
MAINTAINER Jostoph

COPY src /opt/app/

WORKDIR /opt/app/
RUN npm install

EXPOSE 2205

ENTRYPOINT ["node", "/opt/app/auditor.js"]
