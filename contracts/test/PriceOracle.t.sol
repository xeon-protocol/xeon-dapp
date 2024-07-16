// SPDX-License-Identifier: UNLICENSED
pragma solidity <=0.8.20;

import {Test, console2} from "forge-std/Test.sol";
import {PriceOracle} from "../src/PriceOracle.sol";
import {MockERC20Factory} from "../src/MockERC20Factory.sol";
// import UniPool Interface

contract PriceOracleTest is Test {
    // test setting oracle
    // test retreiving price
    // test price with zero liquidity
    // test stablecoin price
    // test WETH price
    // fuzz test all ERC20 tokens deployed
    PriceOracle public priceOracle;
    MockERC20Factory public mockERC20Factory;

    function setUp() public {}
}
