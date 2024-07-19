// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.20;

import {Script} from "forge-std/Script.sol";

import {console2} from "forge-std/console2.sol";
import {XeonToken} from "../src/XeonToken.sol";
import {XeonStaking} from "../src/XeonStaking.sol";
import {XeonHedging} from "../src/XeonHedging.sol";

contract XeonProtocolScript is Script {
    // uncomment the contracts for the correct chain
    // first, deploy PriceOracle.sol and fill in address

    /* ============ Base Sepolia ============ */
    address public priceOracle = 0x0000000000000000000000000000000000000000;
    address public uniV2Factory = 0x0000000000000000000000000000000000000000;
    address public uniV3Factory = 0x0000000000000000000000000000000000000000;

    /* ============ Ethereum Mainnet ============ */
    // address public priceOracle = 0x0000000000000000000000000000000000000000;
    // address public uniV2Factory = 0x0000000000000000000000000000000000000000;
    // address public uniV3Factory = 0x0000000000000000000000000000000000000000;

    function setUp() public {}

    function run() public {
        vm.startBroadcast(vm.envUint("DEPLOYER_PRIVATE_KEY"));

        // deploy XeonToken
        console2.log("Deploying XeonToken contract...");
        XeonToken xeonToken = new XeonToken();
        console2.log("XeonToken contract deployed at:", address(xeonToken));

        // deploy  XeonStaking
        console2.log("Deploying XeonStaking contract...");
        XeonStaking xeonStaking = new XeonStaking(address(xeonToken));
        console2.log("XeonStaking contract deployed at:", address(xeonStaking));

        // deploy XeonHedging
        console2.log("Deploying XeonHedging contract...");
        XeonHedging xeonHedging = new XeonHedging(uniV2Factory, uniV3Factory, address(priceOracle), xeonStaking);
        console2.log("XeonHedging contract deployed at:", address(xeonHedging));

        vm.stopBroadcast();
    }
}
