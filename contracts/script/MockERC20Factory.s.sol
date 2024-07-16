// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.20;

import {Script, console2} from "forge-std/Script.sol";
import {MockERC20Factory} from "../src/MockERC20Factory.sol";

contract MockERC20FactoryScript is Script {
    function setUp() public {}

    function run() public {
        vm.broadcast(vm.envUint("DEPLOYER_PRIVATE_KEY"));

        // deploy token factory
        console2.log("deploying MockERC20Factory contract...");
        MockERC20Factory mockERC20Factory = new MockERC20Factory();

        vm.stopBroadcast();
    }
}
