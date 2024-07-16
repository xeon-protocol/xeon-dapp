// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.20;

import {Script, console2} from "forge-std/Script.sol";
import {XeonStaking} from "../src/XeonStaking.sol";

contract XeonStakingScript is Script {
    // address public deployer = 0x.....

    function setUp() public {}

    function run() public {
        vm.broadcast(vm.envUint("DEPLOYER_PRIVATE_KEY"));

        // deploy staking
        console2.log("deploying XeonStaking contract...");
        XeonStaking staking = new XeonStaking();

        vm.stopBroadcast();
    }
}
