// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.20;

import {Script} from "forge-std/Script.sol";
import {console2} from "forge-std/console2.sol";
import {XeonStaking} from "../src/XeonStaking.sol";

contract XeonStakingScript is Script {
    address public xeonToken = 0x0000000000000000000000000000000000000000;

    function setUp() public {}

    function run() public {
        vm.broadcast(vm.envUint("DEPLOYER_PRIVATE_KEY"));

        // deploy staking
        console2.log("deploying XeonStaking contract...");
        XeonStaking staking = new XeonStaking(xeonToken);

        vm.stopBroadcast();
    }
}
