# Xeon Protocol dApp

[![GitHub license](https://img.shields.io/badge/core_license-BUSL_1.1-blue.svg)](https://github.com/xeon-protocol/xeon-dapp/blob/main/LICENSE) [![GitHub license](https://img.shields.io/badge/incl_license-GPL_3.0-blue.svg)](https://github.com/xeon-protocol/xeon-dapp/blob/main/LICENSE-GPL.md)

[![xeon token](https://img.shields.io/badge/$XEON-0x8d65a2eaBDE4B31cbD7E43F27E47559d1CCec86c-8429c6.svg?logo=ethereum)](https://app.uniswap.org/explore/tokens/ethereum/0x8d65a2eabde4b31cbd7e43f27e47559d1ccec86c?chain=mainnet)

This repository contains the Xeon Protocol frontend. For the smart contracts, see the [xeon-v1-core](https://github.com/xeon-protocol/v1-core) repository.

### Follow Us

[![warpcast](https://img.shields.io/badge/Follow_@xeonprotocol-FFFFFF.svg?logo=farcaster)](https://warpcast.com/xeonprotocol) ![twitter follow](https://img.shields.io/twitter/follow/xeonprotocol) [![telegram](https://img.shields.io/badge/join_telegram-FFFFFF.svg?logo=telegram)](https://t.me/XeonProtocolPortal)

### Repo Status

![GitHub Issues or Pull Requests](https://img.shields.io/github/issues/xeon-protocol/xeon-dapp) ![GitHub commit activity](https://img.shields.io/github/commit-activity/m/xeon-protocol/xeon-dapp) ![GitHub contributors](https://img.shields.io/github/contributors/xeon-protocol/xeon-dapp)

## Prerequisites

[![git](https://img.shields.io/badge/git-any-darkgreen)](https://git-scm.com/downloads) [![node](https://img.shields.io/badge/node.js->_14.2.4-darkgreen)](https://nodejs.org/en/download/) [![npm](https://img.shields.io/badge/npm->=_6-darkgreen)](https://npmjs.com/) [![docker](https://img.shields.io/badge/docker-optional-blue)](https://www.docker.com/)

## Directory Structure

- `abi` - Contains ABI `json` files and global references to onchain deployments used in the app.
- `src` - Source code for the Next.js application
- Ensure sensitive data is stored in `.env.local`

## Set Up

Clone the repository:

```sh
git clone https://github.com/xeon-protocol/xeon-dapp.git
```

If already cloned locally, ensure you have the latest changes locally:

```sh
git pull origin main
```

Install all dependencies:

```sh
npm install
```

Then, start the development server:

```sh
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Product Management

[![trello](https://img.shields.io/badge/Trello-855DCD.svg?logo=trello)](https://trello.com/invite/b/mW198hKo/ATTIc305ea03ad04139d54ef382b7a276d651224A655/xeon-protocol-board)

## Contributing

[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-darkgreen.svg)](https://github.com/xeon-protocol/xeon-dapp/blob/main/CONTRIBUTING.md) [![Bug Bounties](https://img.shields.io/badge/Bug_Bounties-open-red.svg)](https://github.com/xeon-protocol/xeon-dapp/blob/main/SECURITY.md)

If you are a developer looking to contribute, please take a look at the guidelines in [CONTRIBUTING](https://github.com/xeon-protocol/xeon-testnet/blob/main/CONTRIBUTING.md) first, then feel free to look at [open issues](https://github.com/xeon-protocol/xeon-dapp/issues/) or open a [new one](https://github.com/xeon-protocol/xeon-dapp/issues/new/choose).

If you are an Solidity developer and are interested in auditing our contracts, you can submit an audit by using the form [here](https://github.com/xeon-protocol/v1-core/issues/new?assignees=heyJonBray%2C+wellytg%2C+neonhedge&labels=type%3A+audit%2C+status%3A+discussing&projects=&template=04-audit-submission.md&title=xeon-v1-core+audit+%5BMM-DD-YYYY%5D-%5ByourName%5D).

## Security

For any security-related concerns, please refer to the [SECURITY](https://github.com/xeon-protocol/xeon-dapp/blob/main/SECURITY.md) policy. This repository is subject to a bug bounty program per the terms outlined in the aforementioned policy.

For vulnerability hunters, please see our [Bug Bounty Program](https://github.com/xeon-protocol/xeon-dapp/blob/main/bug-bounty.md).

## License

The primary license for core Xeon Protocol contracts (`XeonHedging.sol` + `XeonStaking.sol`) is the Business Source License 1.1 (BUSL-1.1), see [`LICENSE.md`](https://github.com/xeon-protocol/xeon-dapp/blob/main/LICENSE.md).

However, there are some exceptions:

- Several files in `contracts/script` and `contracts/test` are licensed under `GPL-3.0-or-later` (see: [`LICENSE-GPL.md`](https://github.com/xeon-protocol/xeon-dapp/blob/main/LICENSE-GPL.md)) or remain unlicensed (per their SPDX headers).
