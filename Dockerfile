FROM node:18-alpine

# Install Git and OpenSSH to pull the latest changes from remote
RUN apk add --no-cache git openssh

WORKDIR /usr/src/app

# Copy SSH keys and set permissions
# Use build args for SSH keys and URL
ARG SSH_PRIVATE_KEY
ARG SSH_PUBLIC_KEY
ARG KNOWN_HOSTS
ARG REPO_URL

RUN mkdir -p /root/.ssh && \
  echo "$SSH_PRIVATE_KEY" > /root/.ssh/id_rsa && \
  echo "$SSH_PUBLIC_KEY" > /root/.ssh/id_rsa.pub && \
  echo "$KNOWN_HOSTS" > /root/.ssh/known_hosts && \
  chmod 600 /root/.ssh/id_rsa

RUN git clone $REPO_URL .

RUN npm install

EXPOSE 3000

CMD ["npm", "run", "dev"]
