// run TestnetHelper.s.sol
// obtain contracts from TestnetHelper deployment
// ---
// deploy hedging
// deploy staking
// deploy XEON token
// deploy price feed
// init price feed

// SPDX-License-Identifier: UNLICENSED
pragma solidity <=0.8.20;

import {Script, console2} from "forge-std/Script.sol";
import {XeonHedging} from "../src/XeonHedging.sol";
import {XeonStaking} from "../src/XeonStaking.sol";
import {XeonToken} from "../src/XeonToken.sol";
import {PriceOracle} from "../src/PriceOracle.sol";
import {TestnetHelperScript} from "../script/TestnetHelper.s.sol";

contract XeonProtocolScript is Script {
    TestnetHelperScript public testnetHelper;
    // address public deployer = 0x.....

    function setUp() public {}

    function run() public {
        // init testnet helper first
        testnetHelper = new TestnetHelperScript();
        testnetHelper.run();

        vm.broadcast(vm.envUint("DEPLOYER_PRIVATE_KEY"));

        // deploy hedging
        console2.log("deploying XeonHedging contract...");
        XeonHedging hedging = new XeonHedging();

        // deploy staking
        console2.log("deploying XeonStaking contract...");
        XeonStaking staking = new XeonStaking();

        // TESTNET ONLY: deploy XEON token
        console2.log("deploying XeonToken contract...");
        XeonToken token = new XeonToken();
        // deploy XEON LP
        // set xeon variables
        token.openTrading();

        // deploy price feed
        console2.log("deploying PriceOracle contract...");
        PriceOracle priceOracle = new PriceOracle();

        console2.log("initializing price oracle...");

        vm.stopBroadcast();
    }
}
