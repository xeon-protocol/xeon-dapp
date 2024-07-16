// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.19;

import {Script, console2} from "forge-std/Script.sol";
import {MockERC20} from "../src/MockERC20.sol";

contract MockERC20Script is Script {
    function setUp() public {}

    function run() public {
        vm.broadcast(vm.envUint("DEPLOYER_PRIVATE_KEY"));

        // deploy mockERC20
        console2.log("deploying MockERC20 contract...");
        MockERC20 mockERC20 = new MockERC20();

        vm.stopBroadcast();
    }
}
