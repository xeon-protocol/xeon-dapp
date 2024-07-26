# [Xeon Protocol](https://xeon-protocol.io) &middot; [![GitHub license](https://img.shields.io/badge/core_license-BUSL_1.1-blue.svg)](https://github.com/xeon-protocol/xeon-dapp/blob/main/LICENSE) [![GitHub license](https://img.shields.io/badge/incl_license-GPL_3.0-blue.svg)](https://github.com/xeon-protocol/xeon-dapp/blob/main/LICENSE-GPL.md)

[![xeon token](https://img.shields.io/badge/$XEON-0x8d65a2eaBDE4B31cbD7E43F27E47559d1CCec86c-8429c6.svg?logo=ethereum)](https://app.uniswap.org/explore/tokens/ethereum/0x8d65a2eabde4b31cbd7e43f27e47559d1ccec86c?chain=mainnet)

This repository contains the Xeon Protocol dApp, which includes both the frontend application as well as Solidity contracts, tests, and scripts built with Foundry.

### Follow Us

[![warpcast](https://img.shields.io/badge/Follow_@xeonprotocol-FFFFFF.svg?logo=farcaster)](https://warpcast.com/xeonprotocol) ![twitter follow](https://img.shields.io/twitter/follow/xeonprotocol) [![telegram](https://img.shields.io/badge/join_telegram-FFFFFF.svg?logo=telegram)](https://t.me/XeonProtocolPortal)

### Repo Status

![GitHub Issues or Pull Requests](https://img.shields.io/github/issues/xeon-protocol/xeon-dapp) ![GitHub commit activity](https://img.shields.io/github/commit-activity/m/xeon-protocol/xeon-dapp) ![GitHub contributors](https://img.shields.io/github/contributors/xeon-protocol/xeon-dapp)

## Prerequisites

[![git](https://img.shields.io/badge/git-any-darkgreen)](https://git-scm.com/downloads) [![node](https://img.shields.io/badge/node.js->_14.2.4-darkgreen)](https://nodejs.org/en/download/) [![npm](https://img.shields.io/badge/npm->=_6-darkgreen)](https://npmjs.com/) [![Foundry](https://img.shields.io/badge/Foundry-v0.2.0-orange)](https://book.getfoundry.sh/) [![docker](https://img.shields.io/badge/docker-optional-blue)](https://www.docker.com/)

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

If you prefer to run the application locally without Docker, follow these steps.

First, install the dependencies:

```sh
npm install
```

Second, start the development server:

```sh
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Smart Contracts

The `contracts` directory contains the Solidity contracts and related files.
To work with these contracts, you need to set up Foundry.

First, ensure Foundry is installed globally.

```sh
curl -L https://foundry.paradigm.xyz | bash
```

Navigate to the `/contracts` directory and follow the instructions in [`/contracts/README.md`](https://github.com/xeon-protocol/xeon-dapp/blob/main/contracts/README.md) to continue with Foundry.

## Directory Structure

- `contracts` - Contains the Solidity contracts and related files. The `foundry.toml` file is used to configure Foundry
- `src` - Source code for the Next.js application
- Ensure sensitive data is stored in `.env.local`

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.
This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API
- [Foundry Documentation](https://book.getfoundry.sh/) - learn about Foundry

## Product Management &middot; [![trello](https://img.shields.io/badge/Trello-855DCD.svg?logo=trello)](https://trello.com/b/mW198hKo/xeon-protocol-board)

If you have trouble joining Trello, please request access by clicking [here](https://trello.com/invite/b/mW198hKo/ATTIc305ea03ad04139d54ef382b7a276d651224A655/xeon-protocol-board).

## [Contributing](https://github.com/xeon-protocol/xeon-testnet/blob/main/CONTRIBUTING.md) &middot; [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-darkgreen.svg)](https://github.com/xeon-protocol/xeon-dapp/blob/main/CONTRIBUTING.md) &middot; [![Bug Bounties](https://img.shields.io/badge/Bug_Bounties-open-red.svg)](https://github.com/xeon-protocol/xeon-dapp/blob/main/SECURITY.md)

If you are a developer looking to contribute, please take a look at the guidelines in [CONTRIBUTING](https://github.com/xeon-protocol/xeon-testnet/blob/main/CONTRIBUTING.md) first.

If you are an auditor and have found any problems or vulnerabilities in the codebase, please see our policy in [SECURITY](https://github.com/xeon-protocol/xeon-testnet/blob/main/SECURITY.md).

## [Security](https://github.com/xeon-protocol/xeon-dapp/blob/main/SECURITY.md) &middot; [![warpcast](https://img.shields.io/badge/contact_dev-FFFFFF.svg?logo=farcaster)](https://warpcast.com/xeonprotocol)

For any security-related concerns, please refer to the [SECURITY](https://github.com/xeon-protocol/xeon-dapp/blob/main/SECURITY.md) policy. This repository is subject to a bug bounty program per the terms outlined in the aforementioned policy.

## License

The primary license for core Xeon Protocol contracts (`XeonHedging.sol` + `XeonStaking.sol`) is the Business Source License 1.1 (BUSL-1.1), see [`LICENSE.md`](https://github.com/xeon-protocol/xeon-dapp/blob/main/LICENSE.md).

However, there are some exceptions:

- Several files in `contracts/script` and `contracts/test` are licensed under `GPL-3.0-or-later` (see: [`LICENSE-GPL.md`](https://github.com/xeon-protocol/xeon-dapp/blob/main/LICENSE-GPL.md)) or remain unlicensed (per their SPDX headers).
