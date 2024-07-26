# xeon-core-v1 &middot; [![GitHub license](https://img.shields.io/badge/core_license-BUSL_1.1-blue.svg)](https://github.com/xeon-protocol/xeon-v1/blob/main/LICENSE) [![GitHub license](https://img.shields.io/badge/incl_license-GPL_3.0-blue.svg)](https://github.com/xeon-protocol/xeon-v1/blob/main/LICENSE-GPL.md)

[![xeon token](https://img.shields.io/badge/$XEON-0x8d65a2eaBDE4B31cbD7E43F27E47559d1CCec86c-8429c6.svg?logo=ethereum)](https://app.uniswap.org/explore/tokens/ethereum/0x8d65a2eabde4b31cbd7e43f27e47559d1ccec86c?chain=mainnet)

This repository contains the core contracts for v1 of Xeon Protocol including tests, and scripts. Xeon Protocol is a cutting edge DeFi protocol that unlocks liquidity on EVM networks by providing novel risk-management tools and an all-inclusive frontend.

### Follow Us

[![warpcast](https://img.shields.io/badge/Follow_@xeonprotocol-FFFFFF.svg?logo=farcaster)](https://warpcast.com/xeonprotocol) ![twitter follow](https://img.shields.io/twitter/follow/xeonprotocol) [![telegram](https://img.shields.io/badge/join_telegram-FFFFFF.svg?logo=telegram)](https://t.me/XeonProtocolPortal)

### Repo Status

![GitHub Issues or Pull Requests](https://img.shields.io/github/issues/xeon-protocol/xeon-v1) ![GitHub commit activity](https://img.shields.io/github/commit-activity/m/xeon-protocol/xeon-v1) ![GitHub contributors](https://img.shields.io/github/contributors/xeon-protocol/xeon-v1)

## Prerequisites

[![git](https://img.shields.io/badge/git-any-darkgreen)](https://git-scm.com/downloads) [![npm](https://img.shields.io/badge/npm->=_6-darkgreen)](https://npmjs.com/) [![Foundry](https://img.shields.io/badge/Foundry-v0.2.0-orange)](https://book.getfoundry.sh/)

## Directory Structure

- `src` - core solidity contracts.
- `test` - tests written in solidity.
- `script` - scripts written in solidity.

## Foundry

Xeon contracts are built with Foundry, a smart contract development toolchain made up of the following tools:

The `foundry.toml` file is used to configure Foundry settings, manage RPC endpoints, and dependencies.

## Setup

First, ensure Foundry is installed.

```shell
curl -L https://foundry.paradigm.xyz | bash
foundryup
```

Second, install the dependency submodules using Forge:

```shell
forge install --no-commit foundry-rs/forge-std openzeppelin/openzeppelin-contracts uniswap/v2-core uniswap v3-core uniswap v3-periphery
```

To learn more about Foundry, check out their docs [here](https://book.getfoundry.sh/).

## Forge

Forge is used to build, test, and deploy smart contracts.

### Build

To build and compile all smart contracts, use:

```shell
$ forge build
```

### Test

Tests are handled through test files, written in Solidity and using the naming convention `Contract.t.sol`

```shell
$ forge test
```

### Gas Snapshots

Forge can generate gas snapshots for all test functions to see how much gas contracts will consume, or to compare gas usage before and after optimizations.

```shell
$ forge snapshot
```

### Deploy

Deployments are handled through script files, written in Solidity and using the naming convention `Contract.s.sol`

You can run a script directly from your CLI

```shell
$ forge script script/MyContract.s.sol:MyContractScript --rpc-url <your_rpc_url> --private-key <your_private_key>
```

Unless you include the `--broadcast` argument, the script will be run in a simulated environment. If you need to run the script live, use the `--broadcast` arg

⚠️ **CAUTION: Using `--broadcast` will initiate an onchain transaction, only use after thoroughly testing**

```shell
$ forge script script/MyContract.s.sol:MyContractScript --rpc-url <your_rpc_url> --private-key <your_private_key> --chain-id 1 -vv --broadcast
```

Additional arguments can specity the chain and verbosity of the script

```shell
$ forge script script/MyContract.s.sol:MyContractScript --rpc-url <your_rpc_url> --private-key <your_private_key> --chain-id 1 -vv
```

Additionally, you can pass a private key directly into script functions to prevent exposing it in the command line (recommended).

⚠️ **CAUTION: Ensure you are using a `.env.local` and a proper `.gitignore` to prevent leaked keys.**

```js
function run() public {
    vm.startBroadcast(vm.envUint('PRIVATE_KEY'));
    // rest of your code...
}
```

Then run the `forge script` command without the private key arg.

💡 **When deploying a new contract, use the `--verify` arg to verify the contract on deployment.**

## Product Management &middot; [![trello](https://img.shields.io/badge/Trello-855DCD.svg?logo=trello)](https://trello.com/b/mW198hKo/xeon-protocol-board)

If you have trouble joining Trello, please request access by clicking [here](https://trello.com/invite/b/mW198hKo/ATTIc305ea03ad04139d54ef382b7a276d651224A655/xeon-protocol-board).

## [Contributing](https://github.com/xeon-protocol/xeon-v1/blob/main/CONTRIBUTING.md) &middot; [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-darkgreen.svg)](https://github.com/xeon-protocol/xeon-v1/blob/main/CONTRIBUTING.md) &middot; [![Bug Bounties](https://img.shields.io/badge/Bug_Bounties-open-red.svg)](https://github.com/xeon-protocol/xeon-v1/blob/main/SECURITY.md)

If you are a developer looking to contribute, please take a look at the guidelines in [CONTRIBUTING](https://github.com/xeon-protocol/xeon-v1/blob/main/CONTRIBUTING.md) first.

If you are an auditor and have found any problems or vulnerabilities in the codebase, please see our policy in [SECURITY](https://github.com/xeon-protocol/xeon-v1/blob/main/SECURITY.md).

## [Security](https://github.com/xeon-protocol/xeon-v1/blob/main/SECURITY.md) &middot; [![warpcast](https://img.shields.io/badge/contact_dev-FFFFFF.svg?logo=farcaster)](https://warpcast.com/xeonprotocol)

For any security-related concerns, please refer to the [SECURITY](https://github.com/xeon-protocol/xeon-v1/blob/main/SECURITY.md) policy. This repository is subject to a bug bounty program per the terms outlined in the aforementioned policy.

## License

The primary license for core Xeon Protocol contracts (`XeonHedging.sol` + `XeonStaking.sol`) is the Business Source License 1.1 (BUSL-1.1), see [`LICENSE.md`](https://github.com/xeon-protocol/xeon-v1/blob/main/LICENSE.md).

However, there are some exceptions:

- Several files in `contracts/script` and `contracts/test` are licensed under `GPL-3.0-or-later` (see: [`LICENSE-GPL.md`](https://github.com/xeon-protocol/xeon-v1/blob/main/LICENSE-GPL.md)) or remain unlicensed (per their SPDX headers).
