// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.7.6;
pragma abicoder v2;

import {Script} from "forge-std/Script.sol";
import {console2} from "forge-std/console2.sol";
import {PriceOracle} from "../src/PriceOracle.sol";

contract PriceOracleScript is Script {
    // address public deployer = 0x.....

    function setUp() public {}

    function run() public {
        vm.broadcast(vm.envUint("DEPLOYER_PRIVATE_KEY"));

        console.log("deploying PriceOracle contract...");
        PriceOracle priceOracle = new PriceOracle();

        console.log("initializing price oracle...");
        // initi oracle with values

        vm.stopBroadcast();
    }
}
