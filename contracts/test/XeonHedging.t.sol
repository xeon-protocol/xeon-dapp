// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.20;

import {Test} from "forge-std/Test.sol";
import {console2} from "forge-std/console2.sol";
import {console2} from "forge-std/console2.sol";
import {XeonHedging} from "../src/XeonHedging.sol";

contract XeonHedgingTest is Test {
    // test hedging core logic
    // test broken price oracle on open and close
    XeonHedging public xeonHedging;

    function setUp() public {}

    function text_withdrawHedgeEarly() public {
        // TODO
    }

    /**
     * @notice test handling token with no liquidity
     */
    function test_ruggedToken() public {
        // TODO
        // 1. try creating hedge with zero-liquidity token
        // 2. open hedge with liquid token
        //    remove liquidity
        //    try to close hedge
    }
}
