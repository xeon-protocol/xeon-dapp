// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.20;

import {Test, console2} from "forge-std/Test.sol";
import {ClaimHelper} from "../src/ClaimHelper.sol";
import {MockERC20, MockERC20Factory} from "../src/MockERC20Factory.sol";

contract ClaimHelperTest is Test {
    ClaimHelper public claimHelper;
    MockERC20Factory public mockERC20Factory;
    MockERC20 public mockERC20;
    address public admin = address(0x1);
    address public user1 = address(0x2);
    address public user2 = address(0x3);

    function setUp() public {
        mockERC20Factory = new MockERC20Factory();
        claimHelper = new ClaimHelper(mockERC20Factory);

        // Add admin role to deployer
        vm.startPrank(admin);
        mockERC20Factory.addAdmin(admin);
        claimHelper.addAdmin(admin);
        vm.stopPrank();

        // Deploy mock ERC20 token
        vm.startPrank(admin);
        address tokenAddress = mockERC20Factory.deploy("MockToken", "MTK", 18, 0); // Initial supply is 0
        mockERC20 = MockERC20(tokenAddress);
        vm.stopPrank();
    }

    function test_claimInitialWithReferral() public {
        console2.log("Testing user claiming initial tokens with referral...");
        vm.startPrank(user1);
        claimHelper.claimInitialWithReferral(address(mockERC20), admin);
        uint256 expectedBalance = 10_000 * 10 ** 18;
        uint256 actualBalance = mockERC20.balanceOf(user1);
        assertEq(expectedBalance, actualBalance, "User1 balance should be 10_000 MTK after initial claim with referral");
        vm.stopPrank();

        vm.startPrank(admin);
        uint256 referralBonus = 10_000 * 10 ** 18 / 10; // 10% bonus
        uint256 adminBalance = mockERC20.balanceOf(admin);
        console2.log("Admin balance after referral bonus:", adminBalance);
        assertEq(referralBonus, adminBalance, "Admin balance should have 10% referral bonus");
        vm.stopPrank();
    }

    function test_claimInitial() public {
        console2.log("Testing user claiming initial tokens without referral...");
        vm.startPrank(user2);
        claimHelper.claimInitial(address(mockERC20));
        uint256 expectedBalance = 10_000 * 10 ** 18;
        uint256 actualBalance = mockERC20.balanceOf(user2);
        assertEq(expectedBalance, actualBalance, "User2 balance should be 10_000 MTK after initial claim");
        vm.stopPrank();
    }

    function test_claimInitialAlreadyClaimed() public {
        console2.log("Testing user trying to claim initial tokens after already claiming...");
        vm.startPrank(user1);
        claimHelper.claimInitial(address(mockERC20));
        vm.expectRevert("ClaimHelper: Already claimed initial tokens");
        claimHelper.claimInitial(address(mockERC20));
        vm.stopPrank();
    }

    function test_adminFunctions() public {
        console2.log("Testing admin functions...");
        vm.startPrank(admin);

        // Add new admin
        claimHelper.addAdmin(user1);
        bool isAdmin = claimHelper.hasRole(claimHelper.ADMIN_ROLE(), user1);
        assertTrue(isAdmin, "User1 should be an admin");

        // Remove admin
        claimHelper.removeAdmin(user1);
        isAdmin = claimHelper.hasRole(claimHelper.ADMIN_ROLE(), user1);
        assertFalse(isAdmin, "User1 should not be an admin");

        vm.stopPrank();
    }

    function test_getterMethods() public {
        console2.log("Testing getter methods...");
        vm.startPrank(admin);

        // Set up initial claims with referral
        claimHelper.claimInitialWithReferral(address(mockERC20), admin);

        // Test getReferrals
        address[] memory referrals = claimHelper.getReferrals(admin);
        assertEq(referrals.length, 1, "Admin should have 1 referral");
        assertEq(referrals[0], user1, "Admin's referral should be User1");

        // Test getReferrer
        address referrer = claimHelper.getReferrer(user1);
        assertEq(referrer, admin, "User1's referrer should be Admin");

        // Test hasUserClaimedInitial
        bool hasClaimed = claimHelper.hasUserClaimedInitial(user1);
        assertTrue(hasClaimed, "User1 should have claimed initial tokens");

        // Test getReferralCount
        uint256 referralCount = claimHelper.getReferralCount(admin);
        assertEq(referralCount, 1, "Admin should have 1 referral");

        vm.stopPrank();
    }

    function test_claimTokens() public {
        console2.log("Testing claiming tokens once per week...");
        vm.startPrank(user1);
        claimHelper.claimTokens(address(mockERC20));
        uint256 expectedBalance = 10_000 * 10 ** 18;
        uint256 actualBalance = mockERC20.balanceOf(user1);
        assertEq(expectedBalance, actualBalance, "User1 balance should be 10_000 MTK after claiming tokens");

        vm.expectRevert("ClaimHelper: Claim only allowed once per week");
        claimHelper.claimTokens(address(mockERC20));
        vm.stopPrank();
    }

    function test_airdropTokens() public {
        console2.log("Testing admin airdropping tokens...");
        uint256 amount = 20_000 * 10 ** 18;

        vm.startPrank(admin);
        claimHelper.airdropTokens(user2, address(mockERC20), amount);

        uint256 expectedBalance = 20_000 * 10 ** 18;
        uint256 actualBalance = mockERC20.balanceOf(user2);
        assertEq(expectedBalance, actualBalance, "User2 balance should be 20_000 MTK after airdrop");
        vm.stopPrank();
    }

    function test_setTokenFactory() public {
        console2.log("Testing setting new MockERC20Factory address...");
        MockERC20Factory newFactory = new MockERC20Factory();

        vm.startPrank(admin);
        claimHelper.setTokenFactory(newFactory);
        assertEq(address(claimHelper.tokenFactory()), address(newFactory), "Token factory address should be updated");
        vm.stopPrank();
    }
}
