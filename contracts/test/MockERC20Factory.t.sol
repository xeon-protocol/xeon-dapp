// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.20;

import {Test, console2} from "forge-std/Test.sol";
import {MockERC20Factory} from "../src/MockERC20Factory.sol";

contract MockERC20FactoryTest is Test {
    // test create tokens
    MockERC20Factory public mockERC20Factory;

    function setUp() public {}

    function test_createToken() public {
        // TODO
    }

    function test_mintAdditionalTokens() public {
        // TODO
    }

    function test_setAdminRole() public {
        // TODO
    }

    function test_onlyAdminCanMint() public {
        // try to have non-admin account mint
        // expect revert
    }
}
