# XEON Protocol

This repository contains the XEON Protocol dAapp, which includes both the Node.js application and the Foundry Solidity contracts.

## Prerequisites

- Docker
- Node.js (for local development without Docker)

## Setting Up the Development Environment

You can set up the development environment using Docker with one of the two available Dockerfiles:

1. `Dockerfile` - Standard setup, pull latest changes from remote using SSH
2. `Dockerfile.local` - Standard setup, using current local repo
3. `Dockerfile.foundry` - Setup with Foundry for Solidity testing

### Building and Running the Docker Containers

#### Standard Setup (pull latest changes)

To build and run the Docker container and pull the latest changes to the repo, first make sure your SSH agent is running and your keys are added

```sh
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_rsa
```

Build and run the Docker container without pulling the latest changes:

```sh
docker build --ssh default --build-arg SSH_PRIVATE_KEY="$(cat ~/.ssh/id_rsa)" \
             --build-arg SSH_PUBLIC_KEY="$(cat ~/.ssh/id_rsa.pub)" \
             --build-arg KNOWN_HOSTS="$(cat ~/.ssh/known_hosts)" \
             --build-arg REPO_URL="git@github.com:xeon-protocol/xeon-dapp.git" \
             -t xeon-dapp -f Dockerfile .

docker run -p 3000:3000 xeon-dapp
```

#### Standard Setup (local repo)

Build and run the Docker container:

```sh
docker build -t xeon-dapp -f Dockerfile.local .
docker run -p 3000:3000 xeon-dapp
```

This will start the development server on port 3000 ([http://localhost:3000](http://localhost:3000)).

#### Setup with Foundry (for Solidity testing)

To build and run the Docker container with Foundry:

```sh
docker build -t xeon-dapp-foundry -f Dockerfile.foundry .
docker run -p 3000:3000 xeon-dapp-foundry
```

This will start the development server and prepare Foundry for testing in the CLI.

## Local Development

If you prefer to run the application locally without Docker, follow these steps:

1. Install the dependencies:

```sh
npm install
```

2. Start the development server:

```sh
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Directory Structure

- `xeon-contract` - Contains the Solidity contracts and related files. The `foundry.toml` file is used to configure Foundry.
- `src` - Source code for the Next.js application

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.
This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.

## Current Work

use this section to update with the current work being done
steps, details
