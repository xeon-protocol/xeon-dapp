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

## Documentation

https://book.getfoundry.sh/

## Usage

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

You can also use environment variables to pass a private key directly into the `vm.startBroadcast()` function of the script to prevent exposing it in the command line (recommended).

```js
vm.startBroadcast(vm.envUint('PRIVATE_KEY'));
```

Then running the CLI command

```shell
$ forge script script/Xeon.s.sol:XeonScript --rpc-url <your_rpc_url> --chain-id 1 -vv
```

### Cast

```shell
$ cast <subcommand>
```

### Help

```shell
$ forge --help
$ anvil --help
$ cast --help
```
