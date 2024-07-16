// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.20;

import {Script, console2} from "forge-std/Script.sol";
import {ClaimHelper} from "../src/ClaimHelper.sol";

contract ClaimHelperScript is Script {
    function setUp() public {}

    function run() public {
        vm.broadcast(vm.envUint("DEPLOYER_PRIVATE_KEY"));

        // deploy hedging
        console2.log("deploying Airdropper contract...");
        ClaimHelper claimHelper = new ClaimHelper();

        vm.stopBroadcast();
    }
}
