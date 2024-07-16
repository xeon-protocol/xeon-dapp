// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.19;

import {Script, console2} from "forge-std/Script.sol";
import {XeonTestnetAirdropper} from "../src/XeonTestnetAirdropper.sol";

contract XeonTestnetAirdropperScript is Script {
    function setUp() public {}

    function run() public {
        vm.broadcast(vm.envUint("DEPLOYER_PRIVATE_KEY"));

        // deploy hedging
        console2.log("deploying Airdropper contract...");
        XeonTestnetAirdropper airdropper = new XeonTestnetAirdropper();

        vm.stopBroadcast();
    }
}
