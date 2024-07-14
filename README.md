# XEON Protocol

This repository contains the XEON Protocol dAapp, which includes both the Node.js application and the Foundry Solidity contracts.

## Prerequisites

- Docker
- Git
- Node.js (for local development without Docker)
- npm (v6 or higher)
- Foundry (for smart contract development)

## Setting Up the Development Environment

You can set up the development environment using Docker with the provided Dockerfiles.

1. `Dockerfile` - Standard setup for Node.js app
2. `Dockerfile.foundry` - Setup with Foundry for Solidity testing

### Building and Running the Docker Containers

#### Standard Setup

To build and run the repository locally, ensure you have the latest changes from the repository locally on your machine:

```sh
git pull origin main
```

Build and run the Docker container:

```sh
docker build -t xeon-dapp -f Dockerfile .

docker run -p 3000:3000 xeon-dapp
```

This will start the development server on port 3000 ([http://localhost:3000](http://localhost:3000)).

#### Local Development

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

### Setting up Foundry for Smart Contract Development

The `contracts` directory contains the Solidity contracts and related files.
To work with these contracts, you need to set up Foundry.

1. Install Foundry:

Follow the instructions on [Foundry's official website](https://book.getfoundry.sh/getting-started/installation) to install Foundry.

```sh
curl -L https://foundry.paradigm.xyz | bash
foundryup
```

2. Navigate to the `/contracts` directory and follow the instructions in [`/contracts/README.md`](https://github.com/xeon-protocol/xeon-dapp/blob/main/xeon-contract/README.md) to continue with Foundry.

## Directory Structure

- `xeon-contract` - Contains the Solidity contracts and related files. The `foundry.toml` file is used to configure Foundry.
- `src` - Source code for the Next.js application

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.
This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Foundry Documentation](https://book.getfoundry.sh/) - learn about Foundry.

## Current Work

Please update and follow along with the current development progress on [Trello](https://trello.com/b/F13JtDx1/development).
