FROM node:18-alpine

RUN apk add --no-cache git openssh

WORKDIR /usr/src/app

ARG SSH_PRIVATE_KEY
ARG SSH_PUBLIC_KEY
ARG KNOWN_HOSTS
ARG REPO_URL

RUN mkdir -p /root/.ssh && \
  echo "$SSH_PRIVATE_KEY" > /root/.ssh/id_rsa && \
  echo "$SSH_PUBLIC_KEY" > /root/.ssh/id_rsa.pub && \
  echo "$KNOWN_HOSTS" > /root/.ssh/known_hosts && \
  chmod 600 /root/.ssh/id_rsa && \
  chmod 600 /root/.ssh/id_rsa.pub && \
  ssh-keyscan github.com >> /root/.ssh/known_hosts

RUN git config --global url."git@github.com:".insteadOf "https://github.com/"

RUN git clone $REPO_URL .

RUN cd xeon-dapp && git pull origin main

RUN cd xeon-dapp && npm install

EXPOSE 3000

CMD ["npm", "run", "dev"]
