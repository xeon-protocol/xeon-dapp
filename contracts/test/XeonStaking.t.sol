// SPDX-License-Identifier: UNLICENSED
pragma solidity <=0.8.20;

import {Test, console2} from "forge-std/Test.sol";
import {XeonToken} from "../src/XeonToken.sol";
import {XeonStaking} from "../src/XeonStaking.sol";

contract XeonStakingTest is Test {
    // test stake/unstake
    // test fee structure
    // test WETH payments
    XeonToken public xeonToken;
    XeonStaking public xeonStaking;

    function setUp() public {}
}
