// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.19;

import {Script, console2} from "forge-std/Script.sol";
import {XeonToken} from "../src/XeonToken.sol";

contract XeonTokenScript is Script {
    function setUp() public {}

    function run() public {
        vm.broadcast(vm.envUint("DEPLOYER_PRIVATE_KEY"));

        // deploy xeon token
        console2.log("deploying XeonToken contract...");
        XeonToken xeon = new XeonToken();

        vm.stopBroadcast();
    }
}
