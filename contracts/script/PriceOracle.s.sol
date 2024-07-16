// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.19;

import {Script, console2} from "forge-std/Script.sol";
import {PriceOracle} from "../src/PriceOracle.sol";

contract PriceOracleScript is Script {
    // address public deployer = 0x.....

    function setUp() public {}

    function run() public {
        vm.broadcast(vm.envUint("DEPLOYER_PRIVATE_KEY"));

        console2.log("deploying PriceOracle contract...");
        PriceOracle priceOracle = new PriceOracle();

        console2.log("initializing price oracle...");
        // initi oracle with values

        vm.stopBroadcast();
    }
}
