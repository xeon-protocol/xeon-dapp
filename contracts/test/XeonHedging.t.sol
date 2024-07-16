// SPDX-License-Identifier: UNLICENSED
pragma solidity <=0.8.20;

import {Test, console2} from "forge-std/Test.sol";
import {MockERC20} from "../src/MockERC20.sol";
import {XeonToken} from "../src/XeonToken.sol";
import {PriceOracle} from "../src/PriceOracle.sol";
import {XeonHedging} from "../src/XeonHedging.sol";

contract XeonHedgingTest is Test {
    // test hedging core logic
    // test rebase token
    // test stablecoin
    // test token that gets rugged (zero liquidity)
    // test broken price oracle on open and close
    MockERC20 public mockERC20;
    XeonToken public xeonToken;
    PriceOracle public priceOracle;
    XeonHedging public xeonHedging;

    function setUp() public {}
}
