// SPDX-License-Identifier: UNLICENSED
pragma solidity <=0.8.20;

import {Script, console2} from "forge-std/Script.sol";
import {MockERC20} from "../src/MockERC20.sol";
import {MockERC20Factory} from "../src/MockERC20Factory.sol";

contract MockERC20FactoryScript is Script {
    // address public deployer = 0x.....

    function setUp() public {}

    function run() public {
        vm.broadcast();
    }
}
