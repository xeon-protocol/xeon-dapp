# Xeon Protocol Core Contracts

This repository contains the Xeon Protocol contracts, tests, and scripts. Xeon is a cutting edge DeFi protocol that unlocks liquidity on EVM networks by providing novel risk-management tools and an all-inclusive frontend.

## Foundry

Xeon Protocol's core contracts are built with Foundry, a smart contract development toolchain made up of the following tools:

- **Forge**: Ethereum testing framework (like Truffle, Hardhat and DappTools).
- **Cast**: Swiss army knife for interacting with EVM smart contracts, sending transactions and getting chain data.
- **Anvil**: Local Ethereum node, akin to Ganache, Hardhat Network.
- **Chisel**: Fast, utilitarian, and verbose solidity REPL.

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

### Anvil

To use a local testnet node, simply type `anvil` to see a list of accounts and private keys available for use, as well as the address and port that the node is listening on.

```shell
# number of dev accounts to generate and configure [default: 10]
anvil -a, --accounts <ACCOUNTS>

# EVM hardfork to use [default: latest]
anvil --hardfork <HARDFORK>

# port number to listen on [default: 8545]
anvil -p, --port <PORT>
```

A `genesis.json` file can be used to define the initial state of the testnet. All values are to be defined as hexadecimals.

A sample for simulating mainnet via genesis can be found [here](https://github.com/paradigmxyz/reth/blob/8f3e4a15738d8174d41f4aede5570ecead141a77/crates/primitives/res/genesis/mainnet.json).

### Cast

Cast is a CLI for performing Ethereum RPC calls. You can make contract calls, send transactions, or retrieve any type of onchain data.

```shell
$ cast <subcommand>
```

## Security

For any security-related concerns, please refer to the [SECURITY](https://github.com/xeon-protocol/xeon-dapp/blob/main/SECURITY.md) policy. This repository is subject to a bug bounty program per the terms outlined in the aforementioned policy.

## License

The primary license for core Xeon Protocol contracts (`XeonHedging.sol` + `XeonStaking.sol`) is the Business Source License 1.1 (BUSL-1.1), see [`LICENSE.md`](https://github.com/xeon-protocol/xeon-dapp/blob/main/LICENSE.md).

However, there are some exceptions:

- Several files in `script` and `test` are licensed under `GPL-3.0-or-later` (see: [`LICENSE-GPL.md`](https://github.com/xeon-protocol/xeon-dapp/blob/main/LICENSE-GPL.md)) or remain unlicensed (per their SPDX headers).
