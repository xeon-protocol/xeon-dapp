// script to deploy testnet utils
// deploy airdropper contract
// deploy claim contract
// deploy WETH contract
// deploy ERC20 Factory contract
// create multiple ERC20 tokens
// fund claim contract with WETH and ERC20s
// deploy LPs for WETH/ERC20
// fund LPs with WETH/ERC20 pools
// airdrop tokens to deployer address
pragma solidity <=0.8.20;

import {Script, console2} from "forge-std/Script.sol";
import {MockERC20} from "../src/MockERC20.sol";
import {MockERC20Factory} from "../src/MockERC20Factory.sol";
import {Airdropper} from "../src/Airdropper.sol";
import {XeonOnboarding} from "../src/XeonOnboarding.sol";

contract TestnetHelperScript is Script {
    // address public deployer = 0x.....

    function setUp() public {}

    function run() public {
        vm.broadcast();
    }
}
