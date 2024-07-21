// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.7.6;
pragma abicoder v2;

import {Script, console} from "forge-std/Script.sol";
import {PriceOracle} from "../src/PriceOracle.sol";

contract PriceOracleScript is Script {
    // address public deployer = 0x.....

    function setUp() public {}

    function run() public {
        vm.broadcast(vm.envUint("DEPLOYER_PRIVATE_KEY"));

        // console2.log("deploying PriceOracle contract...");
        PriceOracle priceOracle = new PriceOracle();
        console.log("PriceOracle contract deployed at:", address(priceOracle));

        console.log("initializing price oracle...");
        // initialize oracle with values

        vm.stopBroadcast();
    }
}
