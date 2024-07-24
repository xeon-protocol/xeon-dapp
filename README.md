# Xeon Protocol dApp

This repository contains the Xeon Protocol dApp, which includes both the Node.js frontend and Solidity contracts, tests, and scripts built with Foundry.

## Contributing

If you are a developer looking to contribute, please take a look at the guidelines in [CONTRIBUTING](https://github.com/xeon-protocol/xeon-testnet/blob/main/CONTRIBUTING.md) first.

If you are an auditor and have found any problems or vulnerabilities in the codebase, please see our policy in [SECURITY](https://github.com/xeon-protocol/xeon-testnet/blob/main/SECURITY.md).

## Prerequisites

- [Git](https://git-scm.com/downloads)
- [Foundry](https://github.com/foundry-rs/foundry)
- [Node.js](https://nodejs.org/en/download/)
- npm (>= v6)
- Docker (optional)

## Set Up

Ensure you have the latest changes from the repository locally on your machine:

```sh
git pull origin main
```

### Docker

Build and run the Docker container:

```sh
docker build -t xeon-dapp -f Dockerfile .

docker run -p 3000:3000 xeon-dapp
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

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

2. Navigate to the `/contracts` directory and follow the instructions in [`/contracts/README.md`](https://github.com/xeon-protocol/xeon-dapp/blob/main/contracts/README.md) to continue with Foundry.

## Directory Structure

- `contracts` - Contains the Solidity contracts and related files. The `foundry.toml` file is used to configure Foundry
- `src` - Source code for the Next.js application
- Ensure sensitive data is stored in `.env.local`

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.
This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API
- [Foundry Documentation](https://book.getfoundry.sh/) - learn about Foundry

## Contributing

Please update and follow along with the current development progress on [Trello](https://trello.com/b/mW198hKo/xeon-protocol-board).

- If unable to access, [request invite](https://trello.com/invite/b/mW198hKo/ATTIc305ea03ad04139d54ef382b7a276d651224A655/xeon-protocol-board)

For guidance on best practices within the Xeon codebase, see the [CONTRIBUTING](https://github.com/xeon-protocol/xeon-testnet/blob/main/CONTRIBUTING.md) guide.

## Security

For any security-related concerns, please refer to the [SECURITY](https://github.com/xeon-protocol/xeon-testnet/blob/main/SECURITY.md) policy. This repository is subject to a bug bounty program per the terms outlined in the aforementioned policy.

## License

The primary license for Xeon Protocol is the Business Source License 1.1 (BUSL-1.1), see [`LICENSE.md`](https://github.com/xeon-protocol/xeon-dapp/blob/main/LICENSE.md). However, there are some exceptions:

- Several files in `contracts/script` and `contracts/test` are licensed under `GPL-3.0-or-later`, see [`LICENSE-GPL.md`](https://github.com/xeon-protocol/xeon-dapp/blob/main/LICENSE-GPL.md).
- Many files in `test/` remain unlicensed (as indicated in their SPDX headers).
