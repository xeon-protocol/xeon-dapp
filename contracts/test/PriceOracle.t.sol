// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.7.6;

import {Test, console2} from "forge-std/Test.sol";
import {PriceOracle} from "../src/PriceOracle.sol";
// import UniPool Interface

contract PriceOracleTest is Test {
    // test setting oracle
    // test retreiving price
    // test price with zero liquidity
    // test stablecoin price
    // test WETH price
    // fuzz test all ERC20 tokens deployed
    PriceOracle public priceOracle;

    function setUp() public {}
}
