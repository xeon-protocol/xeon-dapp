# Foundry

**Foundry is a blazing fast, portable and modular toolkit for Ethereum application development written in Rust.**

Foundry consists of:

- **Forge**: Ethereum testing framework (like Truffle, Hardhat and DappTools).
- **Cast**: Swiss army knife for interacting with EVM smart contracts, sending transactions and getting chain data.
- **Anvil**: Local Ethereum node, akin to Ganache, Hardhat Network.
- **Chisel**: Fast, utilitarian, and verbose solidity REPL.

## Using Foundryup

Foundryup is the Foundry toolchain installer.

Open your terminal and run the following command:

```shell
curl -L https://foundry.paradigm.xyz | bash
```

This will install Foundryup, then simply follow the instructions on-screen, which will make the foundryup command available in your CLI.

If Foundry has already been installed globally, ensure that Foundry is initialized in your project directory:

```shell
foundryup
```

Install dependencies. Foundry will automatically fetch required libraries from github

```shell
forge install
```

## Documentation

https://book.getfoundry.sh/

## Usage

Forge tests, builds, and deploys smart contracts.

### Build

```shell
$ forge build
```

### Test

Tests are handled through test files, written in Solidity and using the naming convention `Contract.t.sol`

```shell
$ forge test
```

### Format

```shell
$ forge fmt
```

### Gas Snapshots

```shell
$ forge snapshot
```

### Anvil

```shell
$ anvil
```

### Deploy

Deployments are handled through script files, written in Solidity and using the naming convention `Contract.s.sol`

You can run a script directly from your CLI

```shell
$ forge script script/Xeon.s.sol:XeonScript --rpc-url <your_rpc_url> --private-key <your_private_key>
```

Unless you include the `--broadcast` argument, the script will be run in a simulated environment. If you need to run the script live, use the `--broadcast` arg

**(CAUTION: This will initiate an onchain transaction, only use after thoroughly testing)**

```shell
$ forge script script/Xeon.s.sol:XeonScript --rpc-url <your_rpc_url> --private-key <your_private_key> --chain-id 1 -vv --broadcast
```

Additional arguments can specity the chain and verbosity of the script

```shell
$ forge script script/Xeon.s.sol:XeonScript --rpc-url <your_rpc_url> --private-key <your_private_key> --chain-id 1 -vv
```

When required, you can use environment variables to pass a private key directly into script functions to prevent exposing it in the command line (recommended).

**CAUTION: Always ensure you are using a `.env.local` and a proper `.gitignore` to prevent leaked keys.**

```js
vm.startBroadcast(vm.envUint('PRIVATE_KEY'));
```

Then running the CLI command

```shell
$ forge script script/Xeon.s.sol:XeonScript --rpc-url <your_rpc_url> --chain-id 1 -vv
```

### Anvil

Anvil is a local testnet node shipped with Foundry for testing contracts from frontends or for interacting over RPC.

To use Anvil, simply type `anvil` to see a list of accounts and private keys available for use, as well as the address and port that the node is listening on.

```shell
# number of dev accounts to generate and configure [default: 10]
anvil -a, --accounts <ACCOUNTS>

# EVM hardfork to use [default: latest]
anvil --hardfork <HARDFORK>

# port number to listen on [default: 8545]
anvil -p, --port <PORT>
```

The `genesis.json` file in Anvil serves a similar purpose as in Geth, defining the network's initial state. All values are to be defined as hexadecimals.

A sample for simulating mainnet via genesis can be found [here](https://github.com/paradigmxyz/reth/blob/8f3e4a15738d8174d41f4aede5570ecead141a77/crates/primitives/res/genesis/mainnet.json)

### Cast

Cast is a CLI for performing Ethereum RPC calls. You can make contract calls, send transactions, or retrieve any type of onchain data.

```shell
$ cast <subcommand>
```

### Chisel

Chisel is a Solidity REPL that allows developers to write and test Solidity code snippets.

More details on using `chisel` can be found [here](https://book.getfoundry.sh/reference/chisel/)

### Help

```shell
$ forge --help
$ anvil --help
$ cast --help
```
