// SPDX-License-Identifier: UNLICENSED
pragma solidity <=0.8.19;

import {Test, console2} from "forge-std/Test.sol";
import {XeonOnboarding} from "../src/XeonOnboarding.sol";

contract XeonOnboardingTest is Test {
    // test onboarding flow
    // user is referring address
    // referring address increments (ensure cannot decrement)
    // ensure user cannot be their own referring address
    // ensure user cannot list more than one referring address
    XeonOnboarding public xeonOnboarding;

    function setUp() public {}
}
